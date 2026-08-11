"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { saveProjectsAction, type SaveProjectsState } from "./actions";
import { SaveButton } from "@/components/admin/SaveButton";
import { UrlPreviewButton, UrlPreviewImage } from "@/components/admin/UrlPreview";
import { useJustSaved } from "@/hooks/useJustSaved";
import type { ProjectItem, Technology } from "@/types/content";

const initialState: SaveProjectsState = { ok: false };

interface ProjectRow {
  key: string;
  id: string;
  nameEn: string;
  nameVi: string;
  positionEn: string;
  positionVi: string;
  timeEn: string;
  timeVi: string;
  descriptionEn: string;
  descriptionVi: string;
  language: string[];
  contactImage: string;
  githubLink: string;
  projectLink: string;
}

function newRow(): ProjectRow {
  return {
    key: crypto.randomUUID(),
    id: crypto.randomUUID(),
    nameEn: "",
    nameVi: "",
    positionEn: "",
    positionVi: "",
    timeEn: "",
    timeVi: "",
    descriptionEn: "",
    descriptionVi: "",
    language: [],
    contactImage: "",
    githubLink: "",
    projectLink: "",
  };
}

function itemsToRows(items: ProjectItem[]): ProjectRow[] {
  return items.map((item) => ({
    key: crypto.randomUUID(),
    id: item.id,
    nameEn: item.name.en,
    nameVi: item.name.vi,
    positionEn: item.position.en,
    positionVi: item.position.vi,
    timeEn: item.time.en,
    timeVi: item.time.vi,
    descriptionEn: item.description.en,
    descriptionVi: item.description.vi,
    language: item.language,
    contactImage: item.contactImage,
    githubLink: item.githubLink ?? "",
    projectLink: item.projectLink ?? "",
  }));
}

function rowsToItems(rows: ProjectRow[]): ProjectItem[] {
  return rows.map((r) => ({
    id: r.id,
    name: { en: r.nameEn, vi: r.nameVi },
    time: { en: r.timeEn, vi: r.timeVi },
    description: { en: r.descriptionEn, vi: r.descriptionVi },
    position: { en: r.positionEn, vi: r.positionVi },
    language: r.language,
    contactImage: r.contactImage,
    ...(r.githubLink && { githubLink: r.githubLink }),
    ...(r.projectLink && { projectLink: r.projectLink }),
  }));
}

const inputClass = "min-w-0 flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]";
const labelClass = "flex flex-col gap-1";
const smallLabelClass = "text-xs text-[var(--text-muted)]";
const removeBtnClass = "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-red-500";
const addBtnClass = "flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--card-bg-hover)]";

export function ProjectsForm({ items, technologies }: { items: ProjectItem[]; technologies: Technology[] }) {
  const [state, formAction, pending] = useActionState(saveProjectsAction, initialState);
  const justSaved = useJustSaved(state);

  const [rows, setRows] = useState<ProjectRow[]>(() => (items.length ? itemsToRows(items) : [newRow()]));
  const [previewKeys, setPreviewKeys] = useState<Set<string>>(new Set());

  const togglePreview = (key: string) => {
    setPreviewKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const updateRow = (key: string, patch: Partial<ProjectRow>) => {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };
  const removeRow = (key: string) => setRows((rs) => rs.filter((r) => r.key !== key));
  const addRow = () => setRows((rs) => [...rs, newRow()]);

  const toggleLanguage = (key: string, techId: string) => {
    setRows((rs) =>
      rs.map((r) =>
        r.key === key ? { ...r, language: r.language.includes(techId) ? r.language.filter((id) => id !== techId) : [...r.language, techId] } : r
      )
    );
  };

  const projectsData = JSON.stringify(rowsToItems(rows));

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-3 rounded-lg border border-[var(--card-border)] p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <label className={labelClass}>
                  <span className={smallLabelClass}>Name (EN)</span>
                  <input value={row.nameEn} onChange={(e) => updateRow(row.key, { nameEn: e.target.value })} className={inputClass} />
                </label>
                <label className={labelClass}>
                  <span className={smallLabelClass}>Name (VI)</span>
                  <input value={row.nameVi} onChange={(e) => updateRow(row.key, { nameVi: e.target.value })} className={inputClass} />
                </label>
              </div>
              <button type="button" onClick={() => removeRow(row.key)} className={removeBtnClass} aria-label="Remove project">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className={labelClass}>
                <span className={smallLabelClass}>Position (EN)</span>
                <input value={row.positionEn} onChange={(e) => updateRow(row.key, { positionEn: e.target.value })} className={inputClass} />
              </label>
              <label className={labelClass}>
                <span className={smallLabelClass}>Position (VI)</span>
                <input value={row.positionVi} onChange={(e) => updateRow(row.key, { positionVi: e.target.value })} className={inputClass} />
              </label>
              <label className={labelClass}>
                <span className={smallLabelClass}>Time range (EN)</span>
                <input
                  value={row.timeEn}
                  onChange={(e) => updateRow(row.key, { timeEn: e.target.value })}
                  placeholder="e.g. 2023 - Present"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                <span className={smallLabelClass}>Time range (VI)</span>
                <input
                  value={row.timeVi}
                  onChange={(e) => updateRow(row.key, { timeVi: e.target.value })}
                  placeholder="vd: 2023 - Hiện tại"
                  className={inputClass}
                />
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
              <span className={smallLabelClass}>Technologies</span>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech) => {
                  const active = row.language.includes(tech.id);
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => toggleLanguage(row.key, tech.id)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-transparent text-white"
                          : "border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--card-bg-hover)]"
                      }`}
                      style={active ? { backgroundColor: tech.color } : undefined}
                    >
                      {tech.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className={labelClass}>
              <span className={smallLabelClass}>Featured image (optional — Cloudinary link)</span>
              <div className="flex items-center gap-2">
                <input
                  value={row.contactImage}
                  onChange={(e) => updateRow(row.key, { contactImage: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className={inputClass}
                />
                <UrlPreviewButton url={row.contactImage} open={previewKeys.has(row.key)} onToggle={() => togglePreview(row.key)} />
              </div>
            </label>
            {previewKeys.has(row.key) && row.contactImage && (
              <UrlPreviewImage url={row.contactImage} className="h-24 w-40 rounded-lg border border-[var(--card-border)] object-cover" />
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              <label className={labelClass}>
                <span className={smallLabelClass}>GitHub link (optional)</span>
                <input value={row.githubLink} onChange={(e) => updateRow(row.key, { githubLink: e.target.value })} className={inputClass} />
              </label>
              <label className={labelClass}>
                <span className={smallLabelClass}>Live project link (optional)</span>
                <input value={row.projectLink} onChange={(e) => updateRow(row.key, { projectLink: e.target.value })} className={inputClass} />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addRow} className={addBtnClass}>
        <Plus className="h-3.5 w-3.5" />
        Add project
      </button>

      <input type="hidden" name="projects-data" value={projectsData} readOnly />

      {state.error && <p className="text-sm text-red-500">Couldn&apos;t save — check the data and try again.</p>}

      <SaveButton pending={pending} justSaved={justSaved} />
    </form>
  );
}
