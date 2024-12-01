import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="animate-spin !size-12" />
    </div>
  )
}