import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { RootReducerType } from '../../redux/rootReducer';
import { actions } from '../../redux/action_reducer_saga/login/action';

const mapStateToProps = (state: RootReducerType) => {
    return {
        loginState: state.global.login,
        customer_info: state.global.customer_info,
    }
}

const mapDispatchToProps = {
    login: actions.login,
}

type LoginPropType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const LoginContainer: React.FC<LoginPropType> = ({ login, customer_info, loginState }) => {
    const [email, setEmail] = useState('');
    const { isLoading, error } = loginState;
    const [loginError, setLoginError] = useState('');
    const [password, setPassword] = useState('');
    const [isDisabledLogin, setIsDisabledLogin] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (customer_info) {
            setLoginError('');
            window.location.href = '/';
        } else {
            if (!error) {
                setLoginError('');
            } else {
                setLoginError('Incorrect email or password');
            }
        }
    }, [customer_info, error])

    useEffect(() => {
        if (customer_info) {
            setLoginError('');
            window.location.href = '/';
        } else {
            if (!error) {
                setLoginError('');
            } else {
                setLoginError('Incorrect email or password');
            }
        }
    }, [])

    useEffect(() => {
        if (email.trim() === '' || password.trim() === '') {
            setIsDisabledLogin(true);
        } else {
            setIsDisabledLogin(false);
        }
    }, [email, password])

    function handleSubmit(e: any) {
        login(email, password);
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}
            className='login-register-container__login-container'>
            <div className='login-register-container__login-container__top'>
                <div className='login-register-container__login-container__top__top'>
                    <h1>Login</h1>
                </div>
                <div className='login-register-container__login-container__top__bottom'>
                    <p>If you have an account with us, please log in.</p>
                </div>
            </div>
            <div className='login-register-container__login-container__middle'>
                <input
                    value={email}
                    name="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder={'Email Address'}
                    type="email"
                />
                <input
                    value={password}
                    name="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder={'Password'}
                    type="password"
                />
            </div>
            <div className='login-register-container__login-container__bottom'>
                <div className='login-register-container__login-container__bottom__left'>
                    <button
                        onClick={() => { handleSubmit }}
                        disabled={isDisabledLogin}
                        style={{
                            backgroundColor: isDisabledLogin ? 'rgba(0,0,0,0.25)' : 'black',
                            cursor: isDisabledLogin ? 'not-allowed' : 'pointer',
                        }}
                        className='login-register-container__login-container__bottom__left__login-btn'>
                        Login
                    </button>
                </div>
                <div className='login-register-container__login-container__bottom__right'>
                    <Link href=''>
                        <a>Forgot your password?</a>
                    </Link>
                </div>
            </div>
            {loginError != "" ?
                <Alert
                    className="error-msg"
                    severity="error">{loginError}</Alert>
                :
                null
            }
            <ClipLoader color={'black'} loading={isLoading} size={80} />
        </form>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);