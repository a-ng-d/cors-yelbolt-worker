interface Env {
  // Add your environment variables here if needed
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS, CONNECT, TRACE',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    if (url.pathname === '/favicon.ico') {
      return new Response(null, {
        status: 204,
      })
    }

    let targetUrl = url.search.slice(1)

    if (targetUrl.startsWith('url=')) {
      targetUrl = decodeURIComponent(targetUrl.slice(4))
    } else {
      targetUrl = decodeURIComponent(targetUrl)
    }

    if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
      try {
        const headers = new Headers()
        for (const [key, value] of request.headers.entries()) {
          if (!['host', 'connection', 'cf-connecting-ip', 'cf-ray', 'cf-visitor'].includes(key.toLowerCase())) {
            headers.set(key, value)
          }
        }

        const bodilessMethods = ['GET', 'HEAD', 'OPTIONS']

        const proxyRequest = new Request(targetUrl, {
          method: request.method,
          headers: headers,
          body: !bodilessMethods.includes(request.method) ? await request.blob() : null,
        })

        const response = await fetch(proxyRequest)

        const responseHeaders = new Headers(response.headers)
        responseHeaders.set('Access-Control-Allow-Origin', '*')
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS, CONNECT, TRACE')
        responseHeaders.set('Access-Control-Allow-Headers', '*')
        responseHeaders.delete('content-security-policy')
        responseHeaders.delete('x-frame-options')

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        })
      } catch (error) {
        console.error('Proxy error:', error)
        return new Response(
          JSON.stringify({
            error: 'Proxy request failed',
            message: error instanceof Error ? error.message : 'Unknown error',
          }),
          {
            status: 500,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          },
        )
      }
    }

    return new Response(
      JSON.stringify({
        message: 'CORS Proxy Worker',
        usage: 'Add the target URL as a query parameter: /?https://api.example.com/endpoint',
        example: '/?https://api.lemonsqueezy.com/v1/licenses/activate?license_key=XXX&instance_name=YYY',
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      },
    )
  },
}
