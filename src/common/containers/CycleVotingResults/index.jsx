import React, {Component, PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import socketCluster from 'socketcluster-client'

import {showLoad, hideLoad} from 'src/common/actions/app'
import CycleVotingResults, {cycleVotingResultsPropType} from 'src/common/components/CycleVotingResults'
import {getCycleVotingResults, receivedCycleVotingResults} from 'src/common/actions/cycle'

class CycleVotingResultsContainer extends Component {
  constructor() {
    super()
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
    this.props.showLoad()
    this.props.fetchData()
    this.subscribeToCycleVotingResults(this.currentCycleId())
  }

  componentWillUnmount() {
    this.unsubscribeFromCycleVotingResults(this.currentCycleId())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cycle && nextProps.loading) {
      this.props.hideLoad()
    }

    const newCycleId = nextProps.cycle && nextProps.cycle.id
    const oldCycleId = this.currentCycleId()

    if (!newCycleId) {
      this.unsubscribeFromCycleVotingResults(oldCycleId)
    } else if (oldCycleId !== newCycleId) {
      this.subscribeToCycleVotingResults(newCycleId)
    }
  }

  currentCycleId() {
    return this.props.cycle && this.props.cycle.id
  }

  subscribeToCycleVotingResults(cycleId) {
    if (cycleId) {
      console.log(`subscribing to voting results for cycle ${cycleId} ...`)
      this.socket = socketCluster.connect()
      this.socket.on('connect', () => console.log('... socket connected'))
      this.socket.on('disconnect', () => console.log('socket disconnected, will try to reconnect socket ...'))
      this.socket.on('connectAbort', () => null)
      this.socket.on('error', error => console.warn(error.message))
      const cycleVotingResultsChannel = this.socket.subscribe(`cycleVotingResults-${cycleId}`)
      cycleVotingResultsChannel.watch(cycleVotingResults => {
        this.props.receivedCycleVotingResults(cycleVotingResults)
      })
    }
  }

  unsubscribeFromCycleVotingResults(cycleId) {
    if (this.socket && cycleId) {
      console.log(`unsubscribing from voting results for cycle ${cycleId} ...`)
      this.socket.unwatch(`cycleVotingResults-${cycleId}`)
      this.socket.unsubscribe(`cycleVotingResults-${cycleId}`)
    }
  }

  handleClose() {
    this.props.navigate('/')

    /* global window */
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage('closeCycleVotingResults', '*')
    }
  }

  render() {
    if (!this.props.cycle && this.props.isBusy) {
      return null
    }
    return <CycleVotingResults onClose={this.handleClose} {...this.props}/>
  }
}

CycleVotingResultsContainer.propTypes = Object.assign({}, cycleVotingResultsPropType, {
  isBusy: PropTypes.bool,
  cycle: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  showLoad: PropTypes.func.isRequired,
  hideLoad: PropTypes.func.isRequired,
})

CycleVotingResultsContainer.fetchData = fetchData

function fetchData(dispatch) {
  dispatch(getCycleVotingResults({withUsers: true}))
}

function addUserDataToPools(pools, allUsers) {
  pools.forEach(pool => {
    const userDatas = pool.users.map(({id}) => allUsers[id]).filter(user => Boolean(user))
    pool.users = userDatas
  })
}

function mapStateToProps(state) {
  const {
    app,
    auth: {currentUser},
    cycles,
    chapters,
    users,
    cycleVotingResults: cvResults,
  } = state
  const isBusy = cycles.isBusy || chapters.isBusy || cvResults.isBusy || users.isBusy
  // this part of the state is a singleton, which is why this looks weird
  const cycleVotingResults = cvResults.cycleVotingResults.CURRENT
  let cycle
  let chapter
  let pools = []
  if (cycleVotingResults && !isBusy) {
    cycle = cycles.cycles[cycleVotingResults.cycle]
    chapter = cycle ? chapters.chapters[cycle.chapter] : null
    pools = cycleVotingResults.pools.map(pool => ({...pool})) // deep copy so we don't mutate state
    addUserDataToPools(pools, users.users)
  }

  return {
    loading: app.showLoading,
    currentUser,
    isBusy,
    chapter,
    cycle,
    pools,
    goalLibraryURL: process.env.GOAL_LIBRARY_BASE_URL,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: () => fetchData(dispatch),
    navigate: path => dispatch(push(path)),
    showLoad: () => dispatch(showLoad()),
    hideLoad: () => dispatch(hideLoad()),
    receivedCycleVotingResults: results => dispatch(receivedCycleVotingResults(results)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CycleVotingResultsContainer)
