import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      register: ''
    }

    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegisterChange = this.handleRegisterChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleLoginChange(event) {
    this.setState({login: event.target.value});
  }

  handleLogin(event) {
    event.preventDefault();
    this.props.history.push({
      pathname: '/times',
      state: {
        uid: this.state.value
      }
    });
  }

  handleRegisterChange(event) {
    this.setState({login: event.target.value});
  }

  handleRegister(event) {
    event.preventDefault();
    this.props.history.push({
      pathname: '/times',
      state: {
        uid: this.state.value
      }
    });
  }


  render () {
      return (
        <div id='container'>
          <form id="loginForm" onSubmit={this.handleLogin}>
            <div>
              <label htmlFor="loginUID"> Username: </label>
              <input required type="text" id="loginUID" onChange={this.handleLoginChange}/>
              <input type="submit" value="Log In" id="loginButton"/>
            </div>
          </form>
          <form id="registerForm" onSubmit={this.handleRegister}>
            <div>
              <label htmlFor="registerUID"> Username: </label>
              <input required type="text" id="registerUID" onChange={this.handleRegisterChange}/>
              <input type="submit" value="Register" id="register"/>
            </div>
          </form>
        </div>
      )
   }
}

export default withRouter(Home);
