import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import ProjectList from 'src/common/components/ProjectList'
import {showLoad, hideLoad} from 'src/common/actions/app'
import {findProjects} from 'src/common/actions/project'
import {findUsers} from 'src/common/actions/user'
import {findPhases} from 'src/common/actions/phase'
import {userCan} from 'src/common/util'

class ProjectListContainer extends Component {
  constructor(props) {
    super(props)
    this.handleClickImport = this.handleClickImport.bind(this)
    this.handleSelectRow = this.handleSelectRow.bind(this)
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

  handleClickImport() {
    this.props.navigate('/projects/new')
  }

  handleSelectRow(row) {
    this.props.navigate(`/projects/${this.props.projects[row].name}`)
  }

  render() {
    const {isBusy, currentUser, projects} = this.props
    return isBusy ? null : (
      <ProjectList
        projects={projects}
        allowSelect={userCan(currentUser, 'viewProject')}
        allowImport={userCan(currentUser, 'importProject')}
        onSelectRow={this.handleSelectRow}
        onClickImport={this.handleClickImport}
        onLoadMoreClicked={this.props.handleLoadMore}
        />
    )
  }
}

ProjectListContainer.propTypes = {
  projects: PropTypes.array.isRequired,
  oldestCycleLoadedId: PropTypes.string,
  isBusy: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  handleLoadMore: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  showLoad: PropTypes.func.isRequired,
  hideLoad: PropTypes.func.isRequired,
}

ProjectListContainer.fetchData = fetchData

function fetchData(dispatch) {
  dispatch(findUsers())
  dispatch(findPhases())
  dispatch(findProjects())
}

function mapStateToProps(state) {
  const {app, auth, projects, users, phases} = state
  const {projects: projectsById} = projects
  const {users: usersById} = users
  const {phases: phasesById} = phases

  const expandedProjects = Object.values(projectsById).map(project => {
    return {
      ...project,
      phase: phasesById[project.phaseId],
      members: (project.memberIds || []).map(userId => (usersById[userId] || {})),
    }
  })

  // sort by cycle, title, name
  const projectList = expandedProjects.sort((p1, p2) => {
    return (((p2.cycle || {}).cycleNumber || 0) - ((p1.cycle || {}).cycleNumber || 0)) ||
      (((p1.goal || {}).title || '').localeCompare((p2.goal || {}).title || '')) ||
      p1.name.localeCompare(p2.name)
  })

  const oldestCycleLoadedId =
    projectList.length > 0 ? projectList[projectList.length - 1].cycle.id : null

  return {
    isBusy: projects.isBusy || users.isBusy,
    loading: app.showLoading,
    currentUser: auth.currentUser,
    oldestCycleLoadedId,
    projects: projectList,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    navigate: path => dispatch(push(path)),
    showLoad: () => dispatch(showLoad()),
    hideLoad: () => dispatch(hideLoad()),
    handleLoadMore: props => {
      return () => dispatch(findProjects({page: {
        cycleId: props.oldestCycleLoadedId,
        direction: 'prev',
      }}))
    },
    fetchData: props => {
      return () => fetchData(dispatch, props)
    },
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const stateAndOwnProps = {...stateProps, ...ownProps}
  return {
    ...dispatchProps,
    ...stateAndOwnProps,
    fetchData: dispatchProps.fetchData(stateAndOwnProps),
    handleLoadMore: dispatchProps.handleLoadMore(stateAndOwnProps),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProjectListContainer)
