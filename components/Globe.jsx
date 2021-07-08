import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const Globe = ({ size, geoJson }) => {
  const [rotation, setRotation] = useState(0);
  const [countrySelected, setCountrySelected] = useState('');
  const [interpolatorValue, setInterpolatorValue] = useState(0);

  const onHoverCountry = (event) => {
    const countryName = event.target.attributes.name.value;
    setCountrySelected(countryName);
  };

  const onLeaveCountry = () => {
    setCountrySelected('');
  };

  useEffect(() => {
    window.requestAnimationFrame(() => {
      setRotation(rotation + 0.5);
      if (interpolatorValue > 1) {
        setInterpolatorValue(0);
      } else {
        setInterpolatorValue(interpolatorValue + 0.01);
      }
    });
  });

  let projection = d3.geoOrthographic().fitSize([size, size], geoJson).rotate([rotation]);
  let geoGenerator = d3.geoPath().projection(projection);

  let londonLonLat = [0.1278, 51.5074];
  let newYorkLonLat = [-74.0059, 40.7128];

  const geoLine = geoGenerator({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [londonLonLat, newYorkLonLat]
    }
  });
  let circleGenerator = d3.geoCircle().center([0.1278, 51.5074]).radius(5);
  // returns a GeoJSON object representing a circle

  let circle = circleGenerator();
  // returns a path string representing the projected circle

  const geoCircle = geoGenerator(circle);

  let geoInterpolator = d3.geoInterpolate(londonLonLat, newYorkLonLat);

  let geoInterpolatorGenerated = geoGenerator({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: geoInterpolator(interpolatorValue) }
  });

  let countryList = ['Argentina', 'Brazil', 'Mexico', 'Chile', 'Uruguay', 'Peru', 'Colombia'];

  return (
    <div className='country-wrapper flex'>
      <div className='country-list'>
        {countryList.map((country) => (
          <h1 onMouseEnter={onHoverCountry} onMouseLeave={onLeaveCountry} name={country}>
            {country}
          </h1>
        ))}
      </div>
      <svg width={size} height={size}>
        <g>
          {geoJson.features.map((feature) => (
            <path
              d={geoGenerator(feature)}
              id={feature.id}
              name={feature.properties.name}
              className={`${countrySelected === feature.properties.name ? 'country-selected' : ''}`}
            />
          ))}

          <path d={geoLine} className='line' />
          <path d={geoCircle} className='circle' />
          <path d={geoInterpolatorGenerated} className='interpolate' />
        </g>
      </svg>
    </div>
  );
};

export default Globe;
