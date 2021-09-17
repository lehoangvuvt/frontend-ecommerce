import { useState } from "react";

const ResendActivation = () => {
    const [email, setEmail] = useState('');

    return (
        <div className='resend-activation-container'>
            <img src="https://app.qase.us/sites/all/themes/qase/images/source/caseCreate/check-email-icon.png" />
            <h1>Verify your email</h1>
            <p>To verify that is your email address, open your mailbox and find the mail we just sent you
                for active your account and follow the instruction in that mail to active you account. The link will be expired in 2 hours</p>
            <form>
                <input
                    value={email}
                    placeholder={'abc@abc.com'}
                    onChange={(e) => { setEmail(e.target.value) }}
                    type='text' />
                <input type="submit" value="Resend" />
            </form>
        </div>
    )
}

export default ResendActivation;