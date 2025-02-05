async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 如果请求的是根路径，返回简单响应
  if (pathname === '/') {
    return new Response('Groq Proxy is Running!', {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // 将请求转发到 Groq API
  const targetUrl = `https://${pathname}`;
  
  try {
    // 处理请求头
    const headers = new Headers();
    const allowedHeaders = ['accept', 'content-type', 'authorization'];
    for (const [key, value] of request.headers.entries()) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }
    headers.set('Host', 'api.groq.com');

    // 转发请求
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body
    });

    // 返回响应
    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });

  } catch (error) {
    console.error('Failed to fetch Groq API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

Deno.serve(handleRequest);
