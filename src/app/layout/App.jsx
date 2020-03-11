import React, { Component, Fragment } from 'react';
import EventsDashboard from '../../features/event/EventDashBoard/EventsDashboard';
import NavBar from '../../features/nav/NavBar/NavBar';
import { Container } from 'semantic-ui-react';

class App extends Component {
  render() {
    return (
      <Fragment>
        <NavBar />
        <Container className="main">
          <EventsDashboard />
        </Container>
      </Fragment>
    );
  }
}

export default App;
