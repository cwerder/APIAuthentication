import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../Actions';

class Dashboard extends Component {

    async componentDidMount() {
        await this.props.getSecret();
    }

    render() {
        return (
            <div>
                This is the Dashboard component.
                <br />
                Our Secret: <h3>{ this.props.secret }</h3>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        secret: state.dashboard.secret
    }
}

export default connect(mapStateToProps, actions)(Dashboard);