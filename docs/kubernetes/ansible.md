---
sidebar_position: 3
---

# Ansible

How to manage multiple nodes with Ansible.

Do not forget to change permissions of your ssh keys to allow Ansible to connect to them by doing the following:

```shell
sudo chmod -R 600 ~/.ssh/*.key
```

Path to your Ansible hosts file is: `/etc/ansible/hosts`. It is where you will define your host / VM / compute / server.

You can use the following hosts file configuration as example:

```shell
[workers]
my-first-worker-alias ansible_host=10.10.10.10 ansible_ssh_private_key_file=/home/ubuntu/.ssh/example-0.key
my-second-worker-alias ansible_host=10.10.10.10 ansible_ssh_private_key_file=/home/ubuntu/.ssh/example-1.key
my-third-worker-alias ansible_host=10.10.10.10 ansible_ssh_private_key_file=/home/ubuntu/.ssh/example-2.key
```

> Here, `workers` is the name of the group of hosts. **It could be any name you want.** You can have as many groups as you want.

Ansible example action:

```shell
ansible all -m ping # ping all hosts in the hosts file (or in the inventory)

ansible workers -m service -a "name=httpd state=restarted" # This will restart httpd on all workers.

ansible all -a "sudo apt update && sudo apt upgrade -y && sudo apt full-upgrade -y && sudo apt autoremove -y" # This will update all packages on all hosts.
```

To upgrade all the nodes, you can use the following command:

```shell
ansible all -v -a "sudo apt-get upgrade -y"
```

> Argument `-v` is to use the `verbose` mode. It will print the output of the command. It is useful to know what is going on. It is not necessary to use it.

For example, a command to reboot all nodes:

```shell
ansible all -m shell -a "sudo reboot"
```

# Playbooks

Means the same thing as Ansible actions. It is a way to define a set of actions to be executed on a set of hosts.

> Documentation of [Ansible playbooks](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html).

Ansible playbooks are a way to automate the deployment of your infrastructure. It is a way to define a set of tasks that will be executed on a set of hosts.

Example command to run a playbook:

```shell
ansible-playbook my-playbook.yml
ansible-playbook my-playbook.yml -i hosts.txt
ansible-playbook my-playbook.yml -i hosts.txt --limit "my-first-worker-alias"
```

# Setting up a k3s cluster using Ansible

First, you need to install k3s on all the nodes. You can do it using the following command:

```shell
ansible workers -v -m shell -a "curl -sfL https://get.k3s.io | K3S_URL=https://<MASTER_NODE_IP>:6443 K3S_TOKEN=<TOKEN> sh -"
```

To easily open iptables on all the nodes, you can use the following command:

```
ansible all -m shell -a "sudo iptables -A INPUT -p tcp --dport 6443 -j ACCEPT`
```

# References and useful links

`Hosts` file example:

```shell title="/etc/ansible/hosts"
# My inventory file is located in /etc/ansible/hosts on the cluster.

[workers]
ampere-1 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
amd-0 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
amd-1 ansible_host=10.0.X.X ansible_ssh_private_key_file=~/.ssh/private.key
```
