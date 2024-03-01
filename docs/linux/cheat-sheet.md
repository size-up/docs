---
sidebar_position: 1
---

# Command Cheat Sheet

All the tips and tricks that I have found useful are here!

## Distribution and Kernel related

### Kernel version, hostname, date and architecture

```bash
uname -a
```

Output example:

```bash
Linux ubuntu 5.15.0-52-generic #58-Ubuntu SMP Tue Jun 28 14:27:29 UTC 2022 x86_64 x86_64 x86_64 GNU/Linux
```

### Get the distribution name and version

```bash
lsb_release -a
```

Output example:

```bash
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 22.04.4 LTS
Release:	22.04
Codename:	jammy
```

---

### Get installed kernel version

```bash
dpkg --list | grep linux-image
```

Output example:

```bash
ii  linux-image-5.15.0-52-generic             5.15.0-52.58~22.04.1                    amd64        Signed kernel image generic
```

### Install a specific kernel version

```bash
sudo apt install \
linux-headers-5.15.0-52-generic \
linux-image-5.15.0-52-generic \
linux-modules-5.15.0-52-generic \
linux-modules-extra-5.15.0-52-generic
```

Or **remove** a specific kernel version ...

```bash
sudo apt purge \
linux-headers-5.15.0-52-generic \
linux-image-5.15.0-52-generic \
linux-modules-5.15.0-52-generic \
linux-modules-extra-5.15.0-52-generic
```

---

### Timezone

Get the current **timezone**

```bash
timedatectl status
```

Output example:

```bash
Local time: Fri 2022-07-01 14:27:29 UTC
Universal time: Fri 2022-07-01 14:27:29 UTC
RTC time: Fri 2022-07-01 14:27:29
Time zone: UTC (UTC, +0000)
System clock synchronized: yes
NTP service: active
RTC in local TZ: no
```

Change the **timezone**

```bash
sudo timedatectl set-timezone Europe/Paris
```

Then, reboot the system.

:::caution
When you are running Cron jobs, you need to make sure that the timezone is set correctly. Otherwise, the jobs will run at the wrong time.
:::

## System related

### Get the system uptime

```bash
uptime
```

### Kill a process

```bash
kill -9 pid_number
```

:::tip
To find the `pid_number` of a process, use the `ps` command or `ps aux` to see all process, or `top` command.

Coupled with `grep` to filter the process you want to kill, example:

```bash
ps aux | grep process_name
```

:::

---

### Avoid typing password as **`sudo`**

```bash
sudo visudo
```

And add it to the end of the file:

```bash
username ALL=(ALL) NOPASSWD: ALL
```

## Network related

### Get the IP address of the machine

```bash
ip addr show
```

---

### Iptables related

#### List all the rules in the iptables

```bash
sudo iptables -L -n -v
```

#### Allow traffic by CIDR using iptables

```bash
sudo iptables --insert INPUT --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert INPUT --destination 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert FORWARD --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert FORWARD --destination 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert OUTPUT --source 10.0.0.0/8 --jump ACCEPT && \
sudo iptables --insert OUTPUT --destination 10.0.0.0/8 --jump ACCEPT && \
sudo netfilter-persistent save && \
sudo netfilter-persistent reload
```

:::info
For instance, this CIDR `10.0.0.0/8` contains all the IP addresses from `10.0.0.0` to `10.255.255.255`

This [website can help you to find the CIDR of a specific IP address](https://www.ipaddressguide.com/cidr).
:::

#### Open a specific port

```bash
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
```

#### Reset the iptables and flush all the rules

```bash
sudo iptables -F
sudo iptables -X
```

## Disk related

### Disk free space

```bash
df -kh
```

`-k` is for kilobytes, `-h` is for human readable.

Output example:

```bash
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           2.4G  1.4M  2.4G   1% /run
/dev/sda1       194G  2.5G  192G   2% /
tmpfs            12G     0   12G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
/dev/sda15       98M  6.3M   92M   7% /boot/efi
tmpfs           2.4G  4.0K  2.4G   1% /run/user/1001
```

### Disk usage

```bash
sudo du -hs /
```

`-h` is for human readable, `-s` is for summary.

Output example:

```bash
2.5G    /
```

## Ping

It is possible to reduce the default delay (1 second) of ping command (recently minimum time was changed to 200ms = 0.2).

```bash
ping -i 0.2 server.com
```

Root can issue shorter time.

```bash
sudo ping -i 0.01 server.com
```

## Files and directories

### Base64

**Encode** a **file** to base64

```bash
base64 file.txt
```

**Decode** a base64 **file**

```bash
base64 --decode file.txt
```

---

**Encode** from **stdin** to base64

```bash
echo "Hello World" | base64
```

**Decode** from **stdin** to base64

```bash
echo "SGVsbG8gV29ybGQ=" | base64 --decode
```

## Find a file

Find is a command-line utility for searching files and directories in a Unix-like computer operating systems.

```bash
find [where to start searching from] [expression determines what to find] [-options] [what to find]`
```

Find a **file**

```bash
find /directory -name "file.txt"
```

Find a **file** with a **pattern**

```bash
find /directory -name "*file*.txt"
```

## Git

### Graphical logs

```bash
git log --oneline --graph --decorate --all
```

A full example:

```bash
git log --all --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''%s%C(reset) %C(dim)- %an%C(reset)'
```

### Rebase

For instance, a git rebase interactive from your current branch, to the 3 previous commits:

```bash
git rebase -i HEAD~3
```

:::tip
The shortcut of `HEAD` is `@`.
:::

```bash
git rebase -i @~3
```

:::tip
`HEAD` is the current branch. `HEAD~1` is the previous commit. `HEAD~2` is the commit before the previous one. And so on.
:::

An other example, a git rebase interactive from the current branch, to the commit `123456789`:

```bash
git rebase -i 123456789
```

And finally, a git rebase interactive from the current branch, to the previous commit `123456789`:

```bash
git rebase -i 123456789^
```

Or with the tilde shortcut:

```bash
git rebase -i 123456789~
```
