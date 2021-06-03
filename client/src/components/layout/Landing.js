import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import SpainMap from '../../utils/spain-map';
import PropTypes from 'prop-types';
import { isValidObjectId } from 'mongoose';
const Landing = () => {
  return (
    <Fragment>
      <div id='map'>
        <div id='province' className='province-info'>
          <div className='title'></div>
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
    </Fragment>
  );
};

Landing.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(Landing);
