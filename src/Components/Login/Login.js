import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    this.setState({login: event.target.value});
  }

  handleLogin(event) {
    event.preventDefault();
    const uid = this.state.login;

    // First authorize the user id submitted
    fetch(`http://localhost:4000/authorize?uid=${uid}`)
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          // Call the onSubmit function with the user id
          this.props.onSubmit({ uid });
        } else {
          // If the user id does not exist, show the bad login message
          this.setState({badLogin: true});
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
      <p> Login: </p>
      <form id="loginForm" onSubmit={this.handleLogin}>
        <div>
          <label htmlFor="loginUID"> Username: </label>
          <input required type="text" id="loginUID" onChange={this.handleLoginChange}/>
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
