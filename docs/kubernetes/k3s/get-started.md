---
sidebar_position: 1
---

# Get started

**k3s** configuration and installation using the **Always Free Ressources** from **Oracle Cloud Infrastructure** and **Ansible** to deploy a full _(and free)_ Kubernetes cluster.

:::danger
Using the **Always Free Ressources** from **Oracle Cloud Infrastructure** require to set a [NAT Gateway](https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/NATgateway.htm) to gives cloud resources without public IP addresses access to the internet without exposing those resources to incoming internet connections.

But the [NAT Gateway](https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/NATgateway.htm) is no more available from the **Always Free Ressources** ; so the other node can't access to the internet with an ephemeral private address (to update linux packages or download k3s for instance).

Primary solution is just to setup a **Single Node Cluster**, while searching a workaround.
:::

### Minimum requirements

The following are the minimum CPU and memory requirements for nodes in a **high-availability** k3s server:

| DEPLOYMENT SIZE | NODES     | VCPUS | RAM   |
| --------------- | --------- | ----- | ----- |
| Small           | Up to 10  | 2     | 4 GB  |
| Medium          | Up to 100 | 4     | 8 GB  |
| Large           | Up to 250 | 8     | 16 GB |
| X-Large         | Up to 500 | 16    | 32 GB |
| XX-Large        | 500+      | 32    | 64 GB |

