---
sidebar_position: 3
---

# Traefik and cert-manager

How get **HTTPS** with **generated Certificate**, using **Traefik** and **cert-manager**.

Using Traefik as Ingress Controller, **automatically default installed with k3s**.

## Installation

### Install cert-manager

> cert-manager documentation : https://cert-manager.io/docs/installation/kubectl/

Verify the version of the `cert-manager` before apply the YAML file.

```shell
kubectl apply -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.yaml
```

### Create a `ClusterIssuer`

Example:

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

### Create Ingress that use the ClusterIssuer

1. Create the deployment.

2. Expose the deployment, using a `YAML` configuration file or using the `kubectl expose deployment my-service-to-expose`.

> `my-service-to-expose` is the name of the deployment.

1. Create Ingress.

```yaml
annotations:
  kubernetes.io/ingress.class: traefik
  traefik.ingress.kubernetes.io/router.middlewares: default-redirect-https@kubernetescrd
  cert-manager.io/cluster-issuer: letsencrypt-staging
  acme.cert-manager.io/http01-edit-in-place: "true"
```

> In this example, we're using annotations to specify the ingress controller, class (in this case we're using `traefik`) and the router middleware (to automatically redirect to HTTPS). See documentation about [Traefik middlewares RedirectScheme](https://doc.traefik.io/traefik/middlewares/http/redirectscheme/).

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

> `default` is the namespace and `redirect-https` is the `middleware` ressource name.

### Staging Ingress example

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
                  number: 80
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
                  number: 80
  tls: # placing a host in the TLS config will determine what ends up in the cert's subjectAltNames
    - hosts:
        - my.example.com
      secretName: my-example-ingress-production-cert # cert-manager will store the created certificate in this secret
```

## Tips and tricks

### "HTTP01 - Edit in place"

From the `cert-manager` `1.6` version, it seems that is necessary to precise in the `Ingress`, that `cert-manager` can edit the Ingress delployment. See the [cert-manager documentation](https://cert-manager.io/docs/usage/ingress/).

> The `acme.cert-manager.io/http01-edit-in-place` annotation is used to specify that the HTTP01 challenge should be edited in place. This is necessary because the HTTP01 challenge is generated by the ingress controller and the ingress controller is not aware of the ingress.

Using this annotation, the `cert-manager` can edit the Ingress:

```yaml
acme.cert-manager.io/http01-edit-in-place: "true"
```

## References

- [Traefik](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) - Kubernetes Ingress controller.

- [cert-manager](https://cert-manager.io/docs/installation/kubernetes/) - Certificate management for Kubernetes.
