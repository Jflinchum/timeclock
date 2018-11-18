import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Register.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register: '',
      badRegister: false,
    }

    this.handleRegisterChange = this.handleRegisterChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegisterChange(event) {
    this.setState({register: event.target.value});
  }

  handleRegister(event) {
    event.preventDefault();
    const uid = this.state.register;

    // First authorize the user to make sure they don't already exist
    fetch(`http://localhost:4000/authorize?uid=${uid}`)
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          // If they already exist, show the bad register message
          this.setState({badRegister: true});
        } else {
          // If they don't exist, register them and call the onSubmit function
          fetch(`http://localhost:4000/register?uid=${uid}`)
            .then(response => response.json())
            .then(response => this.props.onSubmit({ uid }))
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <p> Register: </p>
        <form id="registerForm" onSubmit={this.handleRegister}>
          <div>
            <label htmlFor="registerUID"> Username: </label>
            <input required type="text" id="registerUID" onChange={this.handleRegisterChange}/>
            <input type="submit" value="Register" id="register"/>
          </div>
        </form>
        {
          this.state.badRegister ?
          <p> UID already exists with that name </p>
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