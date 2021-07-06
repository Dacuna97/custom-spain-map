import React, { useState } from 'react';
import { VectorMap } from '@south-paw/react-vector-maps';
import spainProvinces from '../public/spain-provinces';

import styles from '../styles/Home.module.css';

export default function Home({ values }) {
  const [selected, setSelected] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const onClick = ({ target }) => {
    const id = target.attributes.id.value;
    const name = target.attributes.name.value;
    alert(name);
    setSelected(name);
    setSelectedId(id);
  };

  return (
    <div className={styles.container}>
      <VectorMap {...spainProvinces} layerProps={{ onClick }} checkedLayers={[selectedId]} />
    </div>
  );
}
