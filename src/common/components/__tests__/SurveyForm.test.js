/* eslint-env mocha */
/* global testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

/**
 * FIXME: Temporarily disabling tests that require a full mount due to:
 * https://github.com/erikras/redux-form/issues/849
 */
import React from 'react'
import {shallow, mount} from 'enzyme'
import {assert} from 'chai'

import SurveyForm from 'src/common/components/SurveyForm'

describe(testContext(__filename), function () {
  describe('props.title', function () {
    it('title is rendered', function () {
      const props = getProps({title: 'look at mah title'})
      const root = shallow(<SurveyForm {...props}/>)
      assert.isTrue(root.html().includes(props.title))
    })
  })

  describe.skip('props.fields[n].type: TEXT', function () {
    before(function () {
      const radioField = getField('TEXT')
      this.props = getProps({fields: [radioField]})
      this.root = mount(<SurveyForm {...this.props}/>)
      this.textInput = root.find('SurveyFormInputText')
    })

    it('renders a <SurveyFormInputText> element', function () {
      assert.equal(this.textInput.length, 1)
    })

    it('passes all expected props to <SurveyFormInputText>', function () {
      const originalProps = this.props.fields[0]
      const passedProps = this.textInput.props()
      const expectedProps = ['name', 'hint', 'value']

      _checkProps(originalProps, passedProps, expectedProps)
    })
  })

  describe.skip('props.fields[n].type: RADIO', function () {
    before(function () {
      const textField = getField('RADIO')
      this.props = getProps({fields: [textField]})
      this.root = mount(<SurveyForm {...this.props}/>)
      this.radioInput = root.find('SurveyFormInputRadio')
    })

    it('renders a <SurveyFormInputRadio> element', function () {
      assert.equal(this.radioInput.length, 1)
    })

    it('passes all expected props to <SurveyFormInputRadio>', function () {
      const originalProps = this.props.fields[0]
      const passedProps = this.radioInput.props()
      const expectedProps = ['name', 'options', 'value']

      _checkProps(originalProps, passedProps, expectedProps)
    })
  })

  describe.skip('props.fields[n].type: NUMERIC', function () {
    before(function () {
      const textField = getField('NUMERIC')
      this.props = getProps({fields: [textField]})
      this.root = mount(<SurveyForm {...this.props}/>)
      this.numericInput = root.find('SurveyFormInputNumeric')
    })

    it('renders a <SurveyFormInputNumeric> element', function () {
      assert.equal(this.numericInput.length, 1)
    })

    it('passes all expected props to <SurveyFormInputNumeric>', function () {
      const originalProps = this.props.fields[0]
      const passedProps = this.numericInput.props()
      const expectedProps = ['name', 'hint', 'value']

      _checkProps(originalProps, passedProps, expectedProps)
    })
  })

  describe.skip('props.fields[n].type: SLIDER_GROUP', function () {
    before(function () {
      const sliderGroupField = getField('SLIDER_GROUP')
      this.props = getProps({fields: [sliderGroupField]})
      this.root = mount(<SurveyForm {...this.props}/>)
      this.sliderGroupInput = root.find('SurveyFormInputSliderGroup')
    })

    it('renders a <SurveyFormInputSliderGroup> element', function () {
      assert.equal(this.sliderGroupInput.length, 1)
    })

    it('passes all expected props to <SurveyFormInputSliderGroup>', function () {
      const originalProps = this.props.fields[0]
      const passedProps = this.sliderGroupInput.props()
      const expectedProps = ['name', 'hint', 'sum', 'options', 'value']

      _checkProps(originalProps, passedProps, expectedProps)
    })
  })

  describe('props.submitLabel', function () {
    it('is displayed', function () {
      const props = getProps({submitLabel: 'Submit This Thang'})
      const root = shallow(<SurveyForm {...props}/>)
      assert.isTrue(root.html().includes(props.submitLabel))
    })
  })

  describe.skip('props.onSave', function () {
    it('is called when the submit button is clicked', function () {
      let submitted = false
      const onSave = () => {
        submitted = true
      }

      const props = getProps({onSave})
      const root = mount(<SurveyForm {...props}/>)
      const submitButton = findSubmitButton(root)

      submitButton.simulate('click')

      assert.isTrue(submitted)
    })
  })

  describe.skip('props.disabled', function () {
    it('disables the submit button when true', function () {
      const props = getProps({disabled: true})
      const root = mount(<SurveyForm {...props}/>)
      const submitButton = findSubmitButton(root)

      assert.isTrue(submitButton.props().disabled)
    })
  })
})

function getProps(props) {
  return Object.assign({}, {
    title: undefined,
    fields: [],
    onClose: undefined,
    submitLabel: undefined,
    disabled: undefined,
    invalid: undefined,
    submitting: undefined,
    onSave: undefined,
    handleSubmit: submit => submit,
  }, props || {})
}

function getField(type) {
  switch (type) {
    case 'TEXT':
      return {
        type: 'TEXT',
        name: 'text name',
        hint: 'text hint',
        value: 'text value',
      }
    case 'NUMERIC':
      return {
        type: 'NUMERIC',
        name: 'text name',
        hint: 'text hint',
        value: 99,
      }
    case 'RADIO':
      return {
        type: 'RADIO',
        name: 'radio name',
        options: [],
        value: 50,
      }
    case 'SLIDER_GROUP':
      return {
        type: 'SLIDER_GROUP',
        name: 'slidergrp name',
        hint: 'slidergrp hint',
        sum: 100,
        options: [],
        value: [],
      }
    default:
      return null
  }
}

function findSubmitButton(wrapper) {
  return wrapper.findWhere(node => {
    return node.name() === 'Button' && node.props().type === 'submit'
  }).first()
}

function _checkProps(originalProps, passedProps, expectedProps) {
  expectedProps.forEach(expectedProp => {
    assert.isTrue(typeof originalProps[expectedProp] !== 'undefined', `Invalid assertion for prop ${expectedProp}`)
    assert.isTrue(passedProps[expectedProp] === originalProps[expectedProp], `Did not pass prop ${expectedProp}`)
  })
}
