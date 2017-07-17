import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {reduxForm, reset, getFormValues} from 'redux-form'
import moment from 'moment-timezone'

import {showLoad, hideLoad} from 'src/common/actions/app'
import ChapterForm from 'src/common/components/ChapterForm'
import NotFound from 'src/common/components/NotFound'
import {chapterSchema, asyncValidate} from 'src/common/validations'
import {getChapter, saveChapter, addInviteCodeToChapter} from 'src/common/actions/chapter'

const FORM_NAMES = {
  CHAPTER: 'chapter',
  INVITE_CODE: 'inviteCode',
}

class ChapterFormContainer extends Component {
  componentDidMount() {
    this.props.showLoad()
    this.props.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isBusy && nextProps.loading) {
      this.props.hideLoad()
    }
  }

  render() {
    if (this.props.identifier && !this.props.chapter) {
      return this.props.isBusy ? null : <NotFound/>
    }
    return (
      <ChapterForm {...this.props}/>
    )
  }
}

ChapterFormContainer.propTypes = {
  identifier: PropTypes.string,
  chapter: PropTypes.object,
  isBusy: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  showLoad: PropTypes.func.isRequired,
  hideLoad: PropTypes.func.isRequired,
}

ChapterFormContainer.fetchData = fetchData

function fetchData(dispatch, props) {
  if (props.params.identifier) {
    dispatch(getChapter(props.params.identifier))
  }
}

function handleSaveChapter(dispatch) {
  return values => {
    return dispatch(saveChapter(values))
  }
}

function handleSaveInviteCode(dispatch) {
  return values => {
    const {chapterId, code, description, roles} = values
    const inviteCode = {code, description, roles: roles.split(/\W+/)}
    dispatch(reset(FORM_NAMES.INVITE_CODE))
    return dispatch(addInviteCodeToChapter(chapterId, inviteCode))
  }
}

function mapStateToProps(state, props) {
  const {identifier} = props.params
  const {isBusy, chapters} = state.chapters

  const chapter = chapters[identifier] || Object.values(chapters).find(c => c.name === identifier)
  const inviteCodes = chapter && chapter.inviteCodes
  const sortedInviteCodes = (inviteCodes || []).sort()
  const timezone = (chapter || {}).timezone || moment.tz.guess()
  const initialValues = Object.assign({timezone}, chapter)

  let title = 'Create Chapter'
  let showCreateInviteCode = false
  if (identifier) {
    let chapterName
    if (chapter) {
      chapterName = ` ${chapter.name} `
      showCreateInviteCode = true
    }
    title = `Edit${chapterName || ' '}Chapter`
  }

  return {
    isBusy,
    chapter,
    identifier,
    title,
    showCreateInviteCode,
    initialValues,
    loading: state.app.showLoading,
    inviteCodes: sortedInviteCodes,
    formValues: getFormValues(FORM_NAMES.CHAPTER)(state) || {},
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    onSaveChapter: handleSaveChapter(dispatch),
    onSaveInviteCode: handleSaveInviteCode(dispatch),
    fetchData: () => fetchData(dispatch, props),
    showLoad: () => dispatch(showLoad()),
    hideLoad: () => dispatch(hideLoad()),
  }
}

const formOptions = {
  form: FORM_NAMES.CHAPTER,
  enableReinitialize: true,
  asyncBlurFields: ['name', 'channelName', 'timezone'],
  asyncValidate: asyncValidate(chapterSchema, {abortEarly: false}),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm(formOptions)(ChapterFormContainer))
