import React from 'react';
import styles from '../styles/Home.module.css';
import Globe from '../components/Globe';
import * as d3 from 'd3';

export default function Home({ geoJson }) {
  console.log('geo json', geoJson);
  return (
    <div className={styles.container}>
      <Globe size={600} geoJson={geoJson} />
    </div>
  );
}
export async function getServerSideProps(ctx) {
  try {
    const json = await d3.json('http://enjalot.github.io/wwsd/data/world/world-110m.geojson');
    return {
      props: {
        geoJson: json
      }
    };
  } catch (err) {
    console.log('err', err);
    return {
      props: {
        geoJson: {}
      }
    };
  }
}
