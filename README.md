# CORS Yelbolt Worker

This repository contains the CORS Yelbolt Worker, a Cloudflare Worker that acts as a CORS proxy to bypass cross-origin restrictions when making API requests from the browser.

## Features

- **CORS Proxy**: Forward requests to any API and automatically add CORS headers
- **Simple Usage**: Just add the target URL as a query parameter
- **Supports All HTTP Methods**: GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS, CONNECT, TRACE
- **URL Encoding Support**: Handles both encoded and non-encoded URLs
- **Preflight Handling**: Automatically handles OPTIONS requests for CORS preflight
- **Header Forwarding**: Forwards request headers while filtering problematic ones
- **Error Handling**: Returns detailed error messages in JSON format

## Usage

Add the target URL as a query parameter to your worker URL:

```
https://your-worker.workers.dev/?https://api.example.com/endpoint
```

You can also use the `url=` parameter with encoded URLs:

```
https://your-worker.workers.dev/?url=https%3A%2F%2Fapi.example.com%2Fendpoint
```

Example:

```
https://your-worker.workers.dev/?https://api.lemonsqueezy.com/v1/licenses/activate?license_key=XXX&instance_name=YYY
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
