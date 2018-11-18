import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { API_URL } from '../../config';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register: '',
      registerAdmin: false,
      accountExists: false,
      badRegister: false,
    }

    this.handleUIDChange = this.handleUIDChange.bind(this);
    this.handleAdminChange = this.handleAdminChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleUIDChange(event) {
    this.setState({register: event.target.value});
  }

  handleAdminChange(event) {
    this.setState({registerAdmin: event.target.checked});
  }

  hasNumber(myString) {
    return /\d/.test(myString);
  }

  hasCharacter(myString) {
    return /[A-Za-z]/.test(myString);
  }

  handleRegister(event) {
    event.preventDefault();
    const uid = this.state.register;
    const registerAdmin = this.state.registerAdmin;
    if (uid.length !== 7 || this.hasNumber(uid.slice(0, 3)) || this.hasCharacter(uid.slice(3, 8))) {
      this.setState({ badRegister: true });
      return;
    }

    // First authorize the user to make sure they don't already exist
    fetch(`${API_URL}authorize?uid=${uid}`)
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          // If they already exist, show the bad register message
          this.setState({ accountExists: true });
        } else {
          // If they don't exist, register them and call the onSubmit function
          fetch(`${API_URL}register?uid=${uid}&admin=${registerAdmin}`)
            .then(response => response.json())
            .then(response => this.props.onSubmit({ uid, admin: this.state.registerAdmin }))
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <p className="formTitle"> Register: </p>
        <form id="registerForm" onSubmit={this.handleRegister}>
          <div className="formElementContainer">
            <label htmlFor="registerUID"> Username: </label>
            <input required type="text" id="registerUID" onChange={this.handleUIDChange}/>
          </div>
          <div className="formElementContainer">
            <label htmlFor="registerAdmin"> Admin? </label>
            <input type="checkbox" id="registerAdmin" onChange={this.handleAdminChange}/>
          </div>
          <div className="formElementContainer">
            <button type="submit">Register</button>
          </div>
        </form>
        {
          this.state.accountExists ?
          <p className="errorMessage"> UID already exists with that name </p>
          : null
        }
        {
          this.state.badRegister ?
          <p className="errorMessage"> UID must be seven characters long and have the format aaa0000 </p>
          : null
        }
      </div>
    );
  }
}

Register.propTypes = {
  onSubmit: PropTypes.func
}

export default Register;
