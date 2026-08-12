"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { saveExperienceAction, type SaveExperienceState } from "./actions";
import { addBtnClass, inputClass, labelClass, removeBtnClass, smallLabelClass } from "./formStyles";
import { SaveButton } from "@/components/admin/SaveButton";
import { UrlPreviewButton, UrlPreviewImage } from "@/components/admin/UrlPreview";
import { useJustSaved } from "@/hooks/useJustSaved";
import { useToggleSet } from "@/hooks/useToggleSet";
import { EXPERIENCE_CARD_COLORS } from "@/types/content";
import type { ExperienceCardColor, ExperienceItem } from "@/types/content";

const initialState: SaveExperienceState = { ok: false };

interface ExperienceRow {
  key: string;
  id: string;
  titleEn: string;
  titleVi: string;
  company: string;
  startYear: string;
  endYear: string;
  present: boolean;
  descriptionEn: string;
  descriptionVi: string;
  image: string;
  color: ExperienceCardColor;
}

function newRow(): ExperienceRow {
  return {
    key: crypto.randomUUID(),
    id: crypto.randomUUID(),
    titleEn: "",
    titleVi: "",
    company: "",
    startYear: String(new Date().getFullYear()),
    endYear: "",
    present: true,
    descriptionEn: "",
    descriptionVi: "",
    image: "",
    color: "blue",
  };
}

function itemsToRows(items: ExperienceItem[]): ExperienceRow[] {
  return items.map((item) => ({
    key: crypto.randomUUID(),
    id: item.id,
    titleEn: item.title.en,
    titleVi: item.title.vi,
    company: item.company,
    startYear: String(item.startYear),
    endYear: item.endYear === null ? "" : String(item.endYear),
    present: item.endYear === null,
    descriptionEn: item.description.en,
    descriptionVi: item.description.vi,
    image: item.image,
    color: item.color,
  }));
}

function rowsToItems(rows: ExperienceRow[]): ExperienceItem[] {
  return rows.map((r) => ({
    id: r.id,
    title: { en: r.titleEn, vi: r.titleVi },
    company: r.company,
    startYear: Number(r.startYear) || 0,
    endYear: r.present ? null : Number(r.endYear) || null,
    description: { en: r.descriptionEn, vi: r.descriptionVi },
    image: r.image,
    color: r.color,
  }));
}

const yearInputClass = "w-24 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]";

export function ExperienceForm({ items }: { items: ExperienceItem[] }) {
  const [state, formAction, pending] = useActionState(saveExperienceAction, initialState);
  const justSaved = useJustSaved(state);

  const [rows, setRows] = useState<ExperienceRow[]>(() => (items.length ? itemsToRows(items) : [newRow()]));
  const [previewKeys, togglePreview] = useToggleSet<string>();

  const updateRow = (key: string, patch: Partial<ExperienceRow>) => {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };
  const removeRow = (key: string) => setRows((rs) => rs.filter((r) => r.key !== key));
  const addRow = () => setRows((rs) => [...rs, newRow()]);

  const experienceData = JSON.stringify(rowsToItems(rows));

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-3 rounded-lg border border-[var(--card-border)] p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <label className={labelClass}>
                  <span className={smallLabelClass}>Title (EN)</span>
                  <input value={row.titleEn} onChange={(e) => updateRow(row.key, { titleEn: e.target.value })} className={inputClass} />
                </label>
                <label className={labelClass}>
                  <span className={smallLabelClass}>Title (VI)</span>
                  <input value={row.titleVi} onChange={(e) => updateRow(row.key, { titleVi: e.target.value })} className={inputClass} />
                </label>
              </div>
              <button type="button" onClick={() => removeRow(row.key)} className={removeBtnClass} aria-label="Remove entry">
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className={labelClass}>
              <span className={smallLabelClass}>Company</span>
              <input value={row.company} onChange={(e) => updateRow(row.key, { company: e.target.value })} className={inputClass} />
            </label>

            <div className="flex flex-wrap items-end gap-3">
              <label className={labelClass}>
                <span className={smallLabelClass}>Start year</span>
                <input
                  type="number"
                  value={row.startYear}
                  onChange={(e) => updateRow(row.key, { startYear: e.target.value })}
                  className={yearInputClass}
                />
              </label>
              <label className={labelClass}>
                <span className={smallLabelClass}>End year</span>
                <input
                  type="number"
                  value={row.endYear}
                  disabled={row.present}
                  onChange={(e) => updateRow(row.key, { endYear: e.target.value })}
                  className={`${yearInputClass} disabled:cursor-not-allowed disabled:opacity-40`}
                />
              </label>
              <label className="flex items-center gap-1.5 pb-2 text-xs text-[var(--text-secondary)]">
                <input type="checkbox" checked={row.present} onChange={(e) => updateRow(row.key, { present: e.target.checked })} />
                Still ongoing (Present)
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className={labelClass}>
                <span className={smallLabelClass}>Description (EN)</span>
                <textarea
                  value={row.descriptionEn}
                  onChange={(e) => updateRow(row.key, { descriptionEn: e.target.value })}
                  rows={2}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className={smallLabelClass}>Description (VI)</span>
                <textarea
                  value={row.descriptionVi}
                  onChange={(e) => updateRow(row.key, { descriptionVi: e.target.value })}
                  rows={2}
                  className={inputClass}
                />
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <span className={smallLabelClass}>Card accent color</span>
              <div className="flex flex-wrap gap-1.5">
                {EXPERIENCE_CARD_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateRow(row.key, { color })}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      row.color === color
                        ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent-text)]"
                        : "border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--card-bg-hover)]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <label className={labelClass}>
              <span className={smallLabelClass}>Photo (optional — Cloudinary link)</span>
              <div className="flex items-center gap-2">
                <input
                  value={row.image}
                  onChange={(e) => updateRow(row.key, { image: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className={inputClass}
                />
                <UrlPreviewButton url={row.image} open={previewKeys.has(row.key)} onToggle={() => togglePreview(row.key)} />
              </div>
            </label>
            {previewKeys.has(row.key) && row.image && (
              <UrlPreviewImage url={row.image} className="h-24 w-40 rounded-lg border border-[var(--card-border)] object-cover" />
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={addRow} className={addBtnClass}>
        <Plus className="h-3.5 w-3.5" />
        Add entry
      </button>

      <input type="hidden" name="experience-data" value={experienceData} readOnly />

      {state.error && <p className="text-sm text-red-500">Couldn&apos;t save — check the data and try again.</p>}

      <SaveButton pending={pending} justSaved={justSaved} />
    </form>
  );
}
