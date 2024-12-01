"use client"

import { useEffect, useState, FormEvent } from "react";
import { Question as QuestionType, AnswerType } from "@prisma/client";
import { Plus, Trash } from "lucide-react";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Question({ q, isLast, questions, setQuestions }: {
  q: QuestionType, isLast: boolean, setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>,
  questions: QuestionType[]
}) {
  const { toast } = useToast();
  const formattedAnswerType = q.answerType.split('_').join(' ')[0].toUpperCase() + q.answerType.split('_').join(' ').slice(1).toLowerCase();

  const [open, setOpen] = useState(false);
  const [answerType, setAnswerType] = useState(q.answerType);
  const [identifier, setIdentifier] = useState(q.identifier);
  const [label, setLabel] = useState(q.label);
  const [placeholder, setPlaceholder] = useState(q.placeholder || "")
  const [required, setRequired] = useState(q.required);
  const [hidden, setHidden] = useState(q.hidden);
  const [options, setOptions] = useState<string[]>(["", "", ""])

  function handleSave(e: FormEvent) {
    e.preventDefault();

    const hasIdentifierChanged = q.identifier !== identifier;

    if (questions.find(question => question.identifier === identifier) && hasIdentifierChanged) {
      return toast({ title: 'Question with this identifier already exists', description: 'Try using something else for the identifier value', variant: 'destructive' })
    }

    const newQuestions = questions.map(question => {
      const isCurrentQuestion = question.identifier === q.identifier;

      if (!isCurrentQuestion) {
        return question;
      };

      return { ...question, label, required, answerType, identifier, placeholder, options }
    })

    setQuestions(newQuestions)
    setOpen(false);
  }

  useEffect(() => {
    const newQuestions = questions.map(question => question.identifier === q.identifier ? { ...question, hidden } : question);
    setQuestions(newQuestions)
  }, [hidden])

  return (
    <div className={`p-4 flex justify-between items-center ${!isLast && "border-b"}`}>
      <div>
        <div className='font-medium text-sm'>{q.label} {q.required && <Badge variant="outline">Required</Badge>} </div>
        <p className='text-sm text-foreground/80'>{formattedAnswerType}</p>
      </div>
      <div className="flex items-center gap-x-4">
        {q.isDeletable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch checked={!hidden} onCheckedChange={(v) => setHidden(!v)} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Show on booking page
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit question</DialogTitle>
              <DialogDescription>
                Editing question "{q.identifier}"
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
                  <SelectTrigger disabled={!q.isDeletable} className="mt-1" name="answerType" id="answerType">
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
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
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
                <Input className="mt-1" id="identifier" name="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} disabled={!q.isDeletable} required />
              </div>
              <div className="my-2">
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input className="mt-1" id="placeholder" name="placeholder" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
              </div>
              <div className="mt-2 flex items-center gap-x-2">
                <Label>Required</Label>
                <Switch checked={required} onCheckedChange={setRequired} disabled={!q.isDeletable} />
              </div>
              <DialogFooter>
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
      </div>
    </div>
  )
}
