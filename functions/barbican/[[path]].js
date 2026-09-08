// The Barbican model moved from /barbican to /the-barbican. Cloudflare Pages
// keeps deleted files in its edge cache for up to a week after a deploy, so
// without this the old URLs kept serving the stale copy. Functions run before
// static assets are looked up, so this guarantees a real 404 for /barbican/*.
export async function onRequest({ request, env }) {
  const notFound = await env.ASSETS.fetch(new URL('/404.html', request.url));
  return new Response(notFound.body, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}
