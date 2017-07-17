import React, {Component, PropTypes} from 'react'
import Helmet from 'react-helmet'

import ContentHeader from 'src/common/components/ContentHeader'
import ContentTable from 'src/common/components/ContentTable'

const UserModel = {
  handle: {type: String},
  name: {type: String},
  chapterName: {title: 'Chapter', type: String},
  phaseNumber: {title: 'Phase', type: Number},
  email: {type: String},
  active: {type: String},
}

export default class UserList extends Component {
  render() {
    const {users, allowSelect, onSelectRow} = this.props
    const rows = users.map(user => Object.assign({}, user, {
      chapterName: (user.chapter || {}).name,
      phaseNumber: ((user || {}).phase || {}).number,
      active: user.active ? 'Yes' : 'No',
    }))
    const content = rows.length > 0 ? (
      <ContentTable
        model={UserModel}
        source={rows}
        allowSelect={allowSelect}
        onSelectRow={onSelectRow}
        />
    ) : (
      <div>No user yet.</div>
    )

    return (
      <div>
        <Helmet>
          <title>Users</title>
        </Helmet>
        <ContentHeader title="Users"/>
        {content}
      </div>
    )
  }
}

UserList.propTypes = {
  allowSelect: PropTypes.bool,
  onSelectRow: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    email: PropTypes.string,
    active: PropTypes.bool,
    chapter: PropTypes.shape({
      name: PropTypes.string,
    }),
    phase: PropTypes.shape({
      number: PropTypes.integer,
    }),
  })),
}
