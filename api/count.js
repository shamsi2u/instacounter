import { getToken } from './_token.js';

export default async function handler(req, res) {
  try {
    const t = await getToken();
    const r = await fetch(`https://graph.instagram.com/me?fields=username,followers_count,profile_picture_url&access_token=${t}`);
    const j = await r.json();
    if (j.error) return res.status(502).json({ error: j.error.message });
    // Edge cache: all screens share one upstream call per 20s.
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
    res.json({ username: j.username, followers: j.followers_count, avatar: j.profile_picture_url, ts: Date.now() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
