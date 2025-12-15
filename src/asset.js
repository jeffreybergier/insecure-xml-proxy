
export function isAsset(request) {
  const kConfirm = '/asset';
  const requestURL = new URL(request.url);
  const requestPath = requestURL.pathname;
  return requestPath.startsWith(kConfirm);
}

export async function getAsset(request, env, ctx) {
  if (!isAsset(request)) { throw `Not Asset: ${request}`; }
  const requestURL = new URL(request.url);
  const targetURL = requestURL.searchParams.get('url');
  console.log(`[asset.js] fetch(${targetURL})`);
  return await fetch(targetURL, {
      headers: request.headers 
  });
}
