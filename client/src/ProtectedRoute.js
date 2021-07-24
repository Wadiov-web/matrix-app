import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import socketClient from 'socket.io-client';
const socket = socketClient.connect('http://localhost:4000');


function ProtectedRoute({component: Component, ...rest}) {

    return (
        <Route {...rest} render={(props) => {
            console.log('dashBoard route is hit')

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
                console.log('no local storage route')
            }



            if (isAuth) {
                return <Component props={props} socket={socket} /> 
            } else {
                return <Redirect to='/signin'  />
            }
        }} />
    )
       
}

export default ProtectedRoute;