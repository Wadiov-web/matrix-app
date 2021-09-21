import React, { Component } from 'react'
import './dashBoard.css'
import axios from 'axios'
import { BrowserRouter as Router, Switch, Link, Route, Redirect } from 'react-router-dom'

import Home from '../home/home'
import Profile from '../profile/profile'
import About from '../about/about'
import Notification from '../notification/notify'
import Visited from '../visites/visitedProfile'



class DashBoard extends Component {
    constructor(props){
        super(props)
        this.state = {
            notify: false,
            connectedUser: 'Tommy Storan',
            connectedId: '',
            visited: {}
        }
    }

    // getVisitedUser = (visitedUser) => {
    //     this.setState( {visited: visitedUser} )
    //     console.log('getVisitedUser()  DashBoard')
    //     console.log(visitedUser)
    //     console.log('----------------------')
    // }

    async componentDidMount() {
        const user = await axios.get('/api/user');
        console.log(user)
        this.setState(() => ( { connectedUser: user.data.username, connectedId: user.data.loginId } ))
        
        this.props.socket.emit('signin', {username: user.data.username, userId: user.data.loginId})
    }
  
    


    render() {
        const proPath = "/dashBoard/" + this.state.connectedUser
        const visitPro = "/dashBoard/user/"// + this.state.visited.username  
        return (

            <div classsName="container">
                <Router>
                    <div className="nav">
                        <ul>
                            <Link to="/dashBoard/home" ><li>Home</li></Link>
                            <Link to="/dashBoard/notifications" ><li>Notification</li></Link>
                            <Link to={proPath} ><li>Profile</li></Link>
                            <Link to="/dashBoard/about" ><li>About</li></Link>
                        </ul>
                    </div>
                    
                    <h1 style={{color: 'white'}}>{this.state.connectedUser}</h1>
                    <div>                
                        <Switch>
                            <Route exact path="/dashBoard/home" render={() => {
                                return <Home
                                    socketHome={this.props.socket}
                                    loggedIn={this.state.connectedUser} 
                                    //getVisited={this.getVisitedUser.bind(this)}
                                />
                            }} />
                            <Route exact path="/dashBoard/notifications" component={Notification} />
                            <Route path={proPath} render={() => {
                                return <Profile myprop={this.props.props} />
                            }} />
                            <Route exact path="/dashBoard/about" component={About} />

                            <Route path={visitPro} component={Visited} />

                            <Route path="*" render={() => {
                                return <Redirect to="/dashBoard/home" />
                            }} />
                        </Switch>
                    </div>
                </Router>
               
            </div>
        )
    }
}

export default DashBoard

//<Route path={visitPro} render={() => {
//     return <Visited exactUser={this.state.visited} />
// }} />