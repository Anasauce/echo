import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'

import InviteCodeForm from 'src/common/components/InviteCodeForm'
import {inviteCodeSchema, asyncValidate} from 'src/common/validations'

const FORM_NAME = 'inviteCode'

function transformValidationInput(values) {
  return Object.assign({}, values, {roles: values.roles.split(/\W+/)})
}

function mapStateToProps(state, props) {
  return {
    initialValues: {chapterId: props.chapterId, roles: 'member'},
    isActive: props.isActive,
    onSave: props.onSave,
    onCancel: props.onCancel,
  }
}

const formOptions = {
  form: FORM_NAME,
  asyncBlurFields: ['code', 'description', 'roles'],
  asyncValidate: asyncValidate(inviteCodeSchema, {
    abortEarly: false,
    transform: transformValidationInput,
  }),
}

export default connect(mapStateToProps)(reduxForm(formOptions)(InviteCodeForm))
