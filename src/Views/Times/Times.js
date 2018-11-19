import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './Times.css';
import SuccessButton from '../../Components/SuccessButton/SuccessButton';
import AdminFilters from '../../Components/AdminFilters/AdminFilters';
import { API_URL } from '../../config';

class Times extends Component {
  constructor(props) {
    super(props);
    this.state = {
      times: [],
      activeShift: false,
      activeBreak: false,
      activeLunch: false,
      searchUID: props.uid,
    };

    this.getTimes = this.getTimes.bind(this);
    this.renderTimes = this.renderTimes.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.renderAdminFilters = this.renderAdminFilters.bind(this);
  }

  componentDidMount() {
    this.getTimes();
  }

  getTimes() {
    const searchUID = this.state.searchUID;
    fetch(`${API_URL}times?uid=${searchUID}`)
      .then(response => response.json())
      .then(response => {
        let activeShift, activeBreak, activeLunch = false;
        if (response) {
          const userWork = response.find(({ record }) => {
            return record === 'work';
          });
          const userBreak = response.find(({ record }) => {
            return record === 'break';
          });
          const userLunch = response.find(({ record }) => {
            return record === 'lunch';
          });
          userWork && userWork.start ? activeShift = true : activeShift = false;
          userBreak && userBreak.start ? activeBreak = true : activeBreak = false;
          userLunch && userLunch.start ? activeLunch = true : activeLunch = false;
        }
        this.setState({
          times: response,
          activeShift,
          activeBreak,
          activeLunch
        });
      })
      .catch(err => console.log(err));
  };

  formatDateTime({ time }) {
    // Split timestamp into [ Y, M, D, h, m, s ]
    const t = time.split(/[- : T Z]/);
    // Return i.e(11:33:07 on 11/18/2018)
    return `${t[3]}:${t[4]}:${t[5].slice(0, 2)} on ${t[1]}/${t[2]}/${t[0]}`;
  }

  renderTimes({ time, record, start }, i) {
    return (
      <tr key={i}>
        <td>{this.formatDateTime({ time })}</td>
        <td>{start ? `Started ${record}` : `Ended ${record}`}</td>
      </tr>
    );
  };

  renderControls() {
    if (this.props.uid === this.state.searchUID) {
      return (
        <div className="controls">
          <SuccessButton
            name="Clock In"
            onSubmit={() => this.add({
              uid: this.props.uid,
              record: 'work',
              start: 1
            })}
            show={((!this.state.activeShift) || this.props.admin)}
          />
          <SuccessButton
            name="Clock Out"
            onSubmit={() => this.add({
              uid: this.props.uid,
              record: 'work',
              start: 0
            })}
            show={((this.state.activeShift
              && !this.state.activeLunch
              && !this.state.activeBreak)
              || this.props.admin)}
          />
          <SuccessButton
            name="Start Lunch"
            onSubmit={() => this.add({
              uid: this.props.uid,
              record: 'lunch',
              start: 1
            })}
            show={((this.state.activeShift
              && !this.state.activeLunch
              && !this.state.activeBreak)
              || this.props.admin)}
          />
          <SuccessButton
            name="End Lunch"
            onSubmit={() => this.add({
              uid: this.props.uid,
              record: 'lunch',
              start: 0
            })}
            show={((this.state.activeShift
              && this.state.activeLunch
              && !this.state.activeBreak)
              || this.props.admin)}
          />
          <SuccessButton
            name="Start Break"
            onSubmit={() => this.add({
              uid: this.props.uid,
              record: 'break',
              start: 1
            })}
            show={((this.state.activeShift
              && !this.state.activeLunch
              && !this.state.activeBreak)
              || this.props.admin)}
          />
          <SuccessButton
            name="End Break"
            onSubmit={() => this.add({
              uid: this.props.uid,
              record: 'break',
              start: 0
            })}
            show={((this.state.activeShift
              && !this.state.activeLunch
              && this.state.activeBreak)
             || this.props.admin)}
          />
          <SuccessButton
            name="Log Out"
            onSubmit={() => this.props.history.push({
              pathname: '/',
            })}
            show={true}
          />
        </div>
      )
    } else {
      return null
    }
  }

  renderAdminFilters() {
    if (this.props.admin) {
      return (
        <div className="controls">
          <AdminFilters
            onSubmit={({ uid }) => {
            this.setState({ searchUID: uid }, () => { this.getTimes(); });
          }}
          />
        </div>
      )
    } else {
      return null;
    }
  }

  add({uid, record, start}) {
    // Sanity check variables
    if (typeof uid === 'undefined' ||
        typeof record === 'undefined' ||
        typeof start === 'undefined') {
      return;
    }
    // Add the user to the database
    fetch(`${API_URL}clock?uid=${uid}&record=${record}&start=${start ? 1 : 0}`)
      .then(response => response.json())
      .then(response => this.getTimes())
      .catch(err => console.log(err));
  }

  render() {
    const { times } = this.state;
    return (
      <div id="container">
        <h2> Welcome, {this.props.uid} </h2>
        {this.renderControls()}
        {this.renderAdminFilters()}
        <div id="times">
          <p className="formTitle"> {this.state.searchUID}'s timeclock data </p>
          <table>
            <tbody>
              <tr>
                <th>Date</th>
                <th>Record</th>
              </tr>
              {times.map(this.renderTimes)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

Times.propTypes = {
  uid: PropTypes.string,
  admin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ])
}

export default withRouter(Times);
