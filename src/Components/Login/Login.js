import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { API_URL } from '../../config';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      badLogin: false,
    }
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLoginChange(event) {
    this.setState({ login: event.target.value });
  }

  handleLogin(event) {
    event.preventDefault();
    const uid = this.state.login;

    // First authorize the user id submitted
    fetch(`${API_URL}authorize?uid=${uid}`)
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          // Call the onSubmit function with the user id
          this.props.onSubmit({ uid, admin: response[0].admin });
        } else {
          // If the user id does not exist, show the bad login message
          this.setState({ badLogin: true });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
      <p className="formTitle"> Login: </p>
      <form id="loginForm" onSubmit={this.handleLogin}>
        <div className="formElementContainer">
          <label htmlFor="loginUID"> Username: </label>
          <input required type="text" id="loginUID" onChange={this.handleLoginChange}/>
        </div>
        <div className="formElementContainer">
          <button type="submit"> Log In </button>
        </div>
      </form>
      {
        this.state.badLogin ?
        <p className="errorMessage"> No UID exists with that name </p>
        : null
      }
      </div>
    );
  }
}

Login.propTypes = {
  onSubmit: PropTypes.func
}

export default Login;
