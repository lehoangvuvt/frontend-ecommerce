import { useRouter } from "next/router";
import { useEffect } from "react";
import { FC } from "react";
import { connect } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";
import { actions } from '../../redux/action_reducer_saga/login/action';
import { RootReducerType } from "../../redux/rootReducer";

const mapDispatchToProps = {
    logout: actions.logout
}

const mapStateToProps = (state: RootReducerType) => {
    return {
        logoutState: state.global.logout,
    }
}

type LogoutPropsTypes = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Logout: FC<LogoutPropsTypes> = ({ logout, logoutState }) => {
    const { isLoading, error } = logoutState;

    useEffect(() => {
        logout();
    }, [])

    useEffect(() => {
        if (!isLoading && !error) {
            window.location.href = '/login';
        }
    }, [isLoading])

    return (
        <div className='logout-container'>
            <h1>Logging out</h1>
            <ClipLoader color={'black'} loading={isLoading} size={80} />
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);