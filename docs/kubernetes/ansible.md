---
sidebar_position: 4
---

# Ansible

How to manage multiple **Kubernetes** nodes with **Ansible**.

:::info
Do not forget to change permissions of your ssh keys to allow **Ansible** to connect to them by doing the following:

```bash
sudo chmod -R 600 ~/.ssh/key_name.key
```

:::

## Installation

```bash
sudo apt install software-properties-common -y && \
sudo add-apt-repository --yes --update ppa:ansible/ansible && \
sudo apt install ansible -y
```

## Configuration

### ansible.cfg file

If a host is reinstalled and has a different key in `known_hosts`, this will result in an error message until corrected. If a host is not initially in `known_hosts` this will result in prompting for confirmation of the key, which results in an interactive experience if using Ansible, from say, cron. You might not want this.

:::info
[Read documentation about this feature](https://docs.ansible.com/ansible/2.5/user_guide/intro_getting_started.html#host-key-checking).
:::

Create a `~/.ansible.cfg` file in user's home directory:

```bash title="~/.ansible.cfg"
[defaults]
host_key_checking = False
```

### Hosts file

Path to your **Ansible hosts file** is: `/etc/ansible/hosts`.<br/>It is where you will define your host/VM/compute/server, etc.

You can use the following hosts file configuration as example:

```bash
[workers]
my-first-worker-alias ansible_host=10.10.10.10 ansible_ssh_private_key_file=/home/ubuntu/.ssh/example-0.key
my-second-worker-alias ansible_host=10.10.10.10 ansible_ssh_private_key_file=/home/ubuntu/.ssh/example-1.key
my-third-worker-alias ansible_host=10.10.10.10 ansible_ssh_private_key_file=/home/ubuntu/.ssh/example-2.key
```

:::tip
Here, `workers` is the name of the group of hosts. **It could be any name you want.**<br/>You can also have as many groups as you want.
:::

**Ansible** action example:

```bash
ansible all -m ping # ping all hosts in the hosts file (or in the inventory)
```

```bash
ansible workers -m service -a "name=httpd state=restarted" # This will restart httpd on all workers.
```

```bash
ansible all -a "sudo apt update && sudo apt upgrade -y && sudo apt full-upgrade -y && sudo apt autoremove -y" # This will update all packages on all hosts.
```

:::tip
Argument `-v` is to use the `verbose` mode. It will print the output of the command. It is useful to know what is going on. It is not necessary to use it.
:::

Another example of command to reboot all nodes:

```bash
ansible all -m shell -a "sudo reboot"
```

## Playbooks

Means the same thing as Ansible actions. It is a way to define a set of actions to be executed on a set of hosts.

:::info
Read documentation about [Ansible playbooks](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html).
:::

Ansible playbooks are a way to automate the deployment of your infrastructure. It is a way to define a set of tasks that will be executed on a set of hosts.

### Example command

```bash
ansible-playbook my-playbook.yml
ansible-playbook my-playbook.yml -i hosts.txt
ansible-playbook my-playbook.yml -i hosts.txt --limit "my-first-worker-alias"
```

## Setting up a k3s cluster using Ansible

First, you need to install k3s on all the nodes. You can do it using the following command:

:::caution
Replace `<MASTER_NODE_IP>` and `<TOKEN>` by your own k3s informations.
:::

```bash
ansible workers -v -m shell -a "curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_NODE_IP>:6443 K3S_TOKEN=<TOKEN> sh -"
```

For instance, to easily config. `iptables` on all nodes, you can use the following command:

```bash
ansible all -m shell -a "sudo iptables -A INPUT -p tcp --dport 6443 -j ACCEPT`
```

### Hosts file example

```bash title="/etc/ansible/hosts"
# My inventory file is located in /etc/ansible/hosts on the cluster.

[workers]
ampere-1 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
amd-0 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
amd-1 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
```
