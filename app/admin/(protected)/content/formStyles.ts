// Shared Tailwind class strings for the admin content-editor forms
// (HeroForm, AboutForm, ProjectsForm, ExperienceForm, TechnologiesForm) —
// kept in one place since every form's row layout uses the same look.
export const inputClass =
  "min-w-0 flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]";
export const keyInputClass =
  "w-32 shrink-0 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-2 text-xs font-mono text-[var(--text-primary)]";
export const labelClass = "flex flex-col gap-1";
export const smallLabelClass = "text-xs text-[var(--text-muted)]";
export const removeBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-red-500";
export const addBtnClass =
  "flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--card-bg-hover)]";
