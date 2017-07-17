import React, {Component} from 'react'
import {CardTitle, CardText} from 'react-toolbox/lib/card'
import Helmet from 'react-helmet'

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Whoopsie.</title>
        </Helmet>
        <CardTitle
          avatar="https://brand.learnersguild.org/apple-touch-icon-60x60.png"
          title="Not Found"
          />
        <CardText>Womp womp. The requested page was not found.</CardText>
      </div>
    )
  }
}
