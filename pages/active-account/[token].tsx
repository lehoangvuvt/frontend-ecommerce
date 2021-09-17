import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ActiveAccount = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    let intialError: { type: number, message: string };
    intialError = { type: 0, message: '' };
    const [error, setError] = useState(intialError);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const params = router.query;
        if (params.token) {
            const activeAccount = async () => {
                const token = params.token;
                setIsLoading(true);
                const response = await axios({
                    method: 'GET',
                    url: `http://localhost:5035/customers/active-account/${token}`,
                });
                const data = await response.data;

                if (data.error) {
                    const message = data.error.message;
                    console.log(message);
                    if (message === 'jwt malformed' || message === 'invalid signature') {
                        setError({ type: 1, message: 'Sorry, we cannot active your account. Please recheck your activation link' });
                    } else if (message === 'Account not existed') {
                        setError({ type: 2, message: 'Sorry, we cannot find your account with this activation link in our database' });
                    } else if (message === 'Account already activated') {
                        setError({ type: 3, message: 'This account is already activated' });
                    } else if (message === 'jwt expired') {
                        setError({ type: 4, message: 'This activation link is expired. Click the bellow button to resend activation link to your email' });
                    } else {
                        setError({ type: 5, message: 'Sorry, we cannot active your account right now. Please try again later' });
                    }
                    setIsSuccess(false);
                    setIsLoading(false);
                } else {
                    setError({ type: 0, message: '' });
                    setIsSuccess(true);
                    setIsLoading(false);
                }
            }

            activeAccount();
        }
    }, [router.isReady])

    return (

        <div className='active-account-container'>
            {!isLoading && isSuccess && error.type === 0 ?
                <>
                    <i
                        style={{ color: '#3f51b5' }}
                        className="fas fa-check-circle"></i>
                    <h1>Congratulations, your account has been activated!</h1>
                    <a href="/login">Go back to login page</a>
                </>
                : null
            }
            {!isLoading && !isSuccess && error.type !== 0 ?
                error.type === 1 ?
                    <>
                        <i
                            style={{ color: '#e74c3c' }}
                            className="fas fa-times-circle"></i>
                        <h1>{error.message}</h1>
                        <a href="/login">Go back to login page</a>
                    </>
                    :
                    error.type === 2 ?
                        <>
                            <i
                                style={{ color: '#e74c3c' }}
                                className="fas fa-times-circle"></i>
                            <h1>{error.message}</h1>
                            <a href="/login">Go back to login page</a>
                        </>
                        :
                        error.type === 3 ?
                            <>
                                <i
                                    style={{ color: '#f1c40f' }}
                                    className="fas fa-exclamation-circle"></i>
                                <h1>{error.message}</h1>
                                <a href="/login">Go back to login page</a>
                            </> :
                            error.type === 4 ?
                                <>
                                    <i
                                        style={{ color: '#e74c3c' }}
                                        className="fas fa-times-circle"></i>
                                    <h1>{error.message}</h1>
                                    <a href='/resend-activation'>Resend action link</a>
                                </>
                                :
                                <>
                                    <i
                                        style={{ color: '#e74c3c' }}
                                        className="fas fa-times-circle"></i>
                                    <h1>{error.message}</h1>
                                    <a href="/login">Go back to login page</a>
                                </>
                : null
            }
            {
                isLoading ?
                    <h1>Processing...</h1> : null
            }
        </div >

    )
}

export default ActiveAccount;