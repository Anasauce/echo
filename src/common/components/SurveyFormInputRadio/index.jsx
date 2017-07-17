import React, {PropTypes} from 'react'
import {RadioGroup, RadioButton} from 'react-toolbox/lib/radio'

class SurveyFormInputRadio extends React.Component {
  constructor(props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  handleUpdate(value) {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  render() {
    return (
      <section>
        <RadioGroup name={this.props.name} value={parseInt(this.props.value, 10)} onChange={this.handleUpdate}>
          {(this.props.options || []).map((option, i) => (
            <RadioButton
              key={i}
              name={`${this.props.name}-${i}`}
              label={option.label}
              value={option.value}
              />
          ))}
        </RadioGroup>
      </section>
    )
  }
}

SurveyFormInputRadio.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  value: PropTypes.any,
  onChange: PropTypes.func,
}

export default SurveyFormInputRadio
