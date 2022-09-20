---
sidebar_position: 3
---

# Traefik and cert-manager

How get **HTTPS** with **auto-generated Certificate**, Using **Traefik** as **Ingress Controller** and **cert-manager**.

:::tip
Traefik is **automatically installed by default with k3s**.
:::

## Installation

### Install cert-manager

:::info
[Read global documentation about **cert-manager**](https://cert-manager.io/docs/installation/).
:::

:::caution
Remember to check the version of **cert-manager** before applying the YAML file.
:::

```shell
kubectl apply -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.yaml
```

### Create a **ClusterIssuer**

:::info
An Issuer is a namespaced resource, and it is not possible to issue certificates from an Issuer in a different namespace. This means you will need to create an Issuer in each namespace you wish to obtain Certificates in.

**If you want to create a single Issuer that can be consumed in multiple namespaces, you should consider creating a ClusterIssuer resource.** This is almost identical to the Issuer resource, however is non-namespaced so it can be used to issue Certificates across all namespaces.

[Read documentation about **ClusterIssuer** and **Issuer**](https://cert-manager.io/docs/concepts/issuer/).
:::

#### Example

```yaml title="cluster-issuer-letsencrypt.yaml"
apiVersion: cert-manager.io/v1
kind: ClusterIssuer # or Issuer, see: https://cert-manager.io/docs/concepts/issuer/#namespaces
metadata:
  namespace: default
  name: letsencrypt-staging
spec:
  acme:
    # you must replace this email address with your own email address
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account and domains
    email: your.email@mail.com
    server: https://acme-staging-v02.api.letsencrypt.org/directory

    privateKeySecretRef:
      # secret resource that will be used to store the account's private key
      name: letsencrypt-staging-private-key # name of the secret that will hold the private key

    # add a single challenge solver, HTTP01 using traefik
    solvers: # solvers is a list of challenge solvers
      - http01: # the type of solver
          ingress: # the name of the ingress resource
            class: traefik # class of the ingress resource
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer # or Issuer, see: https://cert-manager.io/docs/concepts/issuer/#namespaces
metadata:
  namespace: default
  name: letsencrypt-production
spec:
  acme:
    # you must replace this email address with your own email address
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account and domains
    email: your.email@mail.com
    server: https://acme-v02.api.letsencrypt.org/directory

    privateKeySecretRef:
      # secret resource that will be used to store the account's private key
      name: letsencrypt-production-private-key # name of the secret that will hold the private key

    # add a single challenge solver, HTTP01 using traefik
    solvers: # solvers is a list of challenge solvers
      - http01: # the type of solver
          ingress: # the name of the ingress resource
            class: traefik # class of the ingress resource
```

:::caution
Replace `your.email@mail.com` by **your mail** ! The email address is used for ACME registration by Let's Encrypt.
:::

### Create Ingress that use the ClusterIssuer

#### ⚠️ Prerequisites !

1. Create the deployment.

2. Expose the deployment

   - Using a yaml configuration file.
   - Using the `kubectl expose deployment my-deployment` command.

3. Create Ingress.

```yaml
annotations:
  kubernetes.io/ingress.class: traefik
  traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
  cert-manager.io/cluster-issuer: letsencrypt-staging
  acme.cert-manager.io/http01-edit-in-place: "true"
```

:::info
In this example, we're using annotations to specify the ingress controller, class (in this case we're using **Traefik**) and the **router middleware** (to automatically redirect to HTTPS). See documentation about [Traefik middlewares RedirectScheme](https://doc.traefik.io/traefik/middlewares/http/redirectscheme/).
:::

### Redirect HTTP to HTTPS using embedded Traefik

To perform the redirection, we need to create a `RedirectScheme` middleware. This middleware annotation is automatically installed with Traefik. See documentation about [Traefik middlewares RedirectScheme](https://doc.traefik.io/traefik/middlewares/http/redirectscheme/).

Apply this Traefik middleware `RedirectScheme`:

```yaml title="traefik-middleware-redirectscheme.yaml"
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: redirect-https
spec:
  redirectScheme:
    scheme: https
    permanent: true
```

And you have to specify the `RedirectScheme` middleware in the `traefik.ingress.kubernetes.io/router.middlewares` annotation, to refer it in the `Ingress` ressource.

```yaml
traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
```

:::note
`default` is the namespace and `redirect-https` is the `middleware` ressource name.
:::

### Staging Ingress example

:::info
[Documentation of Traefik Ingress](https://doc.traefik.io/traefik/providers/kubernetes-ingress/).
:::

```yaml title="ingress-staging.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  namespace: example-staging
  name: my-example-ingress
  annotations:
    # By default in k3s, the ingress class is traefik, documentation: https://doc.traefik.io/traefik/routing/providers/kubernetes-ingress/
    kubernetes.io/ingress.class: traefik # add an annotation indicating the ingress class to use
    traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd # that middleware have to be created, this will redirect to http to https if the request is not https

    # Cert manager configuration
    cert-manager.io/cluster-issuer: letsencrypt-staging # add an annotation indicating the issuer to use
    acme.cert-manager.io/http01-edit-in-place: "true" # for more info on this field: https://cert-manager.io/docs/usage/ingress/#supported-annotations
spec:
  rules:
    - host: my.example.com
      http:
        paths:
          - pathType: Prefix
            path: /
            backend:
              service:
                name: example-service
                port:
                  number: 80 # must be on port 80
  tls: # placing a host in the TLS config will determine what ends up in the cert's subjectAltNames
    - hosts:
        - my.example.com
      secretName: my-example-ingress-staging-cert # cert-manager will store the created certificate in this secret
```

### Production Ingress example

```yaml title=ingress-production.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  namespace: example-production
  name: my-example-ingress
  annotations:
    # By default in k3s, the ingress class is traefik, documentation: https://doc.traefik.io/traefik/routing/providers/kubernetes-ingress/
    kubernetes.io/ingress.class: traefik # add an annotation indicating the ingress class to use
    traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd # that middleware have to be created, this will redirect to http to https if the request is not https

    # Cert manager configuration
    cert-manager.io/cluster-issuer: letsencrypt-production # add an annotation indicating the issuer to use
    acme.cert-manager.io/http01-edit-in-place: "true" # for more info on this field: https://cert-manager.io/docs/usage/ingress/#supported-annotations
spec:
  rules:
    - host: my.example.com
      http:
        paths:
          - pathType: Prefix
            path: /
            backend:
              service:
                name: example-service
                port:
                  number: 80 # must be on port 80
  tls: # placing a host in the TLS config will determine what ends up in the cert's subjectAltNames
    - hosts:
        - my.example.com
      secretName: my-example-ingress-production-cert # cert-manager will store the created certificate in this secret
```

## Tips and tricks

### "HTTP01 challenge - Edit in place"

From the **cert-manager** `1.6` version, it seems that is necessary to precise in the **Ingress**, that **cert-manager** can edit the Ingress delployment. See the [cert-manager documentation](https://cert-manager.io/docs/usage/ingress/).

:::info
The `acme.cert-manager.io/http01-edit-in-place` annotation is used to specify that the HTTP01 challenge should be edited in place. This is necessary because the HTTP01 challenge is generated by the ingress controller and the ingress controller is not aware of the ingress.

Read documentation about `http01-edit-in-place`.
:::

Using this annotation, the **cert-manager** can edit the Ingress:

```yaml
acme.cert-manager.io/http01-edit-in-place: "true"
```

## References

- [Traefik](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) - Kubernetes Ingress controller.
- [cert-manager](https://cert-manager.io/docs/) - Certificate management for Kubernetes.
