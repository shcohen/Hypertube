import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

class ProtectedRoute extends Component {
  render() {
    const {component, ...rest} = this.props;
    if (this.props.auth.isAuthenticated === this.props.needsLoggedIn) {
      return (<Route {...rest} component={this.props.component}/>);
    } else {
      return (
        <Route {...rest}
               render={() => {
                 return (<Redirect to={{
                   pathname: this.props.redirectTo,
                   state: {
                     from: this.props.location
                   }
                 }}/>);
               }}/>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  auth: state.user
});

export default connect(mapStateToProps, null)(ProtectedRoute);