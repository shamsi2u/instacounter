// Token store: Upstash Redis if configured (needed for auto-refresh), else IG_TOKEN env.
const U = process.env.UPSTASH_REDIS_REST_URL, K = process.env.UPSTASH_REDIS_REST_TOKEN;
const h = { Authorization: `Bearer ${K}` };

export async function getToken() {
  if (U) {
    const j = await (await fetch(`${U}/get/ig_token`, { headers: h })).json();
    if (j.result) return j.result;
  }
  return process.env.IG_TOKEN;
}

export async function setToken(t) {
  if (!U) return false;
  await fetch(`${U}/set/ig_token/${encodeURIComponent(t)}`, { headers: h });
  return true;
}
