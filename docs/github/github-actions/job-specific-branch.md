---
sidebar_position: 1
---

# Job on specific branch

Useful snippets and references to help you building workflow in **GitHub Actions**.

:::note
Inspired from [this stackoverflow thread](https://stackoverflow.com/questions/58139406/only-run-job-on-specific-branch-with-github-actions).
:::

## How to run job **only** on specific branch with GitHub Actions.

With **GitHub Actions**, you are able to put `if` conditionals at **job level**.

:::info
Inspired from the [GitHub Actions documentation](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif).
:::

This workflow which runs the job test on every push, but only runs deploy on the main branch.

```yaml
name: Conditional workflow

on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Execute tests
        run: exit 0

  deploy:
    runs-on: ubuntu-latest

    needs: test

    // highlight-next-line
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy app
        run: exit 0
```

An alternative solution if you prefer to have separate workflows:

- The **first workflow** runs for every branch except main. In this workflow you run tests only.

```yaml title="first-workflow.yaml"
on:
  push:
    branches:
      - "*"
      - "!main"
```

- The **second workflow** runs for just main and runs both your tests and deploys if the tests were successfully passed.

```yaml title="second-workflow.yaml"
on:
  push:
    branches:
      - main
```
