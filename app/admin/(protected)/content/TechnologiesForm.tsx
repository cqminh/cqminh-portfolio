"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { saveTechnologiesAction, type SaveTechnologiesState } from "./actions";
import { addBtnClass, inputClass, keyInputClass, removeBtnClass } from "./formStyles";
import { SaveButton } from "@/components/admin/SaveButton";
import { useJustSaved } from "@/hooks/useJustSaved";
import type { Technology } from "@/types/content";

const initialState: SaveTechnologiesState = { ok: false };

let nextId = 0;
function makeRow(tech: Technology) {
  nextId += 1;
  return { key: nextId, id: tech.id, name: tech.name, color: tech.color };
}

export function TechnologiesForm({ items }: { items: Technology[] }) {
  const [state, formAction, pending] = useActionState(saveTechnologiesAction, initialState);
  const justSaved = useJustSaved(state);

  const [rows, setRows] = useState(() => (items.length ? items.map(makeRow) : [makeRow({ id: "", name: "", color: "#8b5cf6" })]));

  const updateRow = (key: number, patch: Partial<{ id: string; name: string; color: string }>) => {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };
  const removeRow = (key: number) => setRows((rs) => rs.filter((r) => r.key !== key));
  const addRow = () => setRows((rs) => [...rs, makeRow({ id: "", name: "", color: "#8b5cf6" })]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-2">
            <input
              name="tech-id"
              value={row.id}
              onChange={(e) => updateRow(row.key, { id: e.target.value })}
              placeholder="key (e.g. nextjs)"
              className={keyInputClass}
            />
            <input
              name="tech-name"
              value={row.name}
              onChange={(e) => updateRow(row.key, { name: e.target.value })}
              placeholder="Display name (e.g. Next.js)"
              className={inputClass}
            />
            <input
              type="color"
              value={row.color}
              onChange={(e) => updateRow(row.key, { color: e.target.value })}
              className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-[var(--card-border)] bg-transparent p-1"
              aria-label="Badge color"
            />
            <input name="tech-color" value={row.color} onChange={(e) => updateRow(row.key, { color: e.target.value })} className={`${keyInputClass} w-24`} />
            <span
              className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: `${row.color}1a`, color: row.color, borderColor: `${row.color}55` }}
            >
              {row.name || "Preview"}
            </span>
            <button type="button" onClick={() => removeRow(row.key)} className={removeBtnClass} aria-label="Remove technology">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addRow} className={addBtnClass}>
        <Plus className="h-3.5 w-3.5" />
        Add technology
      </button>

      {state.error && (
        <p className="text-sm text-red-500">Every row needs a key, a display name, and a valid hex color (e.g. #61DAFB).</p>
      )}

      <SaveButton pending={pending} justSaved={justSaved} />
    </form>
  );
}
