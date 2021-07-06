import React, { useState } from 'react';
import { VectorMap } from '@south-paw/react-vector-maps';
import { google } from 'googleapis';
import keys from '../keys.json';
import spainProvinces from '../public/spain-provinces';

import styles from '../styles/Home.module.css';

export default function Home() {
  const style = { margin: '1rem auto', width: '300px' };

  const [selected, setSelected] = useState('');

  const onClick = ({ target }) => {
    const id = target.attributes.id.value;
    const name = target.attributes.name.value;

    // If selected includes the id already, remove it - otherwise add it
    setSelected(name);
  };

  return (
    <div className={styles.container}>
      <VectorMap {...spainProvinces} layerProps={{ onClick }} />
      <hr />
      <div className='province-info'>
        <div className='heading-wrapper'>
          <div className='name-heading-wrapper'>
            <div className='heading name-heading'>Nombre</div>
          </div>
          <div className='typology-heading-wrapper'>
            <div className='heading typology-heading'>Tipología</div>
          </div>
          <div className='status-heading-wrapper'>
            <div className='heading status-heading'>Status</div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function gsrun(cl) {
  try {
    const gsapi = google.sheets({ version: 'v4', auth: cl });

    const opt = {
      spreadsheetId: '18iw-XEqUMUMmlyrp-5PHgQAIUjzyfHaX015GHF_fvtI',
      range: 'Data'
    };

    let response = await gsapi.spreadsheets.values.get(opt);
    let values = [];
    if (response && response.data && response.data.values) {
      values = response.data.values;
    }
    console.log('values', values);
    return values;
  } catch (err) {
    console.log(err);
  }
}

export async function getServerSideProps(ctx) {
  try {
    const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
      'https://www.googleapis.com/auth/spreadsheets.readonly'
    ]);

    const tokens = await client.authorize();
    console.log('Connected');
    gsrun(client);
    return {
      props: {}
    };
  } catch (err) {
    console.log(err);
  }
}
