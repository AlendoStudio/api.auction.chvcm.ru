import * as path from "path";

import * as dotenv from "dotenv";
import urlJoin from "url-join";

dotenv.config({
  path: path.join(__dirname, ".env"),
});

export default {
  bootstrapVue: {
    bootstrapCSS: true,
    bootstrapVueCSS: true,
  },
  build: {
    babel: {
      plugins: ["@babel/plugin-syntax-dynamic-import"],
      presets: ["@babel/preset-env"],
    },
  },
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  env: {
    APIDOC_URL: urlJoin(process.env.API_SERVER || "/", "/apidoc/"),
    API_ENDPOINT: urlJoin(process.env.API_SERVER || "/", "/api/v1"),
    RECAPTCHA_SITE: process.env.RECAPTCHA_SITE,
    SOCKET_TRANSPORTS: ["websocket"],
  },
  generate: {
    dir: "dist",
  },
  head: {
    link: [{rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon"}],
    meta: [
      {charset: "utf-8"},
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
    ],
    titleTemplate: "%s | api.auction.chvcm.ru",
  },
  loading: {
    color: "#FF8C00",
  },
  mode: "spa",
  modules: ["bootstrap-vue/nuxt"],
  plugins: ["~/plugins/fontawesome.ts"],
  router: {
    linkExactActiveClass: "active",
    mode: "hash",
  },
  server: {
    host: process.env.NUXT_HOST || "0.0.0.0",
    port: parseInt(process.env.NUXT_PORT || "3000", 10),
  },
};
