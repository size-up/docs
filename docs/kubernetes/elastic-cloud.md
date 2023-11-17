---
sidebar_position: 3
---

# Elastic Cloud

Install and manage **Elasticsearch** and **Kibana** on Kubernetes.

![Elasticsearch](@site/static/img/svg/logo-elasticsearch.svg) **+**
![Kibana](@site/static/img/svg/logo-kibana.svg) **=**
![Elastic Cloud](@site/static/img/svg/logo-elastic-cloud.svg) **[Elastic Cloud](https://www.elastic.co/fr/cloud/)** on <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" alt="Kubernetes logo" width="38"/>.

Built on the Kubernetes Operator pattern, **Elastic Cloud** on Kubernetes (ECK) extends the basic Kubernetes orchestration capabilities to support the setup and management of Elasticsearch, Kibana, APM Server, Enterprise Search, Beats, Elastic Agent, and Elastic Maps Server on Kubernetes.

With **Elastic Cloud** on Kubernetes you can streamline critical operations, such as:

Managing and monitoring multiple clusters
Scaling cluster capacity and storage
Performing safe configuration changes through rolling upgrades
Securing clusters with TLS certificates
Setting up hot-warm-cold architectures with availability zone awareness

:::info
[Read documentation about **Elastic Cloud** on Kubernetes](https://www.elastic.co/guide/en/cloud-on-k8s/current/index.html).
:::

## Installation

### Prerequisites

[Follow these steps](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-eck.html) to create CRD and RBAC resources for **Elastic Cloud**.

### 🚀 Deploying Elasticsearch cluster

[Follow these steps](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-elasticsearch.html) to deploy the Elasticsearch cluster for **Elastic Cloud**.

### 🚀 Deploying Kibana cluster

[Follow these steps](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-kibana.html) to deploy Kibana for **Elastic Cloud**.

### 📲 Login to Kibana

Login as the **elastic** user. The password can be obtained with the following command:

:::caution
Replace **quickstart** by your **Kibana** deployment name.
:::

```bash
kubectl get secret quickstart-es-elastic-user -o=jsonpath='{.data.elastic}' | base64 --decode; echo
```

## Recommandations

### Volume Claim Templates

:::info
[Read documentation about Volume Claim Templates](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-volume-claim-templates.html).
:::

:::note
By default, the operator creates a **PersistentVolumeClaim** with a capacity of **1Gi** for each pod in an Elasticsearch cluster to prevent data loss in case of accidental pod deletion. For production workloads, you should define your own volume claim template with the desired storage capacity and (optionally) the Kubernetes storage class to associate with the persistent volume.
:::

To size up the default Elasticsearch capacity, use this following configuration:

```yaml
spec:
  nodeSets:
    - name: default
      count: 1
      volumeClaimTemplates:
        - metadata:
            name: elasticsearch-data # Do not change this name unless you set up a volume mount for the data path.
          spec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 5Gi
            storageClassName: standard
```

### TLS Certificates

:::info
[Read documentation about TLS Certificates](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-tls-certificates.html).
:::

:::note
This section only covers TLS certificates for the HTTP layer. TLS certificates for the transport layer that are used for internal communications between Elasticsearch nodes are managed by ECK and cannot be changed. You can however set your own certificate authority for the transport layer.
:::

#### Disabling TLS Certificates

If you want to manage the Ingress, TLS and other by yourself, you have to disable the TLS Certificates from Kibana.

```yaml
spec:
  http:
    tls:
      selfSignedCertificate:
        disabled: true
```

## Troubleshootings

### "Configuration missing"

Talking about "Configuration missing" pop-up error message on the bottom right of the Kibana application

If you get the error [Configuration missing](https://www.elastic.co/guide/en/kibana/7.15/settings.html#server-publicBaseUrl) with this text:

> server.publicBaseUrl is missing and should be configured when running in a production environment. Some features may not behave correctly.

You need to set the right available route to your kibana application.

```yaml
spec:
  podTemplate:
    spec:
      containers:
        - name: kibana
          env:
            - name: SERVER_PUBLICBASEURL
              value: "https://my.path.kibana.com"
```

## Real world example

:::info
TLS is disabled to be managed later or directly by the ingress on top of different deployed services (for instance with cert-manager).
:::

```yaml title="namespace.yaml"
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
```

```yaml title="elastic.yaml"
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  namespace: monitoring
  name: monitoring
spec:
  version: 8.4.2
  volumeClaimDeletePolicy: DeleteOnScaledownOnly
  nodeSets:
    - name: node
      count: 2
      podTemplate:
        spec:
          initContainers:
            - name: sysctl
              securityContext:
                privileged: true
                runAsUser: 0
              command: ["sh", "-c", "sysctl -w vm.max_map_count=262144"]
      volumeClaimTemplates:
        - metadata:
            name: elasticsearch-data # Do not change this name unless you set up a volume mount for the data path.
          spec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 50G
            storageClassName: local-path
  http:
    tls:
      selfSignedCertificate:
        disabled: true
```

```yaml title="kibana.yaml"
apiVersion: kibana.k8s.elastic.co/v1
kind: Kibana
metadata:
  namespace: monitoring
  name: monitoring
spec:
  version: 8.4.2
  count: 1
  elasticsearchRef:
    name: monitoring
  podTemplate:
    spec:
      containers:
        - name: kibana
          env:
            - name: SERVER_PUBLICBASEURL
              value: "https://kibana.sizeup.cloud"
  http:
    tls:
      selfSignedCertificate:
        disabled: true
```

```yaml title="apm.yaml"
apiVersion: apm.k8s.elastic.co/v1
kind: ApmServer
metadata:
  namespace: monitoring
  name: monitoring
spec:
  version: 8.4.2
  count: 1
  elasticsearchRef:
    name: monitoring
  kibanaRef:
    name: monitoring
  http:
    tls:
      selfSignedCertificate:
        disabled: true
```
