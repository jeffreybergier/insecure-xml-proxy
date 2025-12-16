
export function targetFeedURL(request) {
  const kConfirm = '/feed';
  const requestURL = new URL(request.url);
  const requestPath = requestURL.pathname;
  if (!requestPath.startsWith(kConfirm)) { return null; }
  const targetURL = requestURL.searchParams.get('url');
  if (targetURL) { return targetURL; }
  const targetPURL = requestURL.searchParams.get('purl');
  if (targetPURL) {
    try {
      const targetPURLDecoded = decodeURIComponent(targetPURL);
      return targetPURLDecoded;
    } catch (e) {
      console.error(`[feed.js] Failed to decode purl: ${targetPURL}`);
    }
  }
  return null;
}

export async function getFeed(request, env, ctx) {
  const targetURL = targetFeedURL(request);
  const requestURL = new URL(request.url);
  if (!targetURL || !requestURL) { throw `[feed.js] requestURL or targetURL was NULL`; }
  let response;
  try {
    console.log(`[feed.js] fetch(${targetURL})`);
    response = await fetch(targetURL);
  } catch (error) {
    console.error(`[feed.js] fetch() ${error.message}`);
    return new Response(`[feed.js] fetch() ${error.message}`, { status: 500 });
  }
  
  if (!response.ok) {
    console.error(`[feed.js] fetch() response(${response.status})`);
    return response;
  }
  
  const proxyOrigin = requestURL.origin;
  const searchPattern = /(https?:\/\/[^\s"']*\.(?:jpg|jpeg|gif|png|webm|mp3|aac)[^\s"']*)/gi;
  
  console.log(`[feed.js] response.text()`);
  const originalXML = await response.text();
  
  console.log(`[feed.js] originalXML.replace()`);
  const rewrittenXML = originalXML.replace(searchPattern, (match) => {
    const encodedMatch = encodeURIComponent(match);
    return `${proxyOrigin}/asset?purl=${encodedMatch}`;
  });
  
  const headers = new Headers(response.headers);
  headers.delete('Content-Length');
  
  console.log(`[feed.js] return ${JSON.stringify(Object.fromEntries(headers), null, 2)}`);
  return new Response(rewrittenXML, {
    status: response.status,
    headers: headers
  });
}
