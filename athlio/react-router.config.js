/** @type {import('@react-router/dev/config').Config} */
export default {
  appDirectory: "app",
  buildDirectory: "build",
  ssr: false, // disable SSR since you're deploying a client-only SPA
  basename: "/athlio-code",
  prerender: ["/"], // you can remove this entirely if not pre-rendering
};
