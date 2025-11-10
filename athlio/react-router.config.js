/** @type {import('@react-router/dev/config').Config} */
export default {
  appDirectory: ".",
  buildDirectory: "build",
  ssr: false, // SPA build for GitHub Pages
  basename: "/athlio-code", // your repo name
  prerender: ["/"], // optional
};
