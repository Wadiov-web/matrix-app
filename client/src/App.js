import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/header/header'
import Intro from './components/landingPage/intro'
import Signup from './components/sign_up/signup'
import Signin from './components/sign_in/signin'
//import Home from './components/home/home'
import DashBoard from './components/dashBoard/dashBoard'

import ProtectedRoute from './ProtectedRoute'
import ProtectedSignedIn from './ProtectedSignedIn'
//import Profile from './profile'
import NotFound from './components/404/notFound'




function App() {


    return (

        <React.Fragment>
            <Header />
            <Router>
            <Switch>
                    <ProtectedSignedIn exact path="/" component={Intro}  />
                    <ProtectedSignedIn path="/signup" component={Signup}  />
                    <ProtectedSignedIn path="/signin" component={Signin}  />

                    <ProtectedRoute path="/dashBoard" component={DashBoard}  />
                
                    <Route path="*" component={NotFound} />
            </Switch>
            </Router>
        </React.Fragment>
    )
}

export default App