---
sidebar_position: 999
---

# Real world example

:::note
This example is directly inspired from the `docs` repository _(where you are connected_ 🤯*)*.
:::

```yaml title="onPushMainPrMain.yaml"
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: CI/CD and Release

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    name: ⚙️ Build application
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v3
      - name: 🌐 Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - name: 🗂 Cache "node_modules"
        id: cache
        uses: actions/cache@v3
        env:
          cache-name: cache
        with:
          path: "**/node_modules"
          key: ${{ runner.arch }}-${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.arch }}-${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.arch }}-${{ runner.os }}-build-
            ${{ runner.arch }}-${{ runner.os }}-

      - name: 📦 Install or update yarn
        run: npm install --global yarn

      - name: 📦 Install dependencies
        run: yarn install --frozen-lockfile

      - name: ⚙️ Build application
        run: yarn build

      - name: 📤 Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: ./build

      - if: ${{ steps.cache.outputs.cache-hit == 'false' }}
        name: 🗃 List the state of node modules
        continue-on-error: true
        run: yarn list

  release:
    name: 🔖 Release application
    runs-on: ubuntu-latest

    needs: [build]

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v3
      - name: 🌐 Use Node.js LTS
        uses: actions/setup-node@v3
        with:
          node-version: lts/*
      - name: 🗂 Cache "node_modules"
        id: cache
        uses: actions/cache@v3
        env:
          cache-name: cache
        with:
          path: "**/node_modules"
          key: ${{ runner.arch }}-${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.arch }}-${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.arch }}-${{ runner.os }}-build-
            ${{ runner.arch }}-${{ runner.os }}-

      - name: 🔖 Release application
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
          # NPM_TOKEN: ${{ secrets.NPM_TOKEN }} # optional, needed to publish packages on npm
        run: npx semantic-release
    outputs:
      version: ${{ steps.semantic_release.outputs.new_release_version }}

  deploy:
    name: "🐳 Deploy application"
    runs-on: ubuntu-latest

    needs: [release]

    if: ${{ needs.release.outputs.version }}

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v3

      - name: 📥 Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: build

      - name: 🛠 Set up QEMU
        uses: docker/setup-qemu-action@v2
      - name: 🛠 Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: 📲 Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: 🐳 Build and push
        uses: docker/build-push-action@v3
        with:
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/docs:latest,${{ secrets.DOCKERHUB_USERNAME }}/docs:${{ needs.release.outputs.version }}
```
