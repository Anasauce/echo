/* eslint-disable react/jsx-handler-names */
import React, {Component, PropTypes} from 'react'
import Button from 'react-toolbox/lib/button'
import {Field} from 'redux-form'
import Helmet from 'react-helmet'

import ContentHeader from 'src/common/components/ContentHeader'
import NotFound from 'src/common/components/NotFound'
import {Flex} from 'src/common/components/Layout'
import {FORM_TYPES, renderDropdown} from 'src/common/util/form'

import styles from './index.scss'

class UserForm extends Component {
  render() {
    const {
      pristine,
      handleSubmit,
      submitting,
      invalid,
      formType,
      onSave,
      user,
      phaseSelectOptions,
      preventOnBlur
    } = this.props

    if (formType === FORM_TYPES.NOT_FOUND) {
      return <NotFound/>
    }

    const submitDisabled = Boolean(pristine || submitting || invalid)
    const title = `Edit User: ${user.handle}`

    return (
      <Flex column>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <ContentHeader title={title}/>
        <form id="user" onSubmit={handleSubmit(onSave)}>
          <Field name="id" type="hidden" component="hidden"/>
          <Field
            name="phaseNumber"
            type="number"
            icon="trending_up"
            label="Phase Number"
            hint={'e.g. "2"'}
            source={phaseSelectOptions}
            auto
            component={renderDropdown}
            onBlur={preventOnBlur}
            />
          <Flex className={styles.footer} justifyContent="space-between">
            <Button
              type="submit"
              label="Save"
              disabled={submitDisabled}
              primary
              raised
              />
          </Flex>
        </form>
      </Flex>
    )
  }
}

UserForm.propTypes = {
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  formType: PropTypes.oneOf(Object.values(FORM_TYPES)).isRequired,
  onSave: PropTypes.func.isRequired,
  user: PropTypes.object,
  phaseSelectOptions: PropTypes.array,
  preventOnBlur: PropTypes.func,
}

export default UserForm
