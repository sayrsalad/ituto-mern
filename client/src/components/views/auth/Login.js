import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import MetaData from '../../layout/main/MetaData';
import Loader from '../../layout/main/Loader';

import { login, clearErrors } from '../../../actions/authActions';

import './login.css';

const Login = ({ history }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [checked, setChecked] = useState(true);

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {

        if (isAuthenticated) {
            history.push('/dashboard');
        }

        if (error && !(error === 'You have to login first to access this.')) {
            alert.error(error);
            dispatch(clearErrors());
        }


    }, [dispatch, alert, isAuthenticated, error, history]);

    const loginHandler = async (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Login'} styles={'html, body, .App { background-color: #4FBD95 !important; }'} />
                    <div className="d-lg-flex half">
                        <div className="d-flex justify-content-center" id="hide-login">
                            <img className="bg order-1 order-md-2 h-75 w-75 my-auto img-fluid half" src="/images/undraw_login_re_4vu2.svg" alt="Login" />
                        </div>
                        <div className="contents order-2 order-md-1 bg-app-primary-light">

                            <div className="container">
                                <div className="row align-items-center justify-content-center bg-app-primary-light">
                                    <div className="col-md-7">
                                        <h3 className="fs-2">Sign in to <strong>iTuto</strong></h3>
                                        <p className="login-subheading fs-5 fw-light mb-4">Discover students who are interested in sharing their attained skills and knowledge.</p>
                                        <form onSubmit={loginHandler}>

                                            <div className="form-floating mb-3">
                                                <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                                <label htmlFor="email">Email address</label>
                                            </div>

                                            <div className="form-floating mb-3">
                                                <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                                <label htmlFor="password">Password</label>
                                            </div>

                                            <div className="d-flex mb-4 align-items-center">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="checkRemember" defaultChecked={checked} onChange={() => setChecked(!checked)} />
                                                    <label className="form-check-label" htmlFor="checkRemember">Remember me</label>
                                                </div>
                                                <span className="ms-auto"><a href="/forgot/password" className="link-secondary">Forgot Password</a></span>
                                            </div>

                                            <button className="btn btn-primary btn-lg btn-block w-100 text-white mb-2" type="submit">Login</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Login
