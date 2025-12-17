
export function getTargetURL(request) {
  const kConfirm = '/submit';
  const requestURL = new URL(request.url);
  const requestPath = requestURL.pathname;
  if (!requestPath.startsWith(kConfirm)) { return null; }
  const targetURL = requestURL.searchParams.get('url');
  if (targetURL) { return targetURL; }
  return null;
}

export async function getPage(request, env, ctx) {

  const targetURL = getTargetURL(request);
  const requestURL = new URL(request.url);
  if (!targetURL || !requestURL) { throw `[submit.js] requestURL or targetURL was NULL`; }
  const proxyOrigin = requestURL.origin;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Insecure XML Proxy</title>
  <style>
    body { font-family: sans-serif; line-height: 1.5; max-width: 600px; margin: 20px auto; padding: 0 10px; }
    input[type="text"], input[type="url"] { width: 100%; padding: 8px; margin: 8px 0; box-sizing: border-box; }
    .button-container { margin-top: 10px; display: flex; gap: 10px; }
    button { padding: 10px 20px; border: none; cursor: pointer; }
    .btn-submit { background: #007bff; color: white; }
    .btn-reset { background: #6c757d; color: white; }
    code { background: #eee; padding: 2px 4px; }
  </style>
</head>
<body>
  <h1>About</h2>
  <p>This proxy rewrites RSS feeds to change the asset URL's to flow through the
  proxy so that legacy computers with outdated or no TLS/SSL support can
  subscribe to website RSS feeds and podcast RSS feeds</p>
  <h2>Generated Proxied RSS URL</h2>
  <p>TargetURL: ${targetURL}</p>
</body>
</html>
    `;
    
  return new Response(htmlContent, {
    headers: { "Content-Type": "text/html" },
    status: 200
  });
}