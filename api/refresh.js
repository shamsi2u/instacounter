import { getToken, setToken } from './_token.js';

// Weekly cron. Long-lived IG tokens last 60 days; refreshing resets the clock.
export default async function handler(req, res) {
  const s = process.env.CRON_SECRET;
  if (s && req.headers.authorization !== `Bearer ${s}`) return res.status(401).end();
  const t = await getToken();
  const j = await (await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${t}`)).json();
  if (!j.access_token) return res.status(502).json(j);
  const saved = await setToken(j.access_token);
  res.json({ ok: true, saved, expires_in_days: Math.round(j.expires_in / 86400) });
}
