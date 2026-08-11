// Synthetic `visits.path` values for click events (not real pageviews), so
// they can reuse the existing tracking pipeline (device/language/referrer
// already captured) without a dedicated table. Kept in their own module
// (no `lib/db` import) so client components can import the constant without
// pulling server-only DB code into the browser bundle.
export const RESUME_CLICK_EVENT_PATH = "event:resume_click";
