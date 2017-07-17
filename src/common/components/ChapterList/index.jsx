import React, {Component, PropTypes} from 'react'
import Helmet from 'react-helmet'

import ContentHeader from 'src/common/components/ContentHeader'
import ContentTable from 'src/common/components/ContentTable'

const ChapterModel = {
  name: {type: String},
  channelName: {title: 'Channel', type: String},
  cycleNumber: {title: 'Cycle', type: Number},
  cycleState: {title: 'State', type: String},
  activeProjectCount: {title: 'Active Projects', type: Number},
  activeMemberCount: {title: 'Active Members', type: Number},
}

export default class ChapterList extends Component {
  render() {
    const {chapters, allowCreate, allowSelect, onClickCreate, onSelectRow} = this.props
    const chapterData = (chapters || []).map(chapter => {
      const cycle = chapter.latestCycle || {}
      return {
        name: chapter.name,
        channelName: chapter.channelName,
        activeProjectCount: chapter.activeProjectCount || '--',
        activeMemberCount: chapter.activeMemberCount || '--',
        cycleNumber: cycle.cycleNumber,
        cycleState: cycle.state,
      }
    })
    const header = (
      <ContentHeader
        title="Chapters"
        buttonIcon={allowCreate ? 'add_circle' : null}
        onClickButton={allowCreate ? onClickCreate : null}
        />
    )
    const content = chapterData.length > 0 ? (
      <ContentTable
        model={ChapterModel}
        source={chapterData}
        allowSelect={allowSelect}
        onSelectRow={onSelectRow}
        />
    ) : (
      <div>No chapters yet.</div>
    )
    return (
      <div>
        <Helmet>
          <title>Chapters</title>
        </Helmet>
        {header}
        {content}
      </div>
    )
  }
}

ChapterList.propTypes = {
  allowCreate: PropTypes.bool,
  allowSelect: PropTypes.bool,
  chapters: PropTypes.array,
  onClickCreate: PropTypes.func,
  onSelectRow: PropTypes.func,
}
