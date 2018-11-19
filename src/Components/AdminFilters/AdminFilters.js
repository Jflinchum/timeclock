import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { API_URL } from '../../config';

class AdminFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      badUID: false,
    }
    this.handleUIDChange = this.handleUIDChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUIDChange(event) {
    this.setState({ uid: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { uid } = this.state;

    // First authorize the user id submitted
    fetch(`${API_URL}authorize?uid=${uid}`)
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          // Call the onSubmit function with the user id
          this.props.onSubmit({ uid });
        } else {
          // If the user id does not exist, show the bad login message
          this.setState({ badUID: true });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <p className="formTitle"> Admin Filters: </p>
        <form id="registerForm" onSubmit={this.handleSubmit}>
          <div className="formElementContainer">
            <label htmlFor="registerUID"> Username: </label>
            <input required type="text" id="registerUID" onChange={this.handleUIDChange}/>
          </div>
          <div className="formElementContainer">
            <button type="submit">Filter</button>
          </div>
        </form>
        {
          this.state.badUID ?
          <p className="errorMessage"> No UID exists with that name </p>
          : null
        }
      </div>
    );
  }
}

AdminFilters.propTypes = {
  onSubmit: PropTypes.func
}

export default AdminFilters;
