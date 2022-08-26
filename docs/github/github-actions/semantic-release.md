---
sidebar_position: 3
---

# Semantic release

## Get version from semantic release

:::note
[Inspired from this issue on GitHub](https://github.com/semantic-release/semantic-release/issues/753#issuecomment-1023028861).
:::

:::caution
This solution uses **GitHub workflow specific commands**.
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
        id: version # get the version
    outputs:
      version: ${{ steps.version.outputs.nextVersion }}
```

Use the step output in another job:

```yaml
- name: 🐳 Build and push
  uses: docker/build-push-action@v3
  with:
    push: true
    tags: name/docs:${{ needs.release.outputs.version }}
```

---

### Full running example

[Workflow](https://github.com/maxiride/semantic-release-test/blob/4d330f2d46408f2019c33661f7f67f3e836f7bd1/.github/workflows/outputs.yml).<br/>
[Semantic Release configuration file](https://github.com/maxiride/semantic-release-test/blob/4d330f2d46408f2019c33661f7f67f3e836f7bd1/.releaserc.json).<br/>
[Example run](https://github.com/maxiride/semantic-release-test/actions/runs/1755300704).

This method is pretty hacky but gets the job done. Nonetheless a semantic release built-in method would be more future proof to use.<br/>
An official Github Action with proper inputs and outputs would be even more appreciated.
