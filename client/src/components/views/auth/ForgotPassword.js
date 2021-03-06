import React, { Fragment, useState } from 'react';
import axios from 'axios';

import { useAlert } from 'react-alert';
import MetaData from '../../layout/main/MetaData';
import Loader from '../../layout/main/Loader';


const ForgotPassword = ({ history }) => {

    const alert = useAlert();
    const isEmail = email => {
        // const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email;
    }

    const initialState = {
        email: '',
        err: '',
        success: ''
    }

    const [data, setData] = useState(initialState)

    const [email, setEmail] = useState('');

    const { loading } = data

    const forgotPassword = async () => {
        if (!isEmail(email))
            return setData({ ...data, err: 'Invalid emails.', success: '' })
        try {   
            const res = await axios.post('/api/auth/password/forgot', { email });
            alert.success('Email has been sent. Check your Email');
            return setData({ ...data, err: '', success: res.data.msg });


        } catch (err) { 
            alert.error('Email does not exist');
        }

    
    }


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'ForgotPassword'} styles={'html, body, .App { background-color: #4FBD95 !important; }'} />
                    <div className="d-lg-flex half">
                        <div className="d-flex justify-content-center">
                            <img className="bg order-1 order-md-2 h-75 w-75 my-auto img-fluid half" src="/images/undraw_forgot_password_re_hxwm.svg" alt="ForgotPassword" />
                        </div>
                        <div className="contents order-2 order-md-1 bg-app-primary-light">

                            <div className="row align-items-center justify-content-center bg-app-primary-light" id="adjustRow">
                                <div className="col-md-7" id="Align">
                                    <h3 className="fs-1">Forgot your <strong>Password?</strong></h3>
                                    {/* <p className="ForgotPassword-subheading fs-5 fw-light mb-4">Discover students who are interested in sharing their attained skills and knowledge.</p> */}

                                    <div className="form-floating mb-3">
                                        <input type="email" className="form-control" id="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        {/* <input type="email" name="email" id="email" value={email} onChange={handleChangeInput} /> */}

                                        <label htmlFor="password">Enter your Email Address</label>
                                    </div>
                                    <button className="btn btn-primary btn-lg btn-block w-100 text-white mb-2" type="submit" onClick={forgotPassword}>Find Email</button>


                                   

                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}

        </Fragment>
    )
}

export default ForgotPassword
