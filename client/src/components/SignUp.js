import React, { Component } from 'react';
import {reduxForm, Field} from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import * as actions from '../Actions';
import CustomInput from './CustomInput';

export class SignUp extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
    }

    async onSubmit(formData) {
        // We need to call some actionCreator
        await this.props.signUp(formData);
        if (!this.props.errorMessage) {
            this.props.history.push('/dashboard');
        }
    }

    async responseGoogle(res) {
        console.log('response google', res);
        await this.props.oauthGoogle(res.accessToken);
        if (!this.props.errorMessage) {
            this.props.history.push('/dashboard');
        }
    }

    async responseFacebook(res) {
        console.log('response facebook', res);
        await this.props.oauthFacebook(res.accessToken);
        if (!this.props.errorMessage) {
            this.props.history.push('/dashboard');
        }
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <div className="row">
                <div className="col">
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <fieldset>
                            <Field
                                name="email"
                                type="text"
                                id="email"
                                label="Enter your email"
                                placeholder="example@example.com"
                                component={ CustomInput } />
                        </fieldset>
                        <fieldset>
                            <Field
                                name="password"
                                type="password"
                                id="password"
                                label="Enter your password"
                                placeholder="password"
                                component={ CustomInput } />
                        </fieldset>

                        { this.props.errorMessage ? 
                            <div className="alert alert-danger">
                                {this.props.errorMessage}
                            </div> : null 
                        }
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
                <div className="col">
                    <div className="text-center">
                        <div className="alert alert-primary">
                            Or sign up using third-party services.
                        </div>
                        <FacebookLogin
                            appId="1009296056135868"
                            textButton="Facebook"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                        />
                        <GoogleLogin
                            clientId="264572641683-tle3t9qlgqre10mumvlvncbickeb8a9v.apps.googleusercontent.com"
                            buttonText="Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        errorMessage: state.auth.errorMessage
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signup' })
)(SignUp)
