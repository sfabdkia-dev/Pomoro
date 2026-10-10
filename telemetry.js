// Main-process side of the optional anonymous research telemetry (PostHog EU).
// The renderer builds a coarse daily summary; this file validates it and posts it.
// No IP is stored: events are sent with $ip: null and without person profiles, and the
// PostHog project must also have "Discard client IP data" enabled.
const { app, net } = require('electron');

// TODO(author): fill in before release. The project key is write-only and safe to ship.
const POSTHOG_HOST = 'https://eu.i.posthog.com';
const POSTHOG_KEY = 'phc_rkPZsiebYpzW8dmZc82kwcsMW8jsfLUxWorhUyp7TbWG';
// Public URL of docs/privacy.md; also entered in Partner Center.
const PRIVACY_URL = 'https://github.com/sfabdkia-dev/Pomoro/blob/main/docs/privacy.md';

// EU + EEA + UK + Switzerland. Telemetry is opt-in here (off until accepted).
const STRICT_REGIONS = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'IS', 'LI', 'NO', 'GB', 'CH',
]);

function detectRegion() {
  // POMORO_TELEMETRY_REGION=DE lets you test the opt-in flow without changing Windows settings.
  const override = process.env.POMORO_TELEMETRY_REGION;
  if (override) return override.toUpperCase();
  let code = '';
  try { code = app.getLocaleCountryCode() || ''; } catch (_) { /* older API */ }
  if (!code) {
    const m = /[-_]([A-Za-z]{2})\b/.exec(app.getSystemLocale() || app.getLocale() || '');
    code = m ? m[1] : '';
  }
  return code.toUpperCase();
}

// Unknown region is treated as strict: when in doubt, ask first.
function getRegionPolicy() {
  const region = detectRegion();
  return { region, strict: !region || STRICT_REGIONS.has(region) };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Flat object of short strings / finite numbers / booleans only.
function sanitizeProperties(props) {
  const out = {};
  if (!props || typeof props !== 'object') return out;
  for (const [k, v] of Object.entries(props)) {
    if (!/^[a-z0-9_]{1,40}$/i.test(k)) continue;
    if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'string' && v.length <= 40) out[k] = v;
  }
  return out;
}

async function sendDailySummary(payload) {
  const { id, date, properties } = payload || {};
  if (typeof id !== 'string' || !UUID_RE.test(id)) return { ok: false, error: 'bad id' };
  if (typeof date !== 'string' || !DATE_RE.test(date)) return { ok: false, error: 'bad date' };
  if (POSTHOG_KEY.includes('REPLACE')) return { ok: false, error: 'not configured' };
  const body = {
    api_key: POSTHOG_KEY,
    event: 'daily_summary',
    distinct_id: id,
    properties: {
      ...sanitizeProperties(properties),
      summary_date: date,
      $process_person_profile: false,
      $ip: null,
    },
  };
  try {
    const res = await net.fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { ok: res.ok };
  } catch (err) {
    return { ok: false, error: String(err && err.message || err) };
  }
}

module.exports = { PRIVACY_URL, getRegionPolicy, sendDailySummary };
