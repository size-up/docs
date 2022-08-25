---
sidebar_position: 1
---

# With kubeadm

All you need to know about how install k8s with `kubeadm` in a **bare-metal server**.

## Meaning

This documentation talk about **Kubernetes** installation with `kubeadm`. This is strongly inspired from [the official **Kubernetes** documentation](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

> If you want to use `Kubespray` or `Kops` see [related official **Kubernetes** comparisons](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/comparisons.md).

> The shorthand word for **Kubernetes** is `k8s`.

> A **bare-metal server** is a physical computer server that is used by one consumer, or tenant, only. Each server offered for rental is a distinct physical piece of hardware that is a functional server on its own. They are not virtual servers running in multiple pieces of shared hardware.

## Installation

#### Init Kubernetes cluster with `kubeadm`

[Reference information link](https://kubernetes.io/fr/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

```shell
kubeadm init
```

#### Set Kubernetes generated `config` file

```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

#### Install `Cilium` network add-on (or other netword add-on as Calico)

[Reference information link](https://docs.cilium.io/en/v1.9/gettingstarted/k8s-install-default/).

```shell
kubectl create -f https://raw.githubusercontent.com/cilium/cilium/master/install/kubernetes/quick-install.yaml
```

#### Rolling Restart Kubernetes pods:

```shell
kubectl rollout restart deployment <deployment-name>
```

## Uninstall Kubernetes

#### Flush and reset IPTables:

1. Clear all chains:

```shell
sudo iptables -t filter -F
sudo iptables -t filter -X
```

2. Then restart Docker Service:

```shell
systemctl restart docker
```
