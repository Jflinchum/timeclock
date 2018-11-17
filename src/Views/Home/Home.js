import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
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
          <form id="loginForm" onSubmit={this.handleSubmit}>
            <div>
              <div>
                <label htmlFor="uName"> Username: </label>
                <input required type="text" id="uName" onChange={this.handleChange}/>
              </div>
              <input type="submit" value="Log In" id="loginButton"/>
            </div>
          </form>
        </div>
      )
   }
}

export default withRouter(Home);
