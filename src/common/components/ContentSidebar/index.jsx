import React, {PropTypes} from 'react'

import {safeUrl} from 'src/common/util'

import styles from './index.scss'

function ContentSidebar(props) {
  let headerImage = (
    <img className={styles.image} src={props.imageUrl}/>
  )
  if (props.imageLinkUrl) {
    headerImage = (
      <a href={safeUrl(props.imageLinkUrl)}>{headerImage}</a>
    )
  }

  const header = (
    <div className={styles.header}>
      {headerImage}
      <div className={styles.title} title={props.titleTooltip}>
        <h5>{props.title}</h5>
      </div>
      <div className={styles.subtitle}>
        {props.subtitle}
      </div>
    </div>
  )

  return (
    <div className={styles.sidebar}>
      {header}
      {props.children}
    </div>
  )
}

ContentSidebar.propTypes = {
  imageUrl: PropTypes.string,
  imageLinkUrl: PropTypes.string,
  title: PropTypes.any,
  titleTooltip: PropTypes.any,
  subtitle: PropTypes.any,
  children: PropTypes.any,
}

export default ContentSidebar
