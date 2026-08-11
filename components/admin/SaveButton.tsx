"use client";

import { Check, Loader2 } from "lucide-react";

interface SaveButtonProps {
  pending: boolean;
  justSaved: boolean;
}

export function SaveButton({ pending, justSaved }: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 disabled:cursor-not-allowed ${
        justSaved ? "bg-green-600" : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-70"
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : justSaved ? (
        <>
          <Check className="h-4 w-4" />
          Saved
        </>
      ) : (
        "Save"
      )}
    </button>
  );
}
