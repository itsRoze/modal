/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  postcss: true,
  serverDependenciesToBundle: [
    // "lucia",
    // "lucia/middleware",
    // "lucia/polyfill/node",
    // "@lucia-auth/adapter-mysql", // adapter you're using
    "@modal/auth",
    "@modal/functions",
    "@modal/db",
    // "@modal/email",
  ],
  browserNodeBuiltinsPolyfill: {
    modules: {
      crypto: true,
    },
  },

  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
