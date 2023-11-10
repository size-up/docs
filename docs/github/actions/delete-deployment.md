---
sidebar_position: 4
---

# Delete deployments

![Delete deployment](@site/static/img/example/github-active-deployments.jpg)

## Why delete all GitHub deployments?

When you delete a deployment, the deployment is removed from the list of deployments for the repository. However, the deployment event might still appear in timelines, project boards, search results, and any operations where the timeline is used.

## How to delete all GitHub deployments?

Here a Node.js script to delete all deployments from a repository.

1. [**Open this JavaScript file**](./delete-deployment.js).
2. Fill the `TOKEN`, `REPO` and `USER_OR_ORG` variables in the script.
3. Then, run the script with the following command:

```bash
node delete-deployment.js
```

:::tip
Your GitHub Access Token must have the `repo_deployments` scope.
:::
