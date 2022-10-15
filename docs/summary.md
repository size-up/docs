---
sidebar_position: 1
---

# Summary

Documentation that describes many tips and tricks on many IT topics. Configuration references and useful files and links used to construct beautiful and efficient IT infrastructures with Open Source tools.

---

## Kubernetes section

<img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" alt="Kubernetes logo" width="100"/>

All Kubernetes configuration files and components.

[Kubernetes](https://kubernetes.io/) is a distributed, fault-tolerant, and highly-scalable software platform for automating the deployment, configuration, and ongoing management of containerized applications.

## k3s section

<img src="https://docs.k3s.io/img/k3s-logo-light.svg" alt="k3s logo" width="150"/>

All k3s configuration files and components.

[k3s](https://k3s.io/) a lightweight Kubernetes by [Rancher](https://rancher.com/).<br/>Easy to install, half the memory, all in a binary of less than **100 MB**.

**Simple but powerful** “batteries-included” features have been added, such as: a **local storage provider**, a **service load balancer**, a **Helm controller**, and the **Traefik ingress controller**.

External dependencies have been minimized _(just a modern kernel and cgroup mounts needed)_.

k3s packages the required dependencies, including:

- **containerd** _by default (instead of Docker container runtime)_
- **Flannel**
- **CoreDNS**
- CNI
- Host utilities (iptables, socat, etc)
- Ingress controller (**traefik**)
- Embedded service loadbalancer
- Embedded network policy controller

## Ansible section

<img src="https://docs.ansible.com/ansible/latest/_static/images/Ansible-Mark-RGB_Black.svg" alt="Ansible logo" width="150"/>

[Ansible](https://www.ansible.com/) is a tool for automating deployment, configuration management, and application orchestration.<br/>
[Ansible Playbook](https://docs.ansible.com/ansible/latest/intro_playbooks.html) is a text file that contains a series of commands that are executed on a remote host or multiple remote hosts.

---

## GitHub Actions

Useful snippets and references to help you building workflow in **GitHub Actions**.
