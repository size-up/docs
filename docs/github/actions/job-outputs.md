---
sidebar_position: 3
---

# Job outputs

## Definition

You can specify a set of outputs that you want to pass to subsequent jobs and then access those values from your needs context.<br/>

:::info
Inspired from the [GitHub Actions documentation](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idoutputs) and [this stackoverflow thread](https://stackoverflow.com/questions/59175332/using-output-from-a-previous-job-in-a-new-one-in-a-github-action).
:::

A map of **outputs** for a job.

```yaml
jobs.<jobs_id>.outputs
```

Job **outputs** are available to **all downstream jobs that depend on this job**.
For more information on defining job dependencies, see [`jobs.<job_id>.needs`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idneeds).

Job **outputs** are strings, and job **outputs** containing expressions are evaluated on the runner at the end of each job. **Outputs** containing **secrets** are redacted on the runner and **not sent** to GitHub Actions.

To use job **outputs** in a dependent job, you can use the needs context.

:::note
For more information, see ["Context and expression syntax for GitHub Actions"](https://docs.github.com/en/actions/learn-github-actions/contexts#needs-context).
:::

To use job **outputs** in a dependent job, you can use the **needs** context.

## Worflow example

:::info
See documentation for more information: [GitHub Actions documentation](https://docs.github.com/en/actions/learn-github-actions/workflow-commands-for-github-actions#setting-an-output-parameter).
:::

:::caution
The `set-output` command is [deprecated and will be disabled on 31st May 2023](https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/).<br/>
Please upgrade to using environment files or job outputs instead.
:::

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest

    // highlight-start
    # Map a step output to a job output
    outputs:
      output1: ${{ steps.step1.outputs.test }}
      output2: ${{ steps.step2.outputs.test }}
    // highlight-end

    steps:
      - id: step1
        run: echo "test=hello" >> $GITHUB_OUTPUT
      - id: step2
        run: echo "test=hello" >> $GITHUB_OUTPUT

  job2:
    runs-on: ubuntu-latest
    needs: job1

    steps:
        // highlight-next-line
      - run: echo ${{needs.job1.outputs.output1}} ${{needs.job1.outputs.output2}}
```
