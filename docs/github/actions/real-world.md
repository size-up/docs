---
sidebar_position: 999
---

# Real world example

:::note
This example is directly inspired from the `docs` repository _(where you are connected_ 🤯*)*.
:::

```yaml title="ci-cd.yaml"
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: 🔄 CI/CD

on:
  push:
    branches: ["main", "beta", "*.*.*"]
  pull_request:
    branches: ["main", "beta", "*.*.*"]

  workflow_dispatch: # allow manual trigger

  # Used by the GitHub merge queue feature.
  # Documentation: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue
  merge_group:

env:
  NAMESPACE_NAME: "docs"
  IMAGE_NAME: "docs"

jobs:
  build:
    name: ⚙️ Build

    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v3
      - name: 🌐 Use Node.js LTS
        uses: actions/setup-node@v3
        with:
          node-version: lts/*

      - name: 🗂 Cache "node_modules"
        uses: actions/cache@v3
        id: yarn-cache # use this to check for `cache-hit` (`steps.yarn-cache.outputs.cache-hit != 'true'`)
        with:
          path: "**/node_modules"
          key: ${{ runner.arch }}-${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.arch }}-${{ runner.os }}-yarn-

      - name: 📦 Install dependencies
        if: steps.yarn-cache.outputs.cache-hit != 'true'
        run: yarn install --frozen-lockfile

      - name: ⚙️ Build application
        run: yarn run build

      - if: steps.yarn-cache.outputs.cache-hit != 'true'
        name: 🗃 List the state of node modules
        continue-on-error: true
        run: yarn list

  release:
    name: 🔖 Release

    runs-on: ubuntu-latest

    needs: build

    if: ${{ github.event_name != 'merge_group' }} # skip this job if the event is a merge_group

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v3
        with:
          # used by semantic-release to bypass the branch protection rules
          token: ${{ secrets.GH_TOKEN }}

      - name: 🌐 Use Node.js LTS
        uses: actions/setup-node@v3
        with:
          node-version: lts/*

      - name: 🗂 Cache "node_modules"
        uses: actions/cache@v3
        id: yarn-cache # use this to check for `cache-hit` (`steps.yarn-cache.outputs.cache-hit != 'true'`)
        with:
          path: "**/node_modules"
          key: ${{ runner.arch }}-${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.arch }}-${{ runner.os }}-yarn-

      - name: 🔖 Release application
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
          # NPM_TOKEN: ${{ secrets.NPM_TOKEN }} # optional, needed to publish packages on npm
        id: version # save the version to use in an other step/job
    outputs:
      version: ${{ steps.version.outputs.nextVersion }}

  push:
    name: 🐳 Build and push image

    runs-on: ubuntu-latest

    needs: release

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v3

      - name: ⚙️ Set up QEMU
        uses: docker/setup-qemu-action@v2
      - name: 🛠 Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: 📲 Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: 🐳 Build and push image latest
        uses: docker/build-push-action@v3
        with:
          context: . # https://github.com/marketplace/actions/build-and-push-docker-images#git-context
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/${{ env.IMAGE_NAME }}:latest

      - name: 🐳 Build and push image ${{ needs.release.outputs.version }}
        uses: docker/build-push-action@v3
        if: ${{ needs.release.outputs.version }} # deploy only if there is a new published version
        with:
          context: . # https://github.com/marketplace/actions/build-and-push-docker-images#git-context
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/${{ env.IMAGE_NAME }}:${{ needs.release.outputs.version }}

  deploy-prep:
    name: 🚀 Deploy prep. [latest]

    runs-on: ubuntu-latest

    needs: push

    environment:
      name: pre-production # refer to https://github.com/size-up/docs/settings/environments
      url: https://prep.docs.sizeup.cloud

    steps:
      - name: ⚙️ Set up kubectl
        uses: tale/kubectl-action@v1
        with:
          base64-kube-config: ${{ secrets.OCI_KUBE_CONFIG }}

      - name: 🚀 Deploy to prep-production [latest]
        run: kubectl rollout -n ${{ env.NAMESPACE_NAME }} restart deployment ${{ env.NAMESPACE_NAME }}-prep

  deploy-prod:
    name: 🚀 Deploy prod. [v${{ needs.release.outputs.version }}]

    runs-on: ubuntu-latest

    needs: [release, push]

    # deploy only if there is a new published version
    if: ${{ needs.release.outputs.version }}

    environment: production # refer to https://github.com/size-up/docs/settings/environments

    steps:
      - name: ⚙️ Set up kubectl
        uses: tale/kubectl-action@v1
        with:
          base64-kube-config: ${{ secrets.OCI_KUBE_CONFIG }}

      - name: 🚀 Deploy to production [v${{ needs.release.outputs.version }}]
        run: kubectl set image -n ${{ env.NAMESPACE_NAME }} deployment/${{ env.IMAGE_NAME }}-prod ${{ env.IMAGE_NAME }}-prod=${{ secrets.DOCKERHUB_USERNAME }}/${{ env.IMAGE_NAME }}:${{ needs.release.outputs.version }}
```
