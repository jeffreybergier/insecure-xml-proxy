
export function isFeed(request) {
  const kConfirm = '/feed';
  const requestURL = new URL(request.url);
  const requestPath = requestURL.pathname;
  return requestPath.startsWith(kConfirm);
}

export async function getFeed(request, env, ctx) {
  if (!isFeed(request)) { throw `Not Feed: ${request}`; }
  const requestURL = new URL(request.url);
  const targetURL = requestURL.searchParams.get('url');
  console.log(`[feed.js] fetch(${targetURL})`);
  return await fetch(targetURL, {
      headers: request.headers 
  });
}
