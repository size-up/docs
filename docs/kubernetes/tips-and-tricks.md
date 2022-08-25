---
sidebar_position: 999
---

# Tips and tricks

Cheet sheet about all Kubernetes commands and contents.

#### See all node are running with more details:

```shell
kubectl get node --all-namespaces -o wide
```

#### See all pods are running with more details and stay attach _(--watch)_ to:

```shell
kubectl get pods --all-namespaces -o wide --watch
```

#### Apply directly yaml file in command line:

```shell
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

#### Remove taint if running kubectl in one single node

```shell
kubectl taint nodes <node-name> node-role.kubernetes.io/master:NoSchedule-
```

#### Add a label role to a node

A node can be labeled with a key and value. The key and value are separated by a colon. The key and value can be any string.

When running this command, `kubectl get node` will show all nodes and their status, roles, age and version, as:

| NAME     | STATUS | ROLES                | AGE   | VERSION      |
| -------- | ------ | -------------------- | ----- | ------------ |
| master   | Ready  | control-plane,master | 3d19h | v1.21.5+k3s2 |
| worker-0 | Ready  | worker               | 3d19h | v1.21.5+k3s2 |
| worker-1 | Ready  | worker               | 3d19h | v1.21.5+k3s2 |
| worker-2 | Ready  | worker               | 3d19h | v1.21.5+k3s2 |

To change the value of the role label, we can run the following command:

```shell
kubectl label nodes <list-of-nodes-separated-by-spaces> kubernetes.io/role=<role-name>
```

> Here, we label the node with the key `node-role.kubernetes.io/role` and the value `worker`.

> This will allow us to filter nodes by the label `node-role.kubernetes.io/role=worker`. This is useful when you want to run a command on a specific node (cf. `NodeSelector`).

#### Get a k8s secret value and decode it

```shell
kubectl get --all-namespaces secrets my-secret --template="{{index .data \"name-of-the-secret.key\"}}" | base64 --decode
```
