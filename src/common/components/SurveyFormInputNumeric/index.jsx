import React, {PropTypes} from 'react'
import Input from 'react-toolbox/lib/input'

import {valueInt} from 'src/common/util/survey'

class SurveyFormInputNumeric extends React.Component {
  constructor(props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleWheel = this.handleWheel.bind(this)
  }

  handleUpdate(value) {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handleWheel(event) {
    if (event) {
      // prevent changing numbers when the mouse scrolls over the input
      event.target.blur()
    }
  }

  render() {
    return (
      <section>
        <Input
          type="number"
          name={this.props.name}
          hint={this.props.hint}
          value={valueInt(this.props.value) || this.props.value}
          onChange={this.handleUpdate}
          onWheel={this.handleWheel}
          floating
          />
      </section>
    )
  }
}

SurveyFormInputNumeric.propTypes = {
  name: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
}

export default SurveyFormInputNumeric
