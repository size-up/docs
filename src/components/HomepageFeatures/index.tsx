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
    title: "Open Source technologies",
    Svg: require("@site/static/img/svg/logo-open-source.svg").default,
    description: (
      <>
        We believe that <strong>Open Source</strong> technologies are the{" "}
        <strong>best</strong> technology. And here we rely on Open Source and
        use it to the fullest in all our projects and documentation. We are also
        open to contributions.
      </>
    ),
  },
  {
    title: "Operating System snippets",
    Svg: require("@site/static/img/svg/logo-operating-system.svg").default,
    description: (
      <>
        There is no need to use a specific operating system to use our
        documentation. We are operating system agnostic and we provide snippets
        for all.
        <br />
      </>
    ),
  },
  {
    title: "Extensive documentation",
    Svg: require("@site/static/img/svg/logo-git.svg").default,
    description: (
      <>
        Our documentation is extensive and covers all the topics in detail.
        Covering Git and GitHub, Docker, Kubernetes, and many more.
      </>
    ),
  },
  {
    title: "Server configuration",
    Svg: require("@site/static/img/svg/logo-server.svg").default,
    description: (
      <>
        Multiple snippets, tutorials, configuration references and useful files
        and links works on any environment.
      </>
    ),
  },
  {
    title: "Kubernetes documentation",
    Svg: require("@site/static/img/svg/logo-kubernetes.svg").default,
    description: (
      <>
        Kubernetes documentation about how quickly install k8s solutions with{" "}
        k3s, cert-manager, HTTPS, and all related content.
      </>
    ),
  },
  {
    title: "Blog posts",
    Svg: require("@site/static/img/svg/logo-blog.svg").default,
    description: (
      <>
        All our experiments, all our proof of concept, in the form of a blog
        article, written by passionate people from the computer world.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem): JSX.Element {
  const size: number = 200;
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg
          className={styles.featureSvg}
          role="img"
          width={size}
          height={size}
        />
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

function getBadgeList(): JSX.Element[] {
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
