import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.css';
import Login from '../../Components/Login/Login';
import Register from '../../Components/Register/Register';

class Home extends Component {
  constructor(props) {
    super(props);

    this.redirect = this.redirect.bind(this);
  }

  /**
   * Redirect to the times view
   */
  redirect(params) {
    const { uid, admin } = params;

    this.props.history.push({
      pathname: '/times',
      state: {
        uid,
        admin
      }
    });
  }

  render () {
      return (
        <div className="homeContainer">
          <div className="loginContainer">
            <Login onSubmit={this.redirect}/>
          </div>
          <div className="registerContainer">
            <Register onSubmit={this.redirect}/>
          </div>
        </div>
      )
   }
}

export default withRouter(Home);
