import React, { useState, Fragment } from 'react';
import { VectorMap } from '@south-paw/react-vector-maps';
import { google } from 'googleapis';
import spainProvinces from '../public/spain-provinces';

import styles from '../styles/Home.module.css';

export default function Home({ values }) {
  const [selected, setSelected] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const onClick = ({ target }) => {
    console.log('attributes', target.attributes['aria-label']);
    let id = null;
    let name = '';
    if (target.attributes.id) {
      id = target.attributes.id.value;
    }
    if (target.attributes.name) {
      name = target.attributes.name.value;
    }

    if (target.attributes['aria-label']) {
      name = target.attributes['aria-label'].value;
    }
    setSelected(name);
    setSelectedId(id);
  };

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
              {/* <div className='heading link-heading'>{headings[4]}</div> */}
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
      <div className='maps-wrapper'>
        {/* <div className='spain-map'>
          <img
            className={`${selected === 'España' ? 'spain-image-selected' : 'spain-image'}`}
            src='/spain-outline.png'
            alt=''
            onClick={onClickSpainOutline}
          />
        </div> */}
        <div
          className={`spain-map-provinces ${selected === 'España' ? 'spain-map-selected' : ''}`}
          onClick={onClick}
          id='spain'
          name='España'
        >
          <VectorMap
            id='spain'
            name='España'
            {...spainProvinces}
            layerProps={{ onClick }}
            checkedLayers={[selectedId && selected !== 'España' ? selectedId : null]}
          />
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
    console.log('process env client email', process.env.NEXT_PUBLIC_GSS_CLIENT_EMAIL);
    console.log('process env private key', process.env.NEXT_PUBLIC_GSS_PRIVATE_KEY);
    const client = new google.auth.JWT(
      process.env.NEXT_PUBLIC_GSS_CLIENT_EMAIL,
      null,
      process.env.NEXT_PUBLIC_GSS_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

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
