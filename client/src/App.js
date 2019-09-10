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

import setAuthToken from './utils/setAuthToken';
import cookies from './utils/cookies';
import {setCurrentUser, logoutUser} from './store/actions/auth';

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
              <Route path={'/'} exact component={Home}/>
              <Route path={'/movies'} exact component={Movies}/>
              <Route path={'/movie/:IMDBid/:YTSid'} exact component={MoviePage}/>
              <Route path={'/watch/:id/:title/:hash'} exact component={WatchMovie}/>
              <Route component={Error}/>
            </Switch>
          </Root>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App;