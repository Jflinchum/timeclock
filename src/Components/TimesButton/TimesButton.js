import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TimesButton extends Component {

  render() {
    if (this.props.show) {
      return (
        <div>
          <button className="controlButton" onClick={this.props.onSubmit}>
            {this.props.name}
          </button>
        </div>
      );
    } else {
      return null;
    }
  }
}

TimesButton.propTypes = {
  name: PropTypes.string,
  onSubmit: PropTypes.func,
  show: PropTypes.bool
}

export default TimesButton;
