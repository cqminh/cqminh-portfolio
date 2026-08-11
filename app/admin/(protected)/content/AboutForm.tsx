"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { saveAboutAction, type SaveAboutState } from "./actions";
import { SaveButton } from "@/components/admin/SaveButton";
import { UrlPreviewButton, UrlPreviewImage } from "@/components/admin/UrlPreview";
import { useJustSaved } from "@/hooks/useJustSaved";
import type { Localized, PhoneAppItem } from "@/types/content";

const initialState: SaveAboutState = { ok: false };

let nextKey = 0;
function uid() {
  nextKey += 1;
  return nextKey;
}

interface IntroRow {
  key: number;
  en: string;
  vi: string;
}

interface ChildRow {
  key: number;
  id: string;
  labelEn: string;
  labelVi: string;
  icon: string;
}

interface AppRow {
  key: number;
  type: "app";
  id: string;
  labelEn: string;
  labelVi: string;
  icon: string;
  href: string;
}

interface GroupRow {
  key: number;
  type: "group";
  id: string;
  labelEn: string;
  labelVi: string;
  children: ChildRow[];
}

type ItemRow = AppRow | GroupRow;

function introToRows(intro: Localized[]): IntroRow[] {
  return intro.length ? intro.map((s) => ({ key: uid(), en: s.en, vi: s.vi })) : [{ key: uid(), en: "", vi: "" }];
}

function itemsToRows(items: PhoneAppItem[]): ItemRow[] {
  return items.map((item) =>
    item.type === "app"
      ? { key: uid(), type: "app", id: item.id, labelEn: item.label.en, labelVi: item.label.vi, icon: item.icon, href: item.href }
      : {
          key: uid(),
          type: "group",
          id: item.id,
          labelEn: item.label.en,
          labelVi: item.label.vi,
          children: item.children.map((c) => ({ key: uid(), id: c.id, labelEn: c.label.en, labelVi: c.label.vi, icon: c.icon })),
        }
  );
}

function rowsToIntro(rows: IntroRow[]): Localized[] {
  return rows.map((r) => ({ en: r.en, vi: r.vi }));
}

function rowsToItems(rows: ItemRow[]): PhoneAppItem[] {
  return rows.map((r) =>
    r.type === "app"
      ? { type: "app", id: r.id, label: { en: r.labelEn, vi: r.labelVi }, icon: r.icon, href: r.href }
      : {
          type: "group",
          id: r.id,
          label: { en: r.labelEn, vi: r.labelVi },
          children: r.children.map((c) => ({ id: c.id, label: { en: c.labelEn, vi: c.labelVi }, icon: c.icon })),
        }
  );
}

const inputClass = "min-w-0 flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]";
const keyInputClass = "w-32 shrink-0 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-2 text-xs font-mono text-[var(--text-primary)]";
const removeBtnClass = "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-red-500";
const addBtnClass = "flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--card-bg-hover)]";

