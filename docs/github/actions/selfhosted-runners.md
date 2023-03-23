---
sidebar_position: 5
---

# Self hosted runner

GitHub self hosted runner with **actions-runner-controller** installation in a Kubernetes cluster.

## Documentation

All the documentation of **actions-runner-controller** is [here](https://github.com/actions-runner-controller/actions-runner-controller).

### Prerequisites

- [Kubernetes cluster](https://kubernetes.io)
- [Kubernetes CLI (kubectl)](https://kubernetes.io/docs/reference/kubectl/overview/)
- [Kubernetes Helm](https://helm.sh/)
- [cert-manager](https://cert-manager.io/)

### Prerequisites installation

<!-- - Open port and connections with `iptables` (needed by `cert-manager`)

```shell
sudo iptables --insert INPUT --source 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert INPUT --destination 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert FORWARD --source 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert FORWARD --destination 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert OUTPUT --source 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert OUTPUT --destination 0.0.0.0/0 --jump ACCEPT
``` -->

- Install Helm

```shell
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

- Install **cert-manager**

```shell
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.yaml
```

### Repository scope installation

:::caution
The `kubectl apply -f` doesn't work properly. Prefer install with the **actions-runner-controller** using Helm.
:::

- Create a **Personal Access Token (PAT)** and [give repo full control scopes](https://github.com/actions-runner-controller/actions-runner-controller#deploying-using-pat-authentication) if you want to deploy the **actions-runner-controller** using PAT and just in repositories scope.

:::tip
[Direct access link to PAT creation](https://github.com/settings/tokens/new).
:::

- Then, create a secret containing the `GITHUB_TOKEN`.

```shell
export GITHUB_TOKEN=<your-github-token>
```

- Create the **actions-runner-controller** namespace.

```shell
kubectl create namespace actions-runner-system
```

- Create Kubernetes secrets containing the `GITHUB_TOKEN`.

```shell
kubectl create secret generic controller-manager \
    -n actions-runner-system \
    --from-literal=github_token=${GITHUB_TOKEN}
```

- Install the **actions-runner-controller** using Helm.

```shell
helm repo add actions-runner-controller https://actions-runner-controller.github.io/actions-runner-controller
```

```shell
helm upgrade --install --namespace actions-runner-system --create-namespace \
             --wait actions-runner-controller actions-runner-controller/actions-runner-controller
```

### Repository deployment

Repository deployment runners with a yaml file:

```yaml title="repository-runner-deploy.yaml"
# https://github.com/actions-runner-controller/actions-runner-controller#runnerdeployments
apiVersion: actions.summerwind.dev/v1alpha1
kind: RunnerDeployment
metadata:
  name: runner-deployment # name of the runner deployment
spec:
  replicas: 3 # number of runners wanted
  template:
    spec:
      repository: github-path/your-repository # repository name
```

:::info
[Read documentation about repository deployment](https://github.com/actions-runner-controller/actions-runner-controller#repository-runners).
:::

> ⚠️ Do not forget to update the `github-path/your-repository` by your desired repository!

### Organization deployment

To add the runner to an organization, you only need to replace the repository field with organization, so the runner will register itself to the organization.

```yaml title="organization-runner-deploy.yaml"
apiVersion: actions.summerwind.dev/v1alpha1
kind: RunnerDeployment
metadata:
  name: runner-deployment # name of the runner deployment
spec:
  replicas: 3 # number of runners wanted
  template:
    spec:
      organization: my-organization-name # organization name
```

:::info
[Read documentation about organization deployment](https://github.com/actions-runner-controller/actions-runner-controller#organization-runners).
:::

## Tips and tricks

:::tip
If you want to deploy your actions-runner on the requested architecture, you can add the `nodeSelector` to the `spec`:

```yaml title="organization-runner-deploy.yaml"
apiVersion: actions.summerwind.dev/v1alpha1
kind: RunnerDeployment
metadata:
  name: runner-deployment # name of the runner deployment
spec:
  replicas: 3 # number of runners wanted
  template:
    spec:
      // highlight-start
      organization: my-organization-name # organization name
      nodeSelector:
        kubernetes.io/arch: arm64 # architecture where the runner will be deployed
      // highlight-end
```

[Read the documentation about nodeSelector with actions-runner](https://github.com/actions-runner-controller/actions-runner-controller#setting-up-windows-runners).
:::

:::tip

Install Docker in all your runner using **Docker-in-Docker**.

When using the default runner, the runner pod starts up 2 containers: runner and DinD (Docker-in-Docker). ARC maintains an alternative all in one runner image with docker running in the same container as the runner. This may be prefered from a resource or complexity perspective or to be compliant with a LimitRange namespace configuration.

```yaml
apiVersion: actions.summerwind.dev/v1alpha1
kind: RunnerDeployment
metadata:
  namespace: actions-runner-system
  name: oci-runner # name of the runner deployment
spec:
  replicas: 4 # number of runners wanted
  template:
    spec:
      image: summerwind/actions-runner-dind
      dockerdWithinRunnerContainer: true
      organization: size-up # organization name
      nodeSelector:
        kubernetes.io/arch: arm64 # architecture where the runner will be deployed
```

[Read the documentation about runner with Docker-in-Docker with actions-runner](https://github.com/actions-runner-controller/actions-runner-controller#runner-with-dind).

:::
