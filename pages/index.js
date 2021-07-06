import React, { useState, Fragment } from 'react';
import { VectorMap } from '@south-paw/react-vector-maps';
import { google } from 'googleapis';
import keys from '../keys.json';
import spainProvinces from '../public/spain-provinces';
import spainMap from '../public/spain-map';
import styles from '../styles/Home.module.css';

export default function Home({ values }) {
  const [selected, setSelected] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const onClick = ({ target }) => {
    const id = target.attributes.id.value;
    const name = target.attributes.name.value;

    setSelected(name);
    setSelectedId(id);
  };
  console.log('values', values);
  const headings = values && values.length > 0 ? values[0] : [];
  const helps = values && values.length > 1 ? values.filter((value) => value[3] === selected) : [];
  return (
    <div className={styles.container}>
      {headings && headings.length > 0 && helps && helps.length > 0 && (
        <div className='province-info-wrapper'>
          <div className='province-info'>
            <div className='name-wrapper'>
              <div className='heading name-heading'>{headings[0]}</div>
              {helps.map((help) => (
                <div className='name'>{help[0]}</div>
              ))}
            </div>
            <div className='typology-wrapper'>
              <div className='heading typology-heading'>{headings[1]}</div>
              {helps.map((help) => (
                <div className='typology' style={{ backgroundColor: help[1] }}></div>
              ))}
            </div>
            <div className='status-wrapper'>
              <div className='heading status-heading'>{headings[2]}</div>
              {helps.map((help) => (
                <div className='status' style={{ backgroundColor: help[2] }}></div>
              ))}
            </div>
            <div className='link-wrapper'>
              <div className='heading link-heading'>{headings[4]}</div>
              {helps.map((help) => {
                if (help[4]) {
                  return (
                    <a className='link' target='_blank' href={help[4]}>
                      +INFO
                    </a>
                  );
                } else {
                  return <div className='link' />;
                }
              })}
            </div>
          </div>
        </div>
      )}
      <VectorMap {...spainMap} layerProps={{ onClick }} checkedLayers={[selectedId]} />

      <VectorMap {...spainProvinces} layerProps={{ onClick }} checkedLayers={[selectedId]} />
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
    const values = await gsrun(client);
    return {
      props: {
        values
      }
    };
  } catch (err) {
    console.log(err);
  }
}
