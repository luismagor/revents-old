import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import { connect } from 'react-redux';
import { firebaseConnect, isEmpty, withFirestore } from 'react-redux-firebase';
import {
  createDataTree,
  objectToArray,
} from '../../../app/common/util/helpers';
import { cancelGoingToEvent, goingToEvent } from '../../user/userActions';
import { compose } from 'redux';
import { addEventComment } from '../eventActions';
import { openModal } from '../../modals/modalActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import NotFound from '../../../app/layout/NotFound';

class EventDetailedPage extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const {
      openModal,
      loading,
      event,
      auth,
      goingToEvent,
      cancelGoingToEvent,
      addEventComment,
      eventChat,
      requesting,
      match,
    } = this.props;
    const attendees =
      event &&
      event.attendees &&
      objectToArray(event.attendees).sort(
        (a, b) => a.joinDate.toDate() - b.joinDate.toDate()
      );
    const isHost = event && event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    const authenticated = auth.isLoaded && !auth.isEmpty;
    const loadingEvent = requesting[`events/${match.params.id}`];

    if (loadingEvent) {
      return <LoadingComponent />;
    }
    if (Object.keys(event).length === 0) return <NotFound />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader
            event={event}
            loading={loading}
            isGoing={isGoing}
            isHost={isHost}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
            authenticated={authenticated}
            openModal={openModal}
          />
          <EventDetailedInfo event={event} />
          {authenticated && (
            <EventDetailedChat
              eventChat={chatTree}
              addEventComment={addEventComment}
              eventId={event.id}
            />
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  if (
    state.firestore.ordered.events &&
    state.firestore.ordered.events.length > 0
  ) {
    event =
      state.firestore.ordered.events.filter(event => event.id === eventId)[0] ||
      {};
  }

  return {
    event,
    requesting: state.firestore.status.requesting,
    auth: state.firebase.auth,
    loading: state.async.loading,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) &&
      objectToArray(state.firebase.data.event_chat[ownProps.match.params.id]),
  };
};

const mapDispatchToProps = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal,
};

export default compose(
  withFirestore,
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect(props => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
