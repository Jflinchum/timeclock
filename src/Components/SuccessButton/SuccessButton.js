import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SuccessButton extends Component {

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

SuccessButton.propTypes = {
  name: PropTypes.string,
  onSubmit: PropTypes.func,
  show: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ])
}

export default SuccessButton;
