import React, { Component, Fragment } from 'react';
import EventListItem from './EventListItem';

export class EventList extends Component {
  render() {
    return (
      <Fragment>
        {this.props.events.map(event => (
          <EventListItem key={event.id} event={event} />
        ))}
      </Fragment>
    );
  }
}

export default EventList;
