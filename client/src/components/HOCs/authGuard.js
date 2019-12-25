import React, { Component } from 'react';
import { connect } from 'react-redux';

export default (OriginalComponent) => {
    class MixedComponent extends Component {

        checkAuth() {
            if (!this.props.isAuthenticated || !this.props.jwtToken) {
                console.log('User is not authenticated, declined access.');
                this.props.history.push('/');
            }
        }

        componentDidMount() {
            // check if user is authenticated
            this.checkAuth();
        }

        componentDidUpdate() {
            // check if user is authenticated
            this.checkAuth();
        }
        render() {
            return <OriginalComponent {...this.props}/>;
        }
    }

    function mapStateToProps(state) {
        return {
            isAuthenticated: state.auth.isAuthenticated,
            jwtToken: state.auth.token
        }
    }

    return connect(mapStateToProps)(MixedComponent);
};
