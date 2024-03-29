// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { themes as prismThemes } from "prism-react-renderer";

const packageJson = require("./package.json");

const application = {
  title: packageJson.displayName,
  name: packageJson.name,
  description: packageJson.description,
  repository: packageJson.repository.url,

  maintainer: {
    name: packageJson.contributors[0].name,
    github: {
      account: "anthonypillot",
      url: packageJson.contributors[0].url,
    },
    twitter: "anthonypillot_",
  },

  organization: {
    name: packageJson.author.name,
    url: "https://sizeup.cloud",
    github: {
      account: "size-up",
      url: "https://github.com/size-up",
    },
  },
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: application.title,
  tagline: application.description,
  url: application.organization.url,
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // @ts-ignore
  organizationName: application.organization.name, // Usually your GitHub org/user name.
  projectName: application.name, // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `${application.repository.slice(0, -4)}/blob/main/`,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `${application.repository}/blob/main/`,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: application.title,
        logo: {
          src: "img/logo.png",
          alt: application.displayName + " logo",
        },
        hideOnScroll: true,
        items: [
          {
            type: "doc",
            docId: "summary",
            position: "left",
            label: "Summary",
          },
          {
            to: "/docs/category/linux",
            label: "Linux",
            position: "left",
          },
          {
            to: "/docs/category/kubernetes",
            label: "Kubernetes",
            position: "left",
          },
          {
            to: "/docs/category/actions",
            label: "GitHub Actions",
            position: "left",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: application.repository,
            label: "GitHub",
            position: "right",
          },
        ],
      },
      docs: {
        // documentation about how to custom sidebar https://docusaurus.io/docs/sidebar#theme-configuration
        sidebar: {
          // autoCollapseCategories: true,
          hideable: true,
        },
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Summary",
                to: "/docs/summary",
              },
              {
                label: "Linux",
                to: "/docs/category/linux",
              },
              {
                label: "Kubernetes",
                to: "/docs/category/kubernetes",
              },
              {
                label: "Kubernetes get started with k3s",
                to: "/docs/kubernetes/get-started-with-k3s",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub | Size Up Organization",
                href: application.organization.github.url,
              },
              {
                label: "GitHub | Documentation maintainer",
                href: application.maintainer.github.url,
              },
              {
                label: "Twitter | Documentation maintainer",
                href: "https://twitter.com/" + application.maintainer.twitter,
              },
            ],
          },
          {
            title: "More content",
            items: [
              {
                label: "Blog posts",
                to: "/blog",
              },
              {
                label: "GitHub self hosted runner",
                to: "/docs/github/actions/selfhosted-runners",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ${application.organization.name} organization.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["bash"],
      },
    }),
  themes: [
    [
      // @ts-ignore
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      // @ts-ignore
      ({
        hashed: true,
      }),
    ],
  ],
};

module.exports = config;
