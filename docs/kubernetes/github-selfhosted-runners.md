---
sidebar_position: 4
---

# GitHub self hosted runner

GitHub self hosted runner with `actions-runner-controller` installation.

## Documentation

All the documentation of `actions-runner-controller` is [here](https://github.com/actions-runner-controller/actions-runner-controller).

## Prerequisites

- [Kubernetes cluster](https://kubernetes.io)
- [Kubernetes CLI (kubectl)](https://kubernetes.io/docs/reference/kubectl/overview/)
- [Kubernetes Helm](https://helm.sh/)
- [cert-manager](https://cert-manager.io/)

# Prerequisites installation

<!-- - Open port and connections with `iptables` (needed by `cert-manager`)

```sh
sudo iptables --insert INPUT --source 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert INPUT --destination 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert FORWARD --source 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert FORWARD --destination 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert OUTPUT --source 0.0.0.0/0 --jump ACCEPT && \
sudo iptables --insert OUTPUT --destination 0.0.0.0/0 --jump ACCEPT
``` -->

- Install Helm

```sh
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

- Install `cert-manager`

```sh
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.yaml
```

## Repository scope installation

> The `kubectl apply -f` doesn't work properly. I was able to install the `actions-runner-controller` using Helm.

- Create a Personal Access Token (PAT) and [give repo full control scopes](https://github.com/actions-runner-controller/actions-runner-controller#deploying-using-pat-authentication) if you want to deploy the actions-runner-controller using PAT and just in repositories scope.

> [Direct access link to PAT creation](https://github.com/settings/tokens/new).

- Then, create a secret containing the `GITHUB_TOKEN`.

```sh
export GITHUB_TOKEN=<your-github-token>
```

- Create the `actions-runner-controller` namespace.

```sh
kubectl create namespace actions-runner-system
```

- Create Kubernetes secrets containing the `GITHUB_TOKEN`.

```sh
kubectl create secret generic controller-manager \
    -n actions-runner-system \
    --from-literal=github_token=${GITHUB_TOKEN}
```

- Install the `actions-runner-controller` using Helm.

```sh
helm repo add actions-runner-controller https://actions-runner-controller.github.io/actions-runner-controller
```

```sh
helm upgrade --install --namespace actions-runner-system --create-namespace \
             --wait actions-runner-controller actions-runner-controller/actions-runner-controller
```

## Repository deployment

Repository deployment runners with a `yaml` file:

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
      nodeSelector:
        kubernetes.io/arch: arm64 # architecture where the runner will be deployed
```

> ⚠️ Do not forget to update the `github-path/your-repository` by your desired repository!

## Organization deployment

Organization deployment runners with a `yaml` file:

```yaml title="organization-runner-deploy.yaml"
# https://github.com/actions-runner-controller/actions-runner-controller#runnerdeployments
apiVersion: actions.summerwind.dev/v1alpha1
kind: RunnerDeployment
metadata:
  name: runner-deployment # name of the runner deployment
spec:
  replicas: 3 # number of runners wanted
  template:
    spec:
      organization: MyOrganization # organization name
      nodeSelector:
        kubernetes.io/arch: arm64 # architecture where the runner will be deployed
```