export function AboutForm({ intro, phoneApps }: { intro: Localized[]; phoneApps: PhoneAppItem[] }) {
  const [state, formAction, pending] = useActionState(saveAboutAction, initialState);
  const justSaved = useJustSaved(state);

  const [introRows, setIntroRows] = useState<IntroRow[]>(() => introToRows(intro));
  const [itemRows, setItemRows] = useState<ItemRow[]>(() => itemsToRows(phoneApps));
  const [previewKeys, setPreviewKeys] = useState<Set<number>>(new Set());

  const togglePreview = (key: number) => {
    setPreviewKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const updateIntro = (key: number, patch: Partial<IntroRow>) => {
    setIntroRows((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };
  const removeIntro = (key: number) => setIntroRows((rows) => rows.filter((r) => r.key !== key));
  const addIntro = () => setIntroRows((rows) => [...rows, { key: uid(), en: "", vi: "" }]);

  const updateItem = (key: number, patch: Partial<AppRow> | Partial<GroupRow>) => {
    setItemRows((rows) => rows.map((r) => (r.key === key ? ({ ...r, ...patch } as ItemRow) : r)));
  };
  const removeItem = (key: number) => setItemRows((rows) => rows.filter((r) => r.key !== key));
  const addApp = () => setItemRows((rows) => [...rows, { key: uid(), type: "app", id: "", labelEn: "", labelVi: "", icon: "", href: "" }]);
  const addGroup = () => setItemRows((rows) => [...rows, { key: uid(), type: "group", id: "", labelEn: "", labelVi: "", children: [] }]);

  const updateChild = (itemKey: number, childKey: number, patch: Partial<ChildRow>) => {
    setItemRows((rows) =>
      rows.map((r) =>
        r.key === itemKey && r.type === "group"
          ? { ...r, children: r.children.map((c) => (c.key === childKey ? { ...c, ...patch } : c)) }
          : r
      )
    );
  };
  const addChild = (itemKey: number) => {
    setItemRows((rows) =>
      rows.map((r) => (r.key === itemKey && r.type === "group" ? { ...r, children: [...r.children, { key: uid(), id: "", labelEn: "", labelVi: "", icon: "" }] } : r))
    );
  };
  const removeChild = (itemKey: number, childKey: number) => {
    setItemRows((rows) =>
      rows.map((r) => (r.key === itemKey && r.type === "group" ? { ...r, children: r.children.filter((c) => c.key !== childKey) } : r))
    );
  };

  const aboutData = JSON.stringify({ intro: rowsToIntro(introRows), phoneApps: rowsToItems(itemRows) });

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--text-primary)]">Intro text</span>
        <p className="text-xs text-[var(--text-muted)]">Each sentence renders on its own line beside the phone.</p>
        <div className="flex flex-col gap-2">
          {introRows.map((row) => (
            <div key={row.key} className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <textarea
                  value={row.en}
                  onChange={(e) => updateIntro(row.key, { en: e.target.value })}
                  placeholder="English"
                  rows={2}
                  className={inputClass}
                />
                <textarea
                  value={row.vi}
                  onChange={(e) => updateIntro(row.key, { vi: e.target.value })}
                  placeholder="Tiếng Việt"
                  rows={2}
                  className={inputClass}
                />
              </div>
              <button type="button" onClick={() => removeIntro(row.key)} className={removeBtnClass} aria-label="Remove sentence">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addIntro} className={addBtnClass}>
          <Plus className="h-3.5 w-3.5" />
          Add sentence
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--text-primary)]">Phone apps</span>
        <p className="text-xs text-[var(--text-muted)]">
          Shown as icons on the phone mockup. Leave an icon link empty to auto-generate a lettered placeholder tile. The key controls the
          placeholder letter, and matching one of github/linkedin/facebook/tiktok also links it into the Contact card&apos;s social row.
        </p>

        <div className="flex flex-col gap-3">
          {itemRows.map((row) =>
            row.type === "app" ? (
              <div key={row.key} className="rounded-lg border border-[var(--card-border)] p-3">
                <div className="flex items-start gap-2">
                  <input value={row.id} onChange={(e) => updateItem(row.key, { id: e.target.value })} placeholder="key" className={keyInputClass} />
                  <input
                    value={row.labelEn}
                    onChange={(e) => updateItem(row.key, { labelEn: e.target.value })}
                    placeholder="Label (EN)"
                    className={inputClass}
                  />
                  <input
                    value={row.labelVi}
                    onChange={(e) => updateItem(row.key, { labelVi: e.target.value })}
                    placeholder="Label (VI)"
                    className={inputClass}
                  />
                  <button type="button" onClick={() => removeItem(row.key)} className={removeBtnClass} aria-label="Remove app">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    value={row.icon}
                    onChange={(e) => updateItem(row.key, { icon: e.target.value })}
                    placeholder="Icon URL (optional — Cloudinary link)"
                    className={inputClass}
                  />
                  <UrlPreviewButton url={row.icon} open={previewKeys.has(row.key)} onToggle={() => togglePreview(row.key)} />
                  <input
                    value={row.href}
                    onChange={(e) => updateItem(row.key, { href: e.target.value })}
                    placeholder="Link (https://..., tel:..., mailto:...)"
                    className={inputClass}
                  />
                </div>
                {previewKeys.has(row.key) && row.icon && (
                  <div className="mt-2">
                    <UrlPreviewImage url={row.icon} className="h-16 w-16 rounded-[22%] border border-[var(--card-border)] object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <div key={row.key} className="rounded-lg border border-[var(--card-border)] p-3">
                <div className="flex items-start gap-2">
                  <input value={row.id} onChange={(e) => updateItem(row.key, { id: e.target.value })} placeholder="key" className={keyInputClass} />
                  <input
                    value={row.labelEn}
                    onChange={(e) => updateItem(row.key, { labelEn: e.target.value })}
                    placeholder="Label (EN)"
                    className={inputClass}
                  />
                  <input
                    value={row.labelVi}
                    onChange={(e) => updateItem(row.key, { labelVi: e.target.value })}
                    placeholder="Label (VI)"
                    className={inputClass}
                  />
                  <button type="button" onClick={() => removeItem(row.key)} className={removeBtnClass} aria-label="Remove group">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-col gap-2 border-l-2 border-[var(--card-border)] pl-3">
                  <span className="text-xs font-medium text-[var(--text-muted)]">Group items</span>
                  {row.children.map((child) => (
                    <div key={child.key} className="flex flex-col gap-2 rounded-lg bg-[var(--card-bg-hover)] p-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={child.id}
                          onChange={(e) => updateChild(row.key, child.key, { id: e.target.value })}
                          placeholder="key"
                          className={keyInputClass}
                        />
                        <input
                          value={child.labelEn}
                          onChange={(e) => updateChild(row.key, child.key, { labelEn: e.target.value })}
                          placeholder="Label (EN)"
                          className={inputClass}
                        />
                        <input
                          value={child.labelVi}
                          onChange={(e) => updateChild(row.key, child.key, { labelVi: e.target.value })}
                          placeholder="Label (VI)"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => removeChild(row.key, child.key)}
                          className={removeBtnClass}
                          aria-label="Remove group item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          value={child.icon}
                          onChange={(e) => updateChild(row.key, child.key, { icon: e.target.value })}
                          placeholder="Icon URL (optional — Cloudinary link)"
                          className={inputClass}
                        />
                        <UrlPreviewButton url={child.icon} open={previewKeys.has(child.key)} onToggle={() => togglePreview(child.key)} />
                      </div>
                      {previewKeys.has(child.key) && child.icon && (
                        <UrlPreviewImage url={child.icon} className="h-16 w-16 rounded-[22%] border border-[var(--card-border)] object-cover" />
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addChild(row.key)} className={addBtnClass}>
                    <Plus className="h-3.5 w-3.5" />
                    Add item to group
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={addApp} className={addBtnClass}>
            <Plus className="h-3.5 w-3.5" />
            Add app
          </button>
          <button type="button" onClick={addGroup} className={addBtnClass}>
            <Plus className="h-3.5 w-3.5" />
            Add group
          </button>
        </div>
      </div>

      <input type="hidden" name="about-data" value={aboutData} readOnly />

      {state.error && <p className="text-sm text-red-500">Couldn&apos;t save — check that every app/group has a key and both labels filled in.</p>}

      <SaveButton pending={pending} justSaved={justSaved} />
    </form>
  );
}
