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

  redirect(params) {
    const { uid } = params;

    this.props.history.push({
      pathname: '/times',
      state: {
        uid
      }
    });
  }

  render () {
      return (
        <div>
          <Login onSubmit={this.redirect}/>
          <Register onSubmit={this.redirect}/>
        </div>
      )
   }
}

export default withRouter(Home);
