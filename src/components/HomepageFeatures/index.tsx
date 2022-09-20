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
    Svg: require("@site/static/img/svg/logo-kubernetes.svg").default,
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

const badge = {
  version:
    "https://img.shields.io/github/package-json/v/size-up/docs?label=application%20version",
  image: {
    version:
      "https://img.shields.io/docker/v/sizeup/docs?label=image%20version",
    size: "https://img.shields.io/docker/image-size/sizeup/docs",
  },
};

function getBadgeList() {
  const badges = [
    {
      element: badge.version,
      url: "https://github.com/size-up/docs/releases",
    },
    {
      element: badge.image.version,
      url: "https://hub.docker.com/r/sizeup/docs/tags",
    },
    {
      element: badge.image.size,
      url: "https://hub.docker.com/r/sizeup/docs/tags",
    },
  ];

  const badgeList = badges.map((badge) => (
    <a href={badge.url} target="_blank" rel="noreferrer noopener">
      <img className={styles.element} src={badge.element}></img>
    </a>
  ));
  return badgeList;
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
        <div className={styles.badge}>{getBadgeList()}</div>
      </div>
    </section>
  );
}
