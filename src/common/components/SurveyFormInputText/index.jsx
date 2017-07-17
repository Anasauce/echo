import React, {PropTypes} from 'react'
import Input from 'react-toolbox/lib/input'

class SurveyFormInputText extends React.Component {
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
        <Input
          type="text"
          name={this.props.name}
          hint={this.props.hint}
          value={this.props.value || ''}
          onChange={this.handleUpdate}
          multiline
          floating
          />
      </section>
    )
  }
}

SurveyFormInputText.propTypes = {
  name: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
}

export default SurveyFormInputText
