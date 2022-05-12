import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedSignedIn({component: Component, ...rest}) {
    return (
        <Route {...rest} render={(props) => {
            let isAuth;
            const SignedInStatus = localStorage.getItem('SignedInStatus')
            if(SignedInStatus !== null){
                if (SignedInStatus === 'false') {
                    isAuth = false
                } else {
                    isAuth = true
                }
            } else {
                isAuth = false
            }
            if (isAuth) {
                return <Redirect to="/dashBoard/home" />
            } else {
                return <Component props={props} /> 
            }
        }} /> 
    )
}

export default ProtectedSignedIn;