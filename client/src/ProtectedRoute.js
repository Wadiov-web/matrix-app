import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import socketClient from 'socket.io-client'
import URL from './components/http/URL'
const socket = socketClient.connect(URL)


function ProtectedRoute({component: Component, ...rest}) {
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
                return <Component props={props} socket={socket} /> 
            } else {
                return <Redirect to='/signin'  />
            }
        }} />
    )
}

export default ProtectedRoute