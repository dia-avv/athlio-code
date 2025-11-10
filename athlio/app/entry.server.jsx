import { RemixServer } from "@react-router/react";
import { renderToReadableStream } from "react-dom/server";

const BASENAME = "/athlio-code";

export default async function handleRequest(request, status, headers, context) {
  const stream = await renderToReadableStream(
    <RemixServer
      request={request}
      context={context}
      statusCode={status}
      basename={BASENAME}
    />,
  );
  await stream.allReady;
  headers.set("Content-Type", "text/html");
  return new Response(stream, { headers, status });
}
