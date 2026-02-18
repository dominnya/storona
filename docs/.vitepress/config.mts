import { defineConfig } from "vitepress";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { createFileSystemTypesCache } from "@shikijs/vitepress-twoslash/cache-fs";

export default defineConfig({
  title: "Storona",
  description: "Simple opinionated file-based router",

  themeConfig: {
    logo: {
      light: "/storona-light.svg",
      dark: "/storona-dark.svg",
    },

    outline: {
      level: "deep",
    },

    nav: [
      {
        text: "Guide",
        activeMatch: "/guide/",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "Quick Start", link: "/guide/quick-start" },
        ],
      },
      {
        text: "Reference",
        link: "/reference/config.html",
        activeMatch: "/reference/",
      },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "Quick Start", link: "/guide/quick-start" },
          { text: "Migrate from v0", link: "/guide/migrate-from-v0" },
          { text: "Config", link: "/reference/config" },
        ],
      },
      {
        text: "Learning",
        items: [
          {
            text: "Rules Of Architecture",
            link: "/learning/rules-of-architecture",
          },
          {
            text: "Export Overrides",
            link: "/learning/export-overrides",
          },
          {
            text: "Transpilation Of TypeScript",
            link: "/learning/transpilation-of-typescript",
          },
        ],
      },
      {
        text: "Adapters",
        items: [
          {
            text: "Custom Adapter",
            link: "/adapters/custom-adapter",
          },
          { text: "Express", link: "/adapters/express" },
          { text: "Fastify", link: "/adapters/fastify" },
          { text: "discord.js", link: "/adapters/discord.js" },
          { text: "grammY", link: "/adapters/grammy" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/dominnya/storona",
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present dominnya",
    },

    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },

    editLink: {
      pattern:
        "https://github.com/dominnya/storona/edit/master/docs/:path",
    },
  },

  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      { property: "og:image", content: "/preview-banner.png" },
    ],
    [
      "meta",
      {
        property: "og:title",
        content: "Storona",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Simple opinionated file-based routing for your JavaScript applications.",
      },
    ],
    [
      "meta",
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  ],

  markdown: {
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache({
          dir: ".vitepress/cache/twoslash",
        }),
      }),
    ],
  },

  lastUpdated: true,
});
