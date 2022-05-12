import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/header/header'
import Intro from './components/landingPage/intro'
import Signup from './components/sign_up/signup'
import Signin from './components/sign_in/signin'
import ForgotPassword from './components/forgotPassword/forgotPassword'
import ResetPassword from './components/forgotPassword/resetPassword'
import DashBoard from './components/dashBoard/dashBoard'
import ProtectedRoute from './ProtectedRoute'
import ProtectedSignedIn from './ProtectedSignedIn'
import NotFound from './components/404/notFound'

function App() {
    return (
        <React.Fragment>
            <Header />
            <Router>
                <Switch>
                    <ProtectedSignedIn exact path="/" component={Intro} />
                    <ProtectedSignedIn path="/signup" component={Signup} />
                    <ProtectedSignedIn path="/signin" component={Signin} />
                    <ProtectedSignedIn path="/forgot-my-pass" component={ForgotPassword} />
                    <ProtectedSignedIn path="/reset-forgot-pass" component={ResetPassword} />
                    <ProtectedRoute path="/dashBoard" component={DashBoard} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Router>
        </React.Fragment>
    )
}

export default App