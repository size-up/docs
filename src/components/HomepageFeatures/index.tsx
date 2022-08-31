import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Server configuration",
    Svg: require("@site/static/img/svg/server-database.svg").default,
    description: (
      <>
        Multiple snippets, tutorials, configuration references and useful files
        and links works on any environment.
        <br />
        Focused on Open Source technologies and the DIY.
      </>
    ),
  },
  {
    title: "Kubernetes documentation",
    Svg: require("@site/static/img/svg/kubernetes.svg").default,
    description: (
      <>
        Kubernetes documentation about how quickly install k8s solutions with{" "}
        <code>kubeadm</code>, <code>k3s</code>, <code>cert-manager</code>, and
        all related content.
      </>
    ),
  },
  {
    title: "Blog posts",
    Svg: require("@site/static/img/svg/blog.svg").default,
    description: (
      <>
        All our experiments, all our proof of concept, in the form of a blog
        article, written by passionate people from the computer world.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
