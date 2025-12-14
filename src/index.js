export default {
    /**
     * The fetch handler is called for every incoming request to the Worker.
     * @param {Request} request - The request object.
     * @param {Object} env - The environment variables (from wrangler.toml or secrets).
     * @param {ExecutionContext} ctx - The execution context.
     * @returns {Response}
     */
    async fetch(request, env, ctx) {
        
        // 1. Define the HTML content as a string constant
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Worker Proxy Status</title>
                <style>
                    body { font-family: sans-serif; text-align: center; margin-top: 50px; background-color: #f0f0f0; }
                    h1 { color: #333; }
                    p { color: #666; }
                </style>
            </head>
            <body>
                <h1>Hello, Worker World!</h1>
                <p>The Insecure XML Proxy is running successfully.</p>
                <p>Request URL: ${request.url}</p>
            </body>
            </html>
        `;

        // 2. Create and return a new Response object
        // We must include the 'Content-Type' header to tell the browser 
        // that the content is HTML, not plain text.
        return new Response(htmlContent, {
            headers: {
                "Content-Type": "text/html;charset=UTF-8",
                "X-Proxy-Status": "Online" // Custom header for testing
            },
            status: 200 // HTTP OK
        });
    }
};