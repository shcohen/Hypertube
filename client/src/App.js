import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import store from './store';

import Root from './components/Root';
import Home from './components/Home/Home';
import Error from './components/Error/Error';
import Movies from './components/Movies/Movies';

import './css/normalize.css';
import './css/darkmode.css';
import './css/global.css';
import './css/checkbox.css';
import './css/toolbox.css';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Root>
            <Switch>
              <Route path={'/'} exact component={Home}/>
              <Route path={'/movies'} exact component={Movies}/>
              <Route component={Error}/>
            </Switch>
          </Root>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App;