export async function requestToJSON(url) {
    return {
        type: 'request',
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    };
}

export async function handleRequest(requestData) {
    try {
        const { url, method, headers } = requestData;
        console.log(`[Proxy] Fetching: ${url}`);

        // Note: This fetch will be subject to the Host browser's CORS policy.
        // We try 'cors' first, then 'no-cors' if needed (though no-cors is opaque).
        // Text content is only available for CORS-enabled resources.
        const response = await fetch(url, {
            method,
            // headers, // Forwarding headers often triggers preflight CORS which fails on simple fetches
        });

        const text = await response.text();

        return {
            type: 'response',
            data: {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                headers: Array.from(response.headers.entries()),
                body: text
            }
        };
    } catch (err) {
        console.error('[Proxy] Fetch error:', err);
        return {
            type: 'response',
            data: {
                error: err.message,
                body: `<h1>Proxy Error</h1><p>${err.message}</p><p>Note: This proxy is limited by Cross-Origin Resource Sharing (CORS). It can only fetch resources that allow access from this origin.</p>`
            }
        };
    }
}

export function renderResponse(container, responseData) {
    const { body, error } = responseData;
    // Safety: Sanitize strictly if this were a real app. For prototype, we set innerHTML.
    // We'll use a shadow DOM or iframe ideally, but innerHTML is simplest for now.
    // Be careful of scripts. To be safer, we can remove script tags.

    if (error) {
        container.innerHTML = body;
        return;
    }

    // Basic cleaning of body to remove scripts for safety in this demo
    const cleanBody = body.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "");
    container.innerHTML = cleanBody;
}