> See documentation about [k3s](https://k3s.io/docs/concepts/cluster/k3s). **k3s** is a container orchestrator for Kubernetes. Is lightweight, easy to use and easy to deploy.

> See documentation about [Oracle - Always Free Ressources](https://docs.cloud.oracle.com/iaas/Content/Compute/Tasks/usingalwaysfreeressources.htm). `Always Free Ressources` can be used to create a k3s cluster on Oracle Cloud platform.

## Prepare the master node

### Configuration iptables

:::danger

You **must configure iptables** to allow Kubernetes to communicate with other pods in its sub-network.

```shell
sudo iptables --insert INPUT --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert INPUT --destination 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert FORWARD --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert FORWARD --destination 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert OUTPUT --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert OUTPUT --destination 10.0.0.0/8 --jump ACCEPT && \
sudo netfilter-persistent save && \
sudo netfilter-persistent reload
```

:::

### Copy the ssh key into the server

From your local machine, copy the ssh key into the server. It'll be used by **Ansible** to connect to other nodes.

:::tip
Export the `$PRIVATE_KEY` and `$OCI_SERVER_URL` environment variables on your local machine.
:::

```shell
scp -i $PRIVATE_KEY $PRIVATE_KEY ubuntu@$OCI_SERVER_URL:~/.ssh/
```

### Update and upgrade `Ubuntu`

```shell
sudo apt update && \
sudo apt upgrade -y

sudo reboot
```

> The `reboot` is needed to apply the new kernel.

### Install **Ansible** and prepare other nodes for Kubernetes installation

```shell
sudo apt install software-properties-common -y && \
sudo add-apt-repository --yes --update ppa:ansible/ansible && \
sudo apt install ansible -y
```

Create a `~/.ansible.cfg` file in user's home directory:

```shell title="~/.ansible.cfg"
[defaults]
host_key_checking = False
```

Modify the ansible's hosts file, located at `/etc/ansible/hosts`:

```shell title="/etc/ansible/hosts"
sudo vim /etc/ansible/hosts
```

For instance, add the following line in the **Ansible**'s `hosts` file, to create the `workers` group:

```shell title="/etc/ansible/hosts"
# My inventory file is located in /etc/ansible/hosts on the cluster.

[workers]
ampere-1 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
amd-0 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
amd-1 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
```

Test connection to the nodes:

```shell
ansible workers -m ping
```

### Run **Ansible** playbooks

Update and upgrade workers nodes, [link to the the yaml file](./ansible/upgrade.playbook.yaml):

```shell title="upgrade.playbook.yaml"
ansible-playbook ./ansible/upgrade.playbook.yaml
```

Configure firewall rules, [link to the the yaml file](./ansible/firewall.playbook.yaml):

```shell title="firewall-config.playbook.yaml"
ansible-playbook ./ansible/firewall-config.playbook.yaml
```

## Install and manage k3s

### Common way to install k3s:

```shell
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
```

:::note
`--write-kubeconfig-mode 644` is used to `chown` the `KUBECONFIG` file at install time.
:::

### Install k3s using Docker instead of containerd:

For instance: install k3s using Docker as container system, do not deploy Traefik Ingress and chown of the `/etc/rancher/k3s/k3s.yaml` file:

```shell
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644 --no-deploy traefik --docker
```

### Install k3s using external private subnet node IPs:

If you plan to use k3s with **public ip nodes** (external of your subnet), you can use the `--node-external-ip=<PUBLIC_IP>` parameter as:

```shell
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644 --node-external-ip=<PUBLIC_IP>
```

:::note
`--node-external-ip=<PUBLIC_IP>` is the external IP address to advertise for nodes. It is using by k3s agent (in worker nodes) to load balance (e.g. proxy) the traffic between nodes. Cf. [this issue](https://github.com/k3s-io/k3s/issues/1523).
:::

:::tip
You can follow the **k3s installation** by executing this command: `sudo tail -f /var/log/syslog`. If everything is ok, you should see the following message:

```shell
Running load balancer 127.0.0.1:6444 -> [<PUBLIC_IP>:6443]
```

:::

:::tip

> Optional - Add the following line to your `~/.bashrc` or `~/.zshrc` file (used by **Helm**):

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

Then, exit and reconnect to the master node to active `bash completion`.
:::

### Install k3s as agent on the worker node:

Retrieve the `node_token` from the master k3s server. The `node_token` is used to identify the node in the cluster.

```shell
sudo cat /var/lib/rancher/k3s/server/node-token
```

:::tip
Before doing the next step, you can check live if the worker nodes are connected to the master node by doing:

```shell
watch --interval 1 kubectl get nodes -o=wide
```

And then, open a new terminal to continue.

:::

### Use **Ansible** to connect other nodes to the master node:

```shell
ansible workers -v -m shell -a "curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_NODE_IP>:6443 K3S_TOKEN=<TOKEN> sh -"
```

If you are using external public IPs and you want to refer this in your `kubectl get node -o=wide` command, you can use the `--node-external-ip=<PUBLIC_IP>` parameter as:

```shell
ansible workers -v -m shell -a "curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_NODE_IP>:6443 K3S_TOKEN=<TOKEN> sh -s - --node-external-ip=<PUBLIC_IP>"
```

### Taint master node, to avoid deploying pods on it.

For an **high-availability** cluster, the master node is the node that is responsible for managing the cluster. It's optimal to taint the master node to avoid deploying pods on it and let workers take over. This is done by **adding** a `NoSchedule` **taint** to the **master node**.

`NoSchedule` **taint** is added to the node with the following command:

```shell
kubectl taint node <master-node> node-role.kubernetes.io/control-plane:NoSchedule
```

Command to **untaint** it:

```shell
kubectl taint node <master-node> node-role.kubernetes.io/control-plane:NoSchedule-
```

:::caution
Starting in v1.20, `node-role.kubernetes.io/master:NoSchedule` taint is **deprecated** in favor of `node-role.kubernetes.io/control-plane` and will be removed in v1.25.
:::

## Test the Kubernetes cluster

Test the full deployment of the cluster by deploying a simple `whoami` application:

```shell
kubectl create deployment whoami --image=containous/whoami
```

```shell
kubectl expose deployment whoami --port=80 --type=NodePort
```

```shell
kubectl get svc
```

Then, copy the **NodePort** of the exposed service and access it: `http://<PUBLIC_IP>:<NODE_PORT>`

<div align="center">

![Well done!](https://i.gifer.com/IXqA.gif)

🎉 **Well done!** 🎉

</div>

Your Kubernetes cluster with ...

- **k3s**,
- **Ansible**
- on **Oracle Cloud Infrastructure** with **Always Free Ressources**

... is **working**!

## More information and configuration

### Install Rancher on a **single **k3s** node cluster**

:::caution
This installation method will not work if you have more than one **k3s** node cluster. Rancher will show just one **k3s** node cluster. Even if you have more than one **k3s** node cluster. If you want to install Rancher on a multi-node cluster, you will need to install using **helm**.
:::

```shell
docker run --name rancher -d --restart=unless-stopped -p 80:80 -p 443:443 --privileged rancher/rancher:v2.5.9-head
```

:::note
See [Installing Rancher on a Single Node Using Docker](https://rancher.com/docs/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/) documentation for more information.
:::

### Firewall troubleshooting

#### Master node and Worker node firewall rules

> See [k3s firewall](https://k3s.io/docs/tutorials/k3s-firewall/) for more information.

Open ports with restricted IPs range on **FORWARD**, **INPUT** and **OUTPUT**:

```shell
sudo iptables --insert INPUT --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert INPUT --destination 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert FORWARD --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert FORWARD --destination 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert OUTPUT --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert OUTPUT --destination 10.0.0.0/8 --jump ACCEPT && \
sudo netfilter-persistent save && \
sudo netfilter-persistent reload
```

#### Additionnal information

To see actual firewall rules:

```shell
sudo iptables -L
```

To accept all incoming traffic you can use following command , -P is to set default policy as accept.

### Reset or flush **iptables** configuration

```shell
sudo iptables -F
sudo iptables -X
```

## Uninstall k3s

k3s is installed with built-in scripts to uninstall and remove all contents.

### To kill all resources from a **server** node

The `killall` script cleans up containers, k3s directories, and networking components while also removing the iptables chain with all the associated rules. <br/>**The cluster data will not be deleted**.

```shell
/usr/local/bin/k3s-killall.sh
```

### To uninstall **k3s** from a **server** node

```shell
/usr/local/bin/k3s-uninstall.sh
```

### To uninstall **k3s** from an **agent** node

```shell
/usr/local/bin/k3s-agent-uninstall.sh
```
