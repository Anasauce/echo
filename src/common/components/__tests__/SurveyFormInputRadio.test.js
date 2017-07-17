/* eslint-env mocha */
/* global testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import React from 'react'
import {mount} from 'enzyme'
import {assert} from 'chai'

import SurveyFormInputRadio from 'src/common/components/SurveyFormInputRadio'

describe(testContext(__filename), function () {
  let changed = false
  let changedValue = null

  const props = {
    name: 'mahRadioInput',
    options: [
      {value: 100, label: 'hmkay, #1'},
      {value: 200, label: 'hrmkay, #2'},
    ],
    value: 100,
    onChange: value => {
      changed = true
      changedValue = value
    },
  }

  const root = mount(<SurveyFormInputRadio {...props}/>)
  const radioButtons = root.find('ThemedRadioButton')

  describe('props.options', function () {
    it('renders as many radio buttons as provided options', function () {
      assert.equal(radioButtons.length, props.options.length)
    })
  })

  describe('props.options[n]', function () {
    it('passes the option.value, option.label props to child radio buttons', function () {
      props.options.forEach(function (option, i) {
        const optionButton = radioButtons.at(i)
        const buttonProps = optionButton.props()

        assert.equal(buttonProps.label, option.label, 'Option label not passed to child radio button')
        assert.equal(buttonProps.value, option.value, 'Option value not passed to child radio button')
      })
    })
  })

  describe('props.value', function () {
    const selectedButton = radioButtons.findWhere(node => node.prop('checked')).at(0)

    it('selects the radio button for the option with the value matching the provided value', function () {
      assert.equal(selectedButton.props().value, props.value)
    })
  })

  describe('props.onChange', function () {
    const secondButton = radioButtons.at(1)
    const secondButtonProps = secondButton.props()
    const secondButtonInput = secondButton.findWhere(node => node.name() === 'input')

    secondButtonInput.simulate('click')

    it('invokes the provided callback, passing the value for a selected option', function () {
      assert.isTrue(changed, 'The onChange handler was not called')
      assert.equal(changedValue, secondButtonProps.value, 'Value for selected radio button not passed in onChange callback')
    })
  })
})
