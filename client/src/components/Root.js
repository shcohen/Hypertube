import React, {Component} from 'react';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import Translation from './Translation/Translation';

class Root extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          <Header/>
          <Translation/>
          <div id="container">
            {this.props.children}
          </div>
          <Footer/>
        </div>
      </React.Fragment>
    );
  }
}

export default Root;