import React from 'react'
import styles from './index.scss'

export default function NoPendingRetros() {
  return (
    <div className={styles.empty}>
      <h6>Hooray! You have no pending retrospectives.</h6>
    </div>
  )
}
