import React from "react";

import styles from "./styles.module.css";

import Globe from "react-globe.gl";

// Gen random data
const N = 20;
const arcsData = [...Array(N).keys()].map(() => ({
  startLat: (Math.random() - 0.5) * 180,
  startLng: (Math.random() - 0.5) * 360,
  endLat: (Math.random() - 0.5) * 180,
  endLng: (Math.random() - 0.5) * 360,
  color: [
    ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
  ],
}));

const globeSize = 400;

export default function GlobeElement(): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.globe}>
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          arcsData={arcsData}
          arcColor={"color"}
          arcDashLength={() => Math.random()}
          arcDashGap={() => Math.random()}
          arcDashAnimateTime={() => Math.random() * 4000 + 500}
          backgroundColor="#005c9e"
          width={globeSize}
          height={globeSize}
        />
      </div>
    </div>
  );
}
