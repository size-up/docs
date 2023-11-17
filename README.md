# Size Up - Documentation website

[![🔄 CI/CD](https://github.com/size-up/docs/actions/workflows/ci-cd.yaml/badge.svg?branch=main)](https://github.com/size-up/docs/actions/workflows/ci-cd.yaml)

![GitHub package.json version](https://img.shields.io/github/package-json/v/size-up/docs?label=application%20version) ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/sizeup/docs?label=image%20version) ![Docker Image Size (latest semver)](https://img.shields.io/docker/image-size/sizeup/docs)

[Size Up - Documentation website](https://docs.sizeup.cloud/) is a documentation that describes many tips and tricks on many IT topics.

Documentation website that describes many tips and tricks on many IT topics. Configuration references, useful files and links used to construct beautiful and efficient IT infrastructures, websites and applications with Open Source technologies.

It's talking about configuration references and useful files and links used by Bare Metal Server, Virtual Private Server (VPS), Virtual Machine (VM) and other Cloud stuff.

---

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn install
```

### Local Development

```
$ yarn run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
