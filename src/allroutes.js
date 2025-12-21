

export const Proxy = {
  index: "/proxy",
  _index: "/proxy/",
  submit: "/proxy/submit",
  feed: "/proxy/feed",
  asset: "/proxy/asset",
  getRoute(pathname) {
    if (pathname === this.index || pathname == this._index) return this.index;
    if (pathname.startsWith(this.submit)) return this.submit;
    if (pathname.startsWith(this.feed))   return this.feed;
    if (pathname.startsWith(this.asset))  return this.asset;
    return null;
  }
};

Object.freeze(Proxy);

export function errorNotFound(request) {
  const url = new URL(request.url); 
  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 Not Found</title>
    </head>
    <body>
      <h1>404 Not Found</h1>
      <p>The requested resource was not found on this server.</p>
    </body>
  </html>
  `;
  console.log(`[error 404] ${url.pathname}`)
  return new Response(htmlContent, {
    headers: { "Content-Type": "text/html" },
    status: 404
  });
}

export function errorUnauthorized(request) {
  const url = new URL(request.url); 
  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>401 Unauthorized</title>
    </head>
    <body>
      <h1>401 Unauthorized</h1>
      <p>The key parameter was missing or incorrect</p>
    </body>
  </html>
  `;
  console.log(`[error 401] ${url.pathname}`)
  return new Response(htmlContent, {
    headers: { "Content-Type": "text/html" },
    status: 401
  });
}

export function errorInternalServer(request) {
  const url = new URL(request.url); 
  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>500 Internal Server Error</title>
    </head>
    <body>
      <h1>500 Internal Server Error</h1>
      <p>The target could not be reached</p>
    </body>
  </html>
  `;
  console.log(`[error 500] ${url.pathname}`)
  return new Response(htmlContent, {
    headers: { "Content-Type": "text/html" },
    status: 500
  });
}

export function errorTargetUnreachable(request) {
  const url = new URL(request.url); 
  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>501 Target Unreachable</title>
    </head>
    <body>
      <h1>501 Target Unreachable</h1>
      <p>The target could not be reached</p>
    </body>
  </html>
  `;
  console.log(`[error 502] ${url.pathname}`)
  return new Response(htmlContent, {
    headers: { "Content-Type": "text/html" },
    status: 502
  });
}