import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import { createEvent, updateEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';

export class EventDashboard extends Component {
  render() {
    const { events } = this.props;

    if (!isLoaded(events)) return <LoadingComponent />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList events={events} />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.firestore.ordered.events,
});

const mapDispatchToProps = {
  createEvent,
  updateEvent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(firestoreConnect([{ collection: 'events' }])(EventDashboard));
