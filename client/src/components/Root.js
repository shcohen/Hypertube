import React, {Component} from 'react';
import {connect} from 'react-redux';

import Header from './Header/Header';
import Footer from './Footer/Footer';

import {getTranslation} from '../store/actions/translate';

class Root extends Component {
  componentDidMount() {
    this.props.getTranslation();
  }

  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          <Header/>
          <div id="container">
            {this.props.children}
          </div>
          <Footer/>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, {getTranslation})(Root);