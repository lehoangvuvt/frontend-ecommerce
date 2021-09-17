import validator from 'validator';
import Link from 'next/link';
import { useState } from 'react';
import RegisterCustomerDTO from '../../redux/action_reducer_saga/login/register-customer.dto';
import axios from 'axios';

const RegisterContainer = () => {
    const strongPasswordConfigure = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [isShowPassword, setShowPassword] = useState(false);
    const [isShowRepassword, setShowRepassword] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
    const [isReceiveNews, setIsReceiveNews] = useState(false);

    async function handleSubmit(e: any) {
        e.preventDefault();
        if (validateFields()) {
            let registerData = new RegisterCustomerDTO(email, password, firstName, lastName, phone);
            const response = await axios({
                method: 'POST',
                url: 'http://localhost:5035/customers/register',
                data: registerData
            });
            const data = await response.data;
            if (data.error && data.error.message === 'Email existed') {
                setEmailError('This email has already been registered');
                setRegisterError('This email has already been registered');
                setIsRegisterSuccess(false);
            }
            if (data.success) {
                setEmailError('');
                setRegisterError('');
                setIsRegisterSuccess(true);
                window.location.href = 'http://localhost:3002/resend-activation';
            }
        } else {
            setErrors()
            window.scrollTo({ left: 0, top: 300, behavior: 'smooth' });
        }
        e.preventDefault();
    }

    function validateFields() {
        let isValidate = true;
        if (!validator.isEmail(email.trim()) || validator.isEmpty(email.trim())
            || !validator.isMobilePhone(phone.trim()) || validator.isEmpty(phone.trim())
            || validator.isEmpty(firstName.trim()) || validator.isEmpty(lastName.trim())
            || validator.isEmpty(password) || !validator.isStrongPassword(password, strongPasswordConfigure)
            || password !== repassword
        ) {
            isValidate = false;
        } else {
            isValidate = true;
        }
        return isValidate;
    }

    function setErrors() {
        if (validator.isEmpty(email.trim())) {
            setEmailError('Please enter your email');
        } else {
            if (!validator.isEmail(email.trim())) {
                setEmailError('Incorrect email format');
            } else {
                setEmailError('');
            }
        }

        if (validator.isEmpty(phone.trim())) {
            setPhoneError('Please enter your phone number');
        } else {
            if (!validator.isMobilePhone(phone.trim())) {
                setPhoneError('Incorrect phone number');
            } else {
                setPhoneError('');
            }
        }

        if (validator.isEmpty(firstName.trim())) {
            setFirstNameError('Please enter your first name');
        } else {
            setFirstNameError('');
        }

        if (validator.isEmpty(lastName.trim())) {
            setLastNameError('Please enter your last name');
        } else {
            setLastNameError('');
        }

        if (validator.isEmpty(password)) {
            setPasswordError('Please enter your password');
        } else {
            if (!validator.isStrongPassword(password, strongPasswordConfigure)) {
                setPasswordError('Password must be contains at least 1 uppercase character, 1 number, 1 special character and minimum length is 8');
            } else {
                setPasswordError('');
            }
        }

        if (validator.isEmpty(repassword)) {
            setRepasswordError('Please confirm your password');
        } else {
            if (repassword !== password) {
                setRepasswordError('Your confirm password does not match with your password');
            } else {
                setRepasswordError('');
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}
            className='login-register-container__register-container'>
            <div className='login-register-container__register-container__top'>
                <div className='login-register-container__register-container__top__top'>
                    <h1>Create An Account</h1>
                </div>
                <div className='login-register-container__register-container__top__bottom'>
                    <p>By creating an account with our store, you will be able to move through the checkout process faster, store multiple shipping addresses, view and track your orders in your account and more.</p>
                </div>
            </div>
            <div className='login-register-container__register-container__middle'>
                <input
                    style={{ border: firstNameError !== '' ? '1px solid #e74c3c' : '1px solid rgba(0, 0, 0, 0.2)' }}
                    value={firstName}
                    name="firstName"
                    onChange={(e) => {
                        setFirstName(e.target.value);
                    }}
                    placeholder={'First Name'}
                    type="text"
                />
                {firstNameError !== '' ?
                    <p
                        style={{
                            fontSize: '1.3rem',
                            color: '#e74c3c',
                            marginBottom: '15px',
                        }}
                    >
                        {firstNameError}
                    </p>
                    : null}
                <input
                    style={{ border: lastNameError !== '' ? '1px solid #e74c3c' : '1px solid rgba(0, 0, 0, 0.2)' }}
                    value={lastName}
                    name="lastName"
                    onChange={(e) => {
                        setLastName(e.target.value);
                    }}
                    placeholder={'Last Name'}
                    type="text"
                />
                {lastNameError !== '' ?
                    <p
                        style={{
                            fontSize: '1.3rem',
                            color: '#e74c3c',
                            marginBottom: '15px',
                        }}
                    >
                        {lastNameError}
                    </p>
                    : null}
            </div>
            <div className='login-register-container__register-container__middle'>
                <input
                    style={{ border: emailError !== '' ? '1px solid #e74c3c' : '1px solid rgba(0, 0, 0, 0.2)' }}
                    value={email}
                    name="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder={'Email Address'}
                    type="text"
                />
                {
                    emailError !== '' ?
                        <p
                            style={{
                                fontSize: '1.3rem',
                                color: '#e74c3c',
                                marginBottom: '15px',
                            }}
                        >
                            {emailError}
                        </p>
                        :
                        null
                }
                <input
                    style={{ border: phoneError !== '' ? '1px solid #e74c3c' : '1px solid rgba(0, 0, 0, 0.2)' }}
                    value={phone}
                    name="phone"
                    onChange={(e) => {
                        setPhone(e.target.value);
                    }}
                    placeholder={'Phone number'}
                    type="text"
                />
                {
                    phoneError !== '' ?
                        <p
                            style={{
                                fontSize: '1.3rem',
                                color: '#e74c3c',
                                marginBottom: '15px',
                            }}
                        >
                            {phoneError}
                        </p>
                        :
                        null
                }
                <div
                    style={{
                        width: '100%',
                        border: passwordError !== '' ? '1px solid #e74c3c' : '1px solid rgba(0, 0, 0, 0.2)',
                        height: '61px',
                        display: 'flex',
                        flexFlow: 'column wrap',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <input
                        style={{
                            height: '100%',
                            border: 'none',
                            width: '90%',
                            paddingLeft: '0.8em',
                            paddingRight: '0.8em',
                            fontSize: '1.3em',
                            outline: 'none',
                        }}
                        value={password}
                        name="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder={'Password'}
                        type={isShowPassword ? "text" : "password"}
                    />
                    {
                        !isShowPassword ?
                            <i
                                onClick={() => {
                                    setShowPassword(true);
                                }}
                                style={{
                                    fontSize: '1.6rem',
                                    cursor: 'pointer',
                                }}
                                className="far fa-eye"></i>
                            :
                            <i
                                onClick={() => {
                                    setShowPassword(false);
                                }}
                                style={{
                                    fontSize: '1.6rem',
                                    cursor: 'pointer',
                                }}
                                className="far fa-eye-slash"></i>
                    }
                </div>
                <br />
                {passwordError !== '' ?
                    <p
                        style={{
                            fontSize: '1.3rem',
                            color: '#e74c3c',
                            marginBottom: '15px',
                        }}
                    >
                        {passwordError}
                    </p>
                    : null}
                <div
                    style={{
                        width: '100%',
                        border: repasswordError !== '' ? '1px solid #e74c3c' : '1px solid rgba(0, 0, 0, 0.2)',
                        height: '61px',
                        display: 'flex',
                        flexFlow: 'column wrap',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <input
                        style={{
                            height: '100%',
                            border: 'none',
                            width: '90%',
                            paddingLeft: '0.8em',
                            paddingRight: '0.8em',
                            fontSize: '1.3em',
                            outline: 'none',
                        }}
                        value={repassword}
                        name="repassword"
                        onChange={(e) => {
                            setRepassword(e.target.value);
                        }}
                        placeholder={'Confirm Password'}
                        type={isShowRepassword ? "text" : "password"}
                    />
                    {
                        !isShowRepassword ?
                            <i
                                onClick={() => {
                                    setShowRepassword(true);
                                }}
                                style={{
                                    fontSize: '1.6rem',
                                    cursor: 'pointer',
                                }}
                                className="far fa-eye"></i>
                            :
                            <i
                                onClick={() => {
                                    setShowRepassword(false);
                                }}
                                style={{
                                    fontSize: '1.6rem',
                                    cursor: 'pointer',
                                }}
                                className="far fa-eye-slash"></i>
                    }
                </div>
                <br />
                {repasswordError !== '' ?
                    <p
                        style={{
                            fontSize: '1.3rem',
                            color: '#e74c3c',
                            marginBottom: '15px',
                        }}
                    >
                        {repasswordError}
                    </p>
                    : null}
            </div>
            {/* <div className='login-register-container__register-container__near-bottom'>
                <input
                    value={isReceiveNews}
                    onChange={() => {
                        setIsReceiveNews(!isReceiveNews);
                    }}
                    type='checkbox' />
                <h1>Sing up our Newsletter</h1>
            </div> */}
            <div className='login-register-container__register-container__bottom'>
                <div
                    style={{ width: '38%' }}
                    className='login-register-container__register-container__bottom__left'>
                    <button
                        type="submit"
                        className='login-register-container__register-container__bottom__left__create-account-btn'>
                        CREATE ACCOUNT
                    </button>
                </div>
            </div>
        </form>
    )
}

export default RegisterContainer;