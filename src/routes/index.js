import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import NewEvent from '../pages/Event/Add';
import EditEvent from '../pages/Event/Edit';
import EventDetails from '../pages/Event/Details';
import MyEvents from '../pages/MyEvents';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/Dashboard" component={Dashboard} isPrivate />
      <Route path="/Profile" component={Profile} isPrivate />
      <Route path="/my-events" component={MyEvents} isPrivate />

      <Route path="/event-new" component={NewEvent} isPrivate />
      <Route path="/event-edit/:id" component={EditEvent} isPrivate />
      <Route path="/event-details/:id" component={EventDetails} isPrivate />
    </Switch>
  );
}
