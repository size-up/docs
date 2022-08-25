---
sidebar_position: 1
---

# Using Oracle Cloud (OCI)

k3s cluster using the **Always Free Ressources** from **Oracle Cloud Infrastructure**.

### Minimum requirements:

The following are the minimum CPU and memory requirements for nodes in a high-availability K3s server:

| DEPLOYMENT SIZE | NODES     | VCPUS | RAM   |
| --------------- | --------- | ----- | ----- |
| Small           | Up to 10  | 2     | 4 GB  |
| Medium          | Up to 100 | 4     | 8 GB  |
| Large           | Up to 250 | 8     | 16 GB |
| X-Large         | Up to 500 | 16    | 32 GB |
| XX-Large        | 500+      | 32    | 64 GB |

> See documentation about [k3s](https://k3s.io/docs/concepts/cluster/k3s). `k3s` is a container orchestrator for Kubernetes. Is lightweight, easy to use and easy to deploy.

> See documentation about [Oracle - Always Free Ressources](https://docs.cloud.oracle.com/iaas/Content/Compute/Tasks/usingalwaysfreeressources.htm). `Always Free Ressources` can be used to create a k3s cluster on Oracle Cloud platform.

## Install and manage k3s

Install k3s and chown of the `/etc/rancher/k3s/k3s.yaml` file with this command:

### Common way to install k3s:

```shell
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
```

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

> `--node-external-ip=<PUBLIC_IP>` is the external IP address to advertise for nodes. It is using by k3s agent (in worker nodes) to load balance (e.g. proxy) the traffic between nodes. Cf. [this issue](https://github.com/k3s-io/k3s/issues/1523).

> You can follow the k3s installation by executing this command: `sudo tail -f /var/log/syslog`. If everything is ok, you should see the following message:

```shell
Running load balancer 127.0.0.1:6444 -> [<PUBLIC_IP>:6443]
```

### Copy the ssh key to the remote server with SCP

```shell
scp -i target.key file-to-copy.txt ubuntu@<IP_ADDRESS>:~/path-to-paste/
```

> This will copy the ssh key to the remote server, the file will be copied to the remote server in the path `~/path-to-paste/`. In that example, file will be named `file-to-copy.txt`. The key will be named `target.key`.

### Install k3s as agent on the worder node:

Retrieve the `node_token` from the master k3s server. The `node_token` is used to identify the node in the cluster.

`sudo cat /var/lib/rancher/k3s/server/node-token` will show the `node_token`.

```shell
curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_NODE_IP>:6443 K3S_TOKEN=<TOKEN> sh -
```

If you are using external public IPs and you want to refer this in your `kubectl get node -o=wide` command, you can use the `--node-external-ip=<PUBLIC_IP>` parameter as:

```shell
curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_NODE_IP>:6443 K3S_TOKEN=<TOKEN> sh -s - --node-external-ip=<PUBLIC_IP>
```

### Master node and Worker node firewall rules

> See [k3s firewall](https://k3s.io/docs/tutorials/k3s-firewall/) for more information.

Open all ports on `FORWARD`, `INPUT` and `OUTPUT`:

```shell
sudo iptables -I FORWARD -j ACCEPT
sudo iptables -I INPUT -j ACCEPT
sudo iptables -I OUTPUT -j ACCEPT
```

One line command to open all ports on `FORWARD`, `INPUT` and `OUTPUT`:

```shell
sudo iptables -I FORWARD -j ACCEPT && sudo iptables -I INPUT -j ACCEPT && sudo iptables -I OUTPUT -j ACCEPT
```

Open ports with restricted IPs range on `FORWARD`, `INPUT` and `OUTPUT`:

```shell
sudo iptables -I FORWARD -s 10.0.0.0/8 -j ACCEPT
sudo iptables -I FORWARD -d 10.0.0.0/8 -j ACCEPT

sudo iptables -I INPUT -s 10.0.0.0/8 -j ACCEPT
sudo iptables -I INPUT -d 10.0.0.0/8 -j ACCEPT

sudo iptables -I OUTPUT -s 10.0.0.0/8 -j ACCEPT
sudo iptables -I OUTPUT -d 10.0.0.0/8 -j ACCEPT
```

One line command:

```shell
sudo iptables -I FORWARD -s 10.0.0.0/8 -j ACCEPT && sudo iptables -I FORWARD -d 10.0.0.0/8 -j ACCEPT && sudo iptables -I INPUT -s 10.0.0.0/8 -j ACCEPT && sudo iptables -I INPUT -d 10.0.0.0/8 -j ACCEPT && sudo iptables -I OUTPUT -s 10.0.0.0/8 -j ACCEPT && sudo iptables -I OUTPUT -d 10.0.0.0/8 -j ACCEPT
```

#### To persist firewall/port policy (on Linux - Ubuntu distro)

```shell
sudo iptables-save
```

or

```shell
sudo -s iptables-save -c
```

#### Additionnal information

To see actual firewall rules:

```shell
sudo iptables -L
```

To accept all incoming traffic you can use following command , -P is to set default policy as accept.

### Taint master node, to avoid deploying pods on it.

> For an high availability cluster, the master node is the node that is responsible for managing the cluster. It's optimal to taint the master node to avoid deploying pods on it and let workers take over. This is done by adding a `NoSchedule` taint to the master node. The `NoSchedule` taint is added to the node with the following command:

```shell
sudo kubectl taint node <your_master_node> node-role.kubernetes.io/master:NoSchedule
```

### Same command to untaint it:

```shell
sudo kubectl taint node <your_master_node> node-role.kubernetes.io/master:NoSchedule-
```

## More information and configuration

### Install Rancher on a **single `k3s` node cluster**

> This installation method will not work if you have more than one `k3s` node cluster. Rancher will show just one `k3s` node cluster. Even if you have more than one `k3s` node cluster. If you want to install Rancher on a multi-node cluster, you will need to install using `helm`.

```shell
docker run --name rancher -d --restart=unless-stopped -p 80:80 -p 443:443 --privileged rancher/rancher:v2.5.9-head
```

> See [Installing Rancher on a Single Node Using Docker](https://rancher.com/docs/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/) documentation for more information.

### Reset or flush `iptables` configuration

```
sudo iptables -F
sudo iptables -X
```

## Uninstall k3s

k3s is installed with built-in scripts to uninstall and remove all contents.

### To uninstall `k3s` from a **server** node

```shell
/usr/local/bin/k3s-uninstall.sh
```

### To uninstall `k3s` from an **agent** node

```shell
/usr/local/bin/k3s-agent-uninstall.sh
```
