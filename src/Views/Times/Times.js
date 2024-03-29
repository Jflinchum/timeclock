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

  /**
   * Fetch the times for a user and date.
   * Sets activeShift, activeBreak, activeLunch state based on data received
   */
  getTimes() {
    let { searchUID, searchDate } = this.state;
    fetch(`${API_URL}times?uid=${searchUID}${searchDate ? `&date=${searchDate}` : ''}`)
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

  /**
   * Convert the time received to local time
   */
  formatDateTime({ time }) {
    const date = new Date(time);
    return date.toLocaleString()
  }

  /**
   * Render each row of the users shift data
   */
  renderTimes({ time, record, start }, i) {
    return (
      <tr key={i}>
        <td>{this.formatDateTime({ time })}</td>
        <td>{start ? `Started ${record}` : `Ended ${record}`}</td>
      </tr>
    );
  };

  /**
   * Render the control panel for users and admins. Only show it if you are
   * viewing your own time sheet. Show buttons based on current state of
   * activeShift, activeLunch, and activeBreak
   */
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

  /**
   * Render the admin filters based on whether or not user is admin
   */
  renderAdminFilters() {
    if (this.props.admin) {
      return (
        <div className="controls">
          <AdminFilters
            onSubmit={({ uid, date }) => {
            this.setState({ searchUID: uid, searchDate: date }, () => { this.getTimes(); });
          }}
          />
        </div>
      )
    } else {
      return null;
    }
  }

  /**
   * Add a record to the database and re-render time sheet
   */
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
