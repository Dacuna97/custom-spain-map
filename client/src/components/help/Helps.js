import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import HelpItem from './HelpItem';
import HelpForm from './HelpForm';
import { getPosts } from '../../actions/post';

const Helps = ({ post: { posts, loading }, getPosts }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the community
      </p>
      <HelpForm />
      <div className='posts'>
        {posts.map((post) => (
          <HelpItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

Helps.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});
export default connect(mapStateToProps, { getPosts })(Helps);
