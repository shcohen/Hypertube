import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import store from './store';
import jwt_decode from 'jwt-decode';

import Root from './components/Root';
import Home from './components/Home/Home';
import Error from './components/Error/Error';
import Movies from './components/Movies/Movies';
import MoviePage from './components/MoviePage/MoviePage';
import WatchMovie from './components/WatchMovie/WatchMovie';
import ProtectedRoute from './components/Utilities/ProtectedRoute/ProtectedRoute';
import Account from './components/Account/Account';

import setAuthToken from './utils/setAuthToken';
import cookies from './utils/cookies';
import {setCurrentUser, logoutUser} from './store/actions/auth';
import {setLanguageNoDispatch} from './store/actions/translate';

import './css/normalize.css';
import './css/darkmode.css';
import './css/global.css';
import './css/checkbox.css';
import './css/toolbox.css';

const jwtToken = cookies.get('jwtToken');
if (jwtToken && jwtToken !== 'undefined') {
  setAuthToken(jwtToken);
  const decoded = jwt_decode(jwtToken);
  store.dispatch(setCurrentUser(decoded));
  if (decoded) {
    store.dispatch(setLanguageNoDispatch(decoded.lang));
  }
} else {
  store.dispatch(logoutUser());
  // window.location.href = '/';
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Root>
            <Switch>
              <ProtectedRoute path={'/'} exact component={Home} needsLoggedIn={false} redirectTo={'/movies'}/>
              <ProtectedRoute path={'/movies'} exact component={Movies} needsLoggedIn={true} redirectTo={'/'}/>
              <ProtectedRoute path={'/movie/:IMDBid/:YTSid'} exact component={MoviePage} needsLoggedIn={true} redirectTo={'/'}/>
              <ProtectedRoute path={'/watch/:id/:title/:hash'} exact component={WatchMovie} needsLoggedIn={true} redirectTo={'/'}/>
              <ProtectedRoute path={'/account'} exact component={Account} needsLoggedIn={true} redirectTo={'/'}/>
              <Route component={Error}/>
            </Switch>
          </Root>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App;