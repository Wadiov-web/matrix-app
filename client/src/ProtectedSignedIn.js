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
                console.log('regular route is Hit')
            } else {
                isAuth = false
                console.log('no local storage signed')
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