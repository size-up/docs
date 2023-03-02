---
slug: talk-oci-cluster
title: Talk - Kubernetes cluster with Oracle Cloud
authors: anthonypillot
tags: [kubernetes, k3s, oci]
---

# Talk - Kubernetes cluster with Oracle Cloud

## Introduction

Hello everyone!

My name is Anthony Pillot. You may have met me during a performance audit or prestigious training courses given to numerous clients.

After this more than truthful presentation, I would like to get back to some more serious topics.

I am a developer. Sometimes I get bored in the evening. With this damn virus (COVID), even more.

## Use case

So I develop personal projects, sometimes. And in these (too) rare cases, I create a nice docker-compose with what I need to develop.

> My POC is gaining momentum, and I would like to potentially present it to others. Or at least stop allocating `6 gigabytes` of my machine for Docker resources.

So I would like to have a functional, performant, **prod-ready** (or at least, **prep-ready**), secure, and if possible, with modern technologies infrastructure. But I don't have any more money, my entire budget is allocated to the purchase of a Mustang GT.

Bare metal is fun, but it's never enough, finally if it's not spending more than €20 per month at OVH, for [several VPS at OVH](https://www.ovhcloud.com/fr/vps/).

> Which is _more or less_ equivalent to what will follow in terms of performance, and all for free.

## Contextualization of different `Public Cloud providers`

Of course, there are `Public Cloud providers` that you all know, who also offer free resources.

> `GCP` for example, offers some free resources but, if you have the misfortune to use a resource that is not included in these resources, you will pay. And no one will warn you if you use a resource that is not in the free resources. I paid the price for it. Not to mention that free resources are extremely limited (an `e2-micro` with `2 vCPUs` and `1 GB` of RAM, _thanks a lot dude_). Obviously, we forget all about `GKE` and others, which are absolutely not included in this `Free Tier`.

And that's where I found `Oracle Cloud Infrastructure`, through our wonderful Slack _which is an endless source of information, by the way_. And more specifically thanks to my colleague, who gave me the desire to take a closer look at this offer.

## Presentation of `Oracle Cloud Infrastructure`

And so, in October 2016, `Oracle`, this wonderful company, appreciated by all IT players, released `Oracle Cloud Infrastructure`.

A `Public Cloud provider` service that aims to compete with other `GCP`, `Azure`, `AWS`, to name a few.

To attract developers to their new platform, Oracle offers a free tier called Always Free Resources, like many other public cloud services. But this one is a bit more generous than others, and as the name of the offer suggests, these resources are free for life, subject to change from Oracle.

(Note: When signing up for OCI, you must provide your credit card information to prevent people from creating too many servers for free, installing a Cloud Computing tool like OpenStack, creating your own Public Cloud, and competing with Google!)

## OCI Always Free Resources

![oci-always-free-resources](./oci-always-free-resources.png)

The resources included in OCI's Always Free tier are:

- Two small AMD VMs, each with 1 OCPU core, 1 GB memory, and 0.48 Gbps bandwidth.
- And most importantly, an ARM VM with 4 OCPU cores, 24 GB memory, and 4 Gbps bandwidth; it can be divided into 4 small VMs with 1 OCPU core, 4 GB memory, and 1 Gbps bandwidth this time.
- 200 GB Block Volumes Storage, which are storage locations that can be attached to any VM.
- Two managed databases of 20 GB each.
- Global bandwidth limit at OCI: 10 TB per month.
- And a bunch of other services and resources that are apparently free for life.

# Demo!

[Note for the demo](@site/docs/kubernetes/get-started-with-k3s.md).

# Going Further

If you're interested in this presentation and would like to learn more, we can talk about other features to add to our brand new little cluster:

- Install cert-manager for automatic SSL certificate generation.
- Install Kubernetes Ingress for application routing and load balancing.
- Set up your domain name, DNS, for application routing (e.g. \*.my-domain.com; elastic.my-domain.com, data.my-domain.com, etc.).
