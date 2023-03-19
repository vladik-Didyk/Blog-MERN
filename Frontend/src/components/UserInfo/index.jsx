import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <img
        className={styles.avatar}
        src={avatarUrl || '/noavatar.png'}
        alt={fullName}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};

UserInfo.propTypes = {
  avatarUrl: PropTypes.string,
  fullName: PropTypes.string.isRequired,
  additionalText: PropTypes.string,
};

UserInfo.defaultProps = {
  avatarUrl: '/noavatar.png',
  additionalText: '',
};
