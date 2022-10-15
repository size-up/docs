---
sidebar_position: 4
---

# Semantic release

## Get version from semantic release

Get version from semantic release and use for instance, to deploy Docker image with version tag.

:::note
[Inspired from this issue on GitHub](https://github.com/semantic-release/semantic-release/issues/753#issuecomment-1023028861).
:::

:::caution
This solution uses **GitHub workflow specific commands**.

This method is **pretty hacky** but gets the job done. Nonetheless a semantic release built-in method would be more future proof to use.<br/>
An official Github Action with proper inputs and outputs would be even more appreciated.

:::

Use the `exec` plugin to store the semantic release `${nextRelease.version}` variable in a GitHub workflow step output:

### Install `@semantic-release/exec` plugin

```shell
yarn add -D @semantic-release/exec
```

or using `npm`:

```shell
npm install --save-dev @semantic-release/exec
```

### Configuration

In the `.releaserc` file:

```yaml title=".releaserc"
[
  "@semantic-release/exec",
  {
    "publishCmd": "echo ::set-output name=nextVersion::${nextRelease.version}",
  },
]
```

Declare a new joboutput in the workflow yaml file:

```yaml title="workflow.yaml"
  release:
    [...]
      - name: 🔖 Release application
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
        run: npx semantic-release
        // highlight-start
        id: version # save the version
    outputs:
      version: ${{ steps.version.outputs.nextVersion }}
      // highlight-end
```

Use the step output in another job:

```yaml
- name: 🐳 Build and push
  uses: docker/build-push-action@v3
  with:
    context: . # https://github.com/marketplace/actions/build-and-push-docker-images#git-context
    push: true
    // highlight-next-line
    tags: name/docs:latest,name/docs:${{ needs.release.outputs.version }}
```

:::caution
Take care about the context when running `docker/build-push-action@v3` :

> Be careful because any file mutation in the steps that precede the build step will be ignored, including processing of the `.dockerignore` file since the context is based on the Git reference.<br/>
> However, you can use the **Path context** using the context input alongside the `actions/checkout` action to remove this restriction:

```yaml
context: .
```

[Documentation about **Path context**](https://github.com/marketplace/actions/build-and-push-docker-images#git-context).
:::

:::note

### Full running example with other variable names

[Workflow](https://github.com/maxiride/semantic-release-test/blob/4d330f2d46408f2019c33661f7f67f3e836f7bd1/.github/workflows/outputs.yml).<br/>
[Semantic Release configuration file](https://github.com/maxiride/semantic-release-test/blob/4d330f2d46408f2019c33661f7f67f3e836f7bd1/.releaserc.json).<br/>
[Example run](https://github.com/maxiride/semantic-release-test/actions/runs/1755300704).
:::
