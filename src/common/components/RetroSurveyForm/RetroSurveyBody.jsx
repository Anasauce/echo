import React, {PropTypes} from 'react'
import SurveyForm from 'src/common/components/SurveyForm'
import RetroSurveyConfirmation from './RetroSurveyConfirmation'

export default function RetroSurveyBody(props) {
  const {
    formName,
    surveyFields,
    handleSubmit,
    isBusy,
    submitting,
    invalid,
    surveyGroupIndex,
    onClickSubmit,
    onClickConfirm,
    onClickBack,
  } = props

  if (!isBusy && (!surveyFields || surveyFields.length === 0)) {
    return (
      <SurveyForm
        name={formName}
        title={((surveyFields || [])[0] || {}).title}
        content={<RetroSurveyConfirmation/>}
        onSubmit={onClickSubmit}
        submitLabel="Confirm"
        submitDisabled={submitting}
        onClickSubmit={onClickConfirm}
        showBackButton={surveyGroupIndex > 0}
        backLabel="Back"
        backDisabled={submitting}
        onClickBack={onClickBack}
        handleSubmit={handleSubmit}
        />
    )
  }

  return (
    <SurveyForm
      name={formName}
      title={((surveyFields || [])[0] || {}).title}
      fields={surveyFields}
      submitLabel="Next"
      submitDisabled={isBusy}
      onClickSubmit={onClickSubmit}
      showBackButton={surveyGroupIndex > 0}
      backLabel="Back"
      backDisabled={isBusy}
      onClickBack={onClickBack}
      invalid={invalid}
      submitting={submitting}
      handleSubmit={handleSubmit}
      />
  )
}

RetroSurveyBody.propTypes = {
  formName: PropTypes.string,
  surveyFields: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  isBusy: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
  surveyGroupIndex: PropTypes.number,
  onClickSubmit: PropTypes.func.isRequired,
  onClickConfirm: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
}
