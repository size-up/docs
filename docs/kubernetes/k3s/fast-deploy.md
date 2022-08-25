---
sidebar_position: 2
---

# Fast deploy using Oracle Cloud (OCI)

Configuration for master node compute instance.

Using `ansible` and `k3s` to deploy Kubernetes cluster on `Oracle Cloud Infrastructure`.

## Prepare the master node

#### Copy the ssh key into the server

From your local machine, copy the ssh key into the server. It'll be used by `ansible` to connect to other nodes.

> Don't forget to actualize the `$MY_PRIVATE_KEY` and `$OCI_SERVER_URL` environment variables on your local machine.

```shell
scp -i $MY_PRIVATE_KEY ubuntu@$OCI_SERVER_URL:~/.ssh/
```

> You can also use different environment variables to store the ssh key and the server IP like:

```shell
scp -i $MY_PRIVATE_KEY ubuntu@$OCI_SERVER_URL:~/.ssh/
```

## Preparation in the master node

#### Update and upgrade `Ubuntu`

```shell
sudo apt update

sudo apt upgrade -y

sudo reboot
```

> The `reboot` is needed to apply the new kernel.

<!-- #### Git clone this repository

Create a `~/.ssh/config` file, to using SSH private key to clone the repository:

```
Host github.com
  HostName github.com
  User anthonypillot
  IdentityFile ~/.ssh/anthonypillot.key
```

Then, clone the repository:

```shell
git clone git@github.com:anthonypillot/cloud.git
```

> And `stdin` account and password. -->

## Install `ansible` and prepare other nodes for Kubernetes installation

```shell
sudo apt install software-properties-common -y && \
sudo add-apt-repository --yes --update ppa:ansible/ansible && \
sudo apt install ansible -y
```

Create a `~/.ansible.cfg` file in user's home directory:

```shell title=".ansible.cfg"
[defaults]
host_key_checking = False
```

Modify the ansible's hosts file, located at `/etc/ansible/hosts`:

```shell
sudo vim /etc/ansible/hosts
```

For instance, add the following line in the `ansible`'s `hosts` file, to create the `workers` group:

```shell title="/etc/ansible/hosts"
# My inventory file is located in /etc/ansible/hosts on the cluster.

[workers]
ampere-1 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
amd-0 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
amd-1 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
```

Test the connection to the nodes:

```shell
ansible workers -m ping
```

#### Run some `Ansible` playbooks

> These Ansible playbooks can be found in this website repository.

Update and upgrade workers nodes:

```shell title="upgrade.playbook.yaml"
ansible-playbook ./ansible/upgrade.playbook.yaml
```

Configure firewall rules:

```shell title="firewall-config.playbook.yaml"
ansible-playbook ./ansible/firewall-config.playbook.yaml
```

## Install Kubernetes with k3s

- Install `k3s` with `--node-external-ip=<PUBLIC_IP`:

```shell
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644 --node-external-ip=<PUBLIC_IP>
```

> Optional - Add the following line to your `~/.bashrc` file (used by Helm for example):

```shell
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

- Active the [bash auto-completion](https://kubernetes.io/docs/tasks/tools/included/optional-kubectl-configs-bash-linux/) for `kubectl`.

```shell
source /usr/share/bash-completion/bash_completion && \
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null && \
echo 'alias k=kubectl' >>~/.bashrc && \
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

Then, exit and reconnect to the master node.

- Get `k3s` token:

```shell
sudo cat /var/lib/rancher/k3s/server/node-token
```

- Use `ansible` to connect other nodes to the master node:

```shell
ansible workers -v -m shell -a "curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_NODE_IP>:6443 K3S_TOKEN=<TOKEN> sh -"
```

- Watch if workers nodes are well connected to the master node:

```shell
watch --interval 1 kubectl get nodes
```

#### Bonus

In a multiple node cluster, you may prefer not deploy any pod on the master node. If you want to do that, you can `taint` the master node with the `node-role.kubernetes.io/control-plane:NoSchedule` annotation.

- Taint the master node:

```shell
sudo kubectl taint node ampere-0 node-role.kubernetes.io/control-plane:NoSchedule
```

> Starting in v1.20, `node-role.kubernetes.io/master:NoSchedule` taint is **deprecated** in favor of `node-role.kubernetes.io/control-plane` and will be removed in v1.25.

## Test the Kubernetes cluster

Deploy a `whoami` application:

```shell
kubectl create deployment whoami --image=containous/whoami
```

```shell
kubectl expose deployment whoami --port=80 --type=NodePort
```

```shell
kubectl get svc
```

<div align="center">

Then, copy the **NodePort** and access it: `http://<PUBLIC_IP>:<NODE_PORT>`

![Success!](https://i.gifer.com/IXqA.gif)

🎉 **Well done!** 🎉

You are now **connected** to the Kubernetes cluster!

</div>

Built with `k3s` and `ansible` on `Oracle Cloud Infrastructure`.
