import React, { Component } from 'react'
import './dashBoard.css'
import { BrowserRouter as Router, Switch, Link, Route, Redirect } from 'react-router-dom'
import Home from '../home/home'
import Profile from '../profile/profile'
import About from '../about/about'
import Notification from '../notification/notify'
import Visited from '../visites/visitedProfile'
import http from '../http/axios.config'

class DashBoard extends Component {
    constructor(props){
        super(props)
        this.state = {
            notify: false,
            connectedUser: 'Tommy Storan',
            connectedId: ''
        }
    }

    async componentDidMount() {
        const user = await http.get('/api/user');
        this.setState(() => ( { connectedUser: user.data.username, connectedId: user.data.loginId }))
        this.props.socket.emit('signin', {username: user.data.username, userId: user.data.loginId})
    }
  
    render() {
        return (
            <div className="container">
                <Router>
                    <div className="nav">
                        <ul>
                            <Link to="/dashBoard/home" ><li>Home</li></Link>
                            <Link to="/dashBoard/notifications" ><li>Notification</li></Link>
                            <Link to={`/dashBoard/${this.state.connectedUser}`} ><li>Profile</li></Link>
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
                                />
                            }} />
                            <Route exact path="/dashBoard/notifications" component={Notification} />
                            <Route path={`/dashBoard/${this.state.connectedUser}`} render={() => {
                                return <Profile myprop={this.props.props} />
                            }} />
                            <Route exact path="/dashBoard/about" component={About} />

                            <Route path={"/dashBoard/user/"} component={Visited} />

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