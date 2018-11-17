import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      register: '',
      badLogin: false,
      badRegister: false,
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
    const uid = this.state.login;

    fetch(`http://localhost:4000/authorize?user=${uid}`)
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          this.props.history.push({
            pathname: '/times',
            state: {
              uid
            }
          });
        } else {
          this.setState({badLogin: true});
        }
      })
      .catch(err => console.log(err));
  }

  handleRegisterChange(event) {
    this.setState({register: event.target.value});
  }

  handleRegister(event) {
    event.preventDefault();
    const uid = this.state.register;

    fetch(`http://localhost:4000/authorize?user=${uid}`)
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          this.setState({badRegister: true});
        } else {
          fetch(`http://localhost:4000/register?user=${uid}`)
            .then(response => response.json())
            .then(response => {
              this.props.history.push({
                pathname: '/times',
                state: {
                  uid
                }
              });
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
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
          {
            this.state.badLogin ?
            <p> No UID exists with that name </p>
            : null
          }
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
