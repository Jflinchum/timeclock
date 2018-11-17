import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Times.css';

class Times extends Component {
  constructor(props) {
    super(props);
    this.state = {
      times: []
    };
  }

  componentDidMount() {
    this.getTimes();
  }

  getTimes = () => {
    const uid = this.props.uid;
    fetch(`http://localhost:4000/times?user=${uid}`)
      .then(response => response.json())
      .then(response => this.setState({ times: response }))
      .catch(err => console.log(err));
  };

  renderTimes = ({ time, record, start }, i) => {
    return (
      <div key={i}>
        <div>{time}</div>
        <div>{record}</div>
        <div>{start}</div>
      </div>
    )
  };

  render() {
    const { times } = this.state;
    return (
      <div>
        {times.map(this.renderTimes)}
      </div>
    )
  }
}

Times.propTypes = {
  uid: PropTypes.string
}

export default Times;
