import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {showLoad, hideLoad} from 'src/common/actions/app'
import {unlockSurvey, lockSurvey, getProjectSummary} from 'src/common/actions/project'
import ProjectDetail from 'src/common/components/ProjectDetail'
import {userCan} from 'src/common/util'

class ProjectDetailContainer extends Component {
  constructor(props) {
    super(props)
    this.handleClickEdit = this.handleClickEdit.bind(this)
  }

  componentDidMount() {
    this.props.showLoad()
    this.props.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isBusy && nextProps.loading) {
      this.props.hideLoad()
    }
  }

  handleClickEdit() {
    if (!this.props.project) {
      return
    }
    this.props.navigate(`/projects/${this.props.project.name}/edit`)
  }

  render() {
    const {
      currentUser,
      isBusy,
      isLockingOrUnlocking,
      project,
      projectUserSummaries,
      unlockPlayerSurvey,
      lockPlayerSurvey,
    } = this.props

    return isBusy ? null : (
      <ProjectDetail
        project={project}
        projectUserSummaries={projectUserSummaries}
        allowEdit={userCan(currentUser, 'importProject')}
        onClickEdit={this.handleClickEdit}
        isLockingOrUnlocking={isLockingOrUnlocking}
        unlockPlayerSurvey={unlockPlayerSurvey}
        lockPlayerSurvey={lockPlayerSurvey}
        />
    )
  }
}

ProjectDetailContainer.propTypes = {
  project: PropTypes.object,
  projectUserSummaries: PropTypes.array,
  isBusy: PropTypes.bool.isRequired,
  isLockingOrUnlocking: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  showLoad: PropTypes.func.isRequired,
  hideLoad: PropTypes.func.isRequired,
  unlockPlayerSurvey: PropTypes.func.isRequired,
  lockPlayerSurvey: PropTypes.func.isRequired,
}

ProjectDetailContainer.unlockPlayerSurvey = unlockSurvey
ProjectDetailContainer.lockPlayerSurvey = lockSurvey
ProjectDetailContainer.fetchData = fetchData

function fetchData(dispatch, props) {
  dispatch(getProjectSummary(props.params.identifier))
}

function mapStateToProps(state, ownProps) {
  const {identifier} = ownProps.params
  const {app, auth, projectSummaries} = state
  const {isLockingOrUnlocking, projectSummaries: projectSummariesByProjectId} = projectSummaries

  const projectSummary = Object.values(projectSummariesByProjectId).find(projectSummary => {
    return projectSummary.project && (
      projectSummary.project.name === identifier ||
        projectSummary.project.id === identifier
    )
  }) || {}

  return {
    project: projectSummary.project,
    projectUserSummaries: projectSummary.projectUserSummaries,
    isBusy: projectSummaries.isBusy,
    isLockingOrUnlocking,
    loading: app.showLoading,
    currentUser: auth.currentUser,
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    fetchData: () => fetchData(dispatch, props),
    navigate: path => dispatch(push(path)),
    showLoad: () => dispatch(showLoad()),
    hideLoad: () => dispatch(hideLoad()),
    unlockPlayerSurvey: (playerId, projectId) => dispatch(unlockSurvey(playerId, projectId)),
    lockPlayerSurvey: (playerId, projectId) => dispatch(lockSurvey(playerId, projectId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetailContainer)
