---
sidebar_position: 999
---

# Tips and tricks

Cheet sheet about all Kubernetes commands and contents.

## Kubernetes cheat sheet

### See all node are running with more details

```bash
kubectl get node --all-namespaces --output=wide
```

Short hand:

```bash
kubectl get node -A -o=wide
```

:::tip
In the Debian distribution, you can also use the built-in `watch` command, to run a command periodically:

```bash
watch --interval 1 kubectl get node --all-namespaces --output=wide
```

:::

### See all pods are running with more details and stay attach _(--watch)_

```bash
kubectl get pods --all-namespaces -o=wide --watch
```

### Apply directly yaml file in command line

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-pod
      image: mypod:latest
EOF
```

### Set image to a delployment _on the edge_

```bash
kubectl set image -n my-namespace deployment/my-deployment my-pod=my-registry-username/my-image:1.1.0
```

### Remove taint if the Kubernetes cluster is a Single Node Cluster

:::note
[Read documentation about **Single Node Cluster**](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
:::

```bash
kubectl taint nodes <node-name> node-role.kubernetes.io/master:NoSchedule-
```

### Add a label role to a node

A node can be labeled with a key and value. The key and value are separated by a colon. The key and value can be any string.

When running this command, `kubectl get node` will show all nodes and their status, roles, age and version, as:

| NAME     | STATUS | ROLES                | AGE   | VERSION      |
| -------- | ------ | -------------------- | ----- | ------------ |
| master   | Ready  | control-plane,master | 3d19h | v1.21.5+k3s2 |
| worker-0 | Ready  | worker               | 3d19h | v1.21.5+k3s2 |
| worker-1 | Ready  | worker               | 3d19h | v1.21.5+k3s2 |
| worker-2 | Ready  | worker               | 3d19h | v1.21.5+k3s2 |

To change the value of the role label, we can run the following command:

```bash
kubectl label nodes <list-of-nodes-separated-by-spaces> kubernetes.io/role=<role-name>
```

:::info
Here, we label the node with the key `node-role.kubernetes.io/role` and the value is `worker`.
:::

:::info
This will allow us to filter nodes by the label `node-role.kubernetes.io/role=worker`.<br/>This is useful when you want to run a command on a specific node ([Read documentation about **NodeSelector**](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)).
:::

### Get a k8s secret value and decode it

```bash
kubectl get --all-namespaces secrets my-secret --template="{{index .data \"name-of-the-secret.key\"}}" | base64 --decode
```
