// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const title = "This is Cloud";

const maintainer = {
  name: "Anthony Pillot",
  github: {
    account: "anthonypillot",
    url: "https://github.com/anthonypillot",
  },
  twitter: "anthonypillot_",
};

const organization = {
  name: "Size Up",
  github: {
    account: "size-up",
    url: {
      root: "https://github.com/size-up",
      repository: "https://github.com/size-up/docs",
    },
  },
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: title,
  tagline:
    "Configuration references and useful files and links used by Bare Metal Server, Virtual Private Server (VPS), Virtual Machine (VM) and other Cloud stuff.",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: organization.name, // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

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
          editUrl: organization.github.url.repository,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: organization.github.url.repository,
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
        title: title,
        logo: {
          alt: title + " logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "summary",
            position: "left",
            label: "Documentation",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: organization.github.url.repository,
            label: "GitHub",
            position: "right",
          },
        ],
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
                label: "Kubernetes",
                to: "/docs/category/kubernetes",
              },
              {
                label: "GitHub self hosted runner",
                to: "/docs/kubernetes/github-selfhosted-runners",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub | Organization",
                href: organization.github.url.root,
              },
              {
                label: "GitHub | Documentation maintainer",
                href: maintainer.github.url,
              },
              {
                label: "Twitter",
                href: "https://twitter.com/" + maintainer.twitter,
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
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ${
          maintainer.name
        } | ${organization.name} organization.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;