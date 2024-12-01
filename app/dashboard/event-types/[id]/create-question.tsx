'use client'

import React, { FormEvent, useState } from 'react'
import { Plus, Trash } from 'lucide-react'
import { AnswerType, Question } from '@prisma/client'

import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export default function CreateQuestion({ questions, setQuestions }: { questions: Question[], setQuestions: React.Dispatch<React.SetStateAction<Question[]>> }) {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [answerType, setAnswerType] = useState<AnswerType>('ONE_LINE');
  const [identifier, setIdentifier] = useState('');
  const [label, setLabel] = useState('');
  const [placeholder, setPlaceholder] = useState("")
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<string[]>(["", "", ""])

  function handleSave(e: FormEvent) {
    e.preventDefault();

    if (questions.find(question => question.identifier === identifier)) {
      return toast({ title: 'Question with this identifier already exists', description: 'Try using something else for the identifier value', variant: 'destructive' })
    }

    setQuestions([...questions, { label, required, answerType, identifier, placeholder, options, isDeletable: true, hidden: false }])
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className='mt-4'>
          <Plus /> Add question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create question</DialogTitle>
          <DialogDescription>
            Create a new question for this event type
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave}>
          <div className="mb-2">
            <Label htmlFor="label">Label</Label>
            <Input className="mt-1" id="label" name="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          </div>
          <div className="my-2">
            <Label htmlFor="answerType">Answer type</Label>
            <Select value={answerType} onValueChange={(v) => setAnswerType(v as AnswerType)}>
              <SelectTrigger className="mt-1" name="answerType" id="answerType">
                <SelectValue placeholder="Input type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "MULTIPLE_LINES",
                  "ONE_LINE",
                  "PHONE_NUMBER",
                  "EMAIL",
                  "RADIO_BUTTONS",
                  "CHECKBOXES",
                  "DROPDOWN",
                  "NUMBER"
                ].map(t => (
                  <SelectItem key={t} value={t}>{t.split('_').join(' ')[0].toUpperCase()}{t.split('_').join(' ').slice(1).toLowerCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {["DROPDOWN", "RADIO_BUTTONS", "CHECKBOXES"].includes(answerType) && (
            <div className='mt-2 space-y-2'>
              {options.map((option, currentIndex) => (
                <div className="flex gap-x-2" key={currentIndex} >
                  <Input value={option} onChange={(e) => setOptions(options.map((o, i) => i === currentIndex ? e.target.value : o))} />
                  <Button type="button" size="icon" variant="outline" onClick={() => setOptions(options.filter((option, i) => i !== currentIndex))}> <Trash /> </Button>
                </div>
              ))}
              <Button type="button" variant="ghost" onClick={() => setOptions([...options, ''])}><Plus /> Add another</Button>
            </div>
          )}
          <div className="my-2">
            <Label htmlFor="identifier">Identifier</Label>
            <Input className="mt-1" id="identifier" name="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </div>
          <div className="my-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input className="mt-1" id="placeholder" name="placeholder" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
          </div>
          <div className="my-2 flex items-center gap-x-2">
            <Label>Required</Label>
            <Switch checked={required} onCheckedChange={setRequired} />
          </div>
          <DialogFooter className='mt-4'>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Close</Button>
            </DialogClose>
            <Button>
              Save
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}
