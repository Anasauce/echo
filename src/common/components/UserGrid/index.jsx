import React, {Component, PropTypes} from 'react'

import styles from './index.css'

export default class UserGrid extends Component {
  render() {
    const {users, activeUserIds} = this.props
    const isReady = users && users.length > 0

    if (!isReady) {
      return <span/>
    }

    const inactiveUserIds = users
      .filter(user => !activeUserIds.includes(user.id))
      .map(user => user.id)

    const _imagesForUserIds = (userIds, active = true, baseKey = 0) => {
      const classNames = active ?
        styles.userImage :
        `${styles.userImage} ${styles.inactiveUserImage}`

      return userIds.map((userId, i) => {
        const user = users.find(user => user.id === userId)
        const altTitle = `${user.name} (${user.handle})`
        return (
          <img
            key={baseKey + i}
            className={classNames}
            src={user.avatarUrl}
            alt={altTitle}
            title={altTitle}
            />
        )
      })
    }

    const userImages = _imagesForUserIds(activeUserIds)
      .concat(_imagesForUserIds(inactiveUserIds, false, activeUserIds.length))

    return (
      <div className={styles.userGrid}>
        {userImages}
      </div>
    )
  }
}

UserGrid.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    handle: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  })).isRequired,
  activeUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
}
