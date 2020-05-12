import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import { getEventsForDashboard } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';
import { firestoreConnect } from 'react-redux-firebase';

export class EventDashboard extends Component {
  state = {
    moreEvents: false,
    loadingInitial: true,
    loadedEvents: [],
  };

  async componentDidMount() {
    const next = await this.props.getEventsForDashboard();
    console.log(next);

    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        loadingInitial: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.events !== prevProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...this.props.events],
      });
    }
  }

  getNextEvents = async () => {
    const { events } = this.props;
    const lastEvent = events && events[events.length - 1];
    console.log(lastEvent);
    const next = await this.props.getEventsForDashboard(lastEvent);
    console.log(next);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false,
      });
    }
  };

  render() {
    const { loading } = this.props;
    const { moreEvents, loadedEvents } = this.state;

    if (this.state.loadingInitial) return <LoadingComponent />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            loading={loading}
            events={loadedEvents}
            moreEvents={moreEvents}
            getNextEvents={this.getNextEvents}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
  loading: state.async.loading,
});

const mapDispatchToProps = {
  getEventsForDashboard,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(firestoreConnect([{ collection: 'events' }])(EventDashboard));
