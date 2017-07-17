import React, {Component, PropTypes} from 'react'

class Iframe extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.url !== nextProps.url
  }

  render() {
    return (
      <iframe
        src={this.props.url}
        height={this.props.height || '100%'}
        width={this.props.width || '100%'}
        frameBorder="0"
        />
    )
  }
}

Iframe.propTypes = {
  url: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
}

export default Iframe
