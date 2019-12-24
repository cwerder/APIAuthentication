import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../Actions';

class Header extends Component {

    constructor(props) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }

    signOut() {
        console.log('signOut got called');
        this.props.signOut();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ marginBottom: '30px' }}>
                <Link className="navbar-brand" to="/">NodeOAuth</Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav ml-auto">
                        { !this.props.isAuth ?
                            <React.Fragment>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup" key="signup">Sign Up</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signin" key="signin">Sign In</Link>
                                </li>
                            </React.Fragment>
                             : null
                        }
                        { this.props.isAuth ? 
                            <React.Fragment>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signout" key="signout" onClick={this.signOut}>Sign Out</Link>
                                </li>
                            </React.Fragment> : null
                        }
                    </ul>
                </div>
            </nav>
        )
    };
};

function mapStateToProps(state) {
    return {
        isAuth: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, actions)(Header);