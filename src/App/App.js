import React, { Component } from 'react';
import './App.css';
import Home from '../Views/Home/Home';
import Times from '../Views/Times/Times';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path='/' render={() => (
            <div className="App">
              <Home />
            </div>
          )}/>
          <Route path='/times' render={(props) => (
            <div className="App">
              <Times uid={props.location.state.uid}/>
            </div>
          )}/>
        </div>
      </BrowserRouter>
    )
  };
}

export default App;
