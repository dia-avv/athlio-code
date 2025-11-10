import { ServerRouter } from "react-router";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  const markup = renderToString(
    <ServerRouter context={remixContext} url={request.url} />,
  );
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: { ...responseHeaders, "Content-Type": "text/html" },
  });
}
