import React, { Component } from 'react';
import './suggests.css';
//import './searchResult.css'
import axios from 'axios';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import Visited from '../visites/visitedProfile';
import { FaUserPlus } from 'react-icons/fa'
import { FiArrowUpRight } from 'react-icons/fi'


class Suggested extends Component {
    constructor(props){
        super(props)
        this.state = {
            input: '',
            searchUser: {},
            result: false,
            suggestedUsers: [],
        }
    }

    componentDidMount() {
        axios.get('/api/suggested-users')
        .then(users => {
            console.log('suggested users ' + users.data)
            this.setState(() => ( {suggestedUsers: users.data} ))
        }).catch(err => console.log(err)) 
    }

    searchUser = (e) => {
        e.preventDefault();
        if(this.state.input !== '') {
            console.log('input = ' + this.state.input)
            axios.post('/api/search-user', {username: this.state.input})
            .then(res => {
                // console.log(res);
                if(res.status === 200){
                    this.setState(() => ({searchUser: res.data, result: true}))
                }
                //console.log(this.state.searchUser)
                // this.props.getVisited(res.data.username)
                //this.props.getVisited(res.data)
            }).catch(err => console.log(err)) 
        }
    }

    onChange = (e) => {
        this.setState({input: e.target.value})
        if(e.target.value === '') {
            this.setState(() => ({result: false}))
        }
    }
    
    render() {
        const visitPro = "/dashBoard/user/" + this.state.searchUser.username
        return (
            <div className="div2">
                <h1>Suggested Friends</h1>
                <form onSubmit={this.searchUser}>
                    <input type="text" id="search" placeholder="search user" value={this.state.input} onChange={this.onChange} />
                </form>
               
                <Link to={visitPro}>
                    <div className={this.state.result ? "searchContainer" : "hidden"} >
                        <div className="user">
                            <img src={`/uploads/${this.state.searchUser.searchedImage}`} />
                            <p>{this.state.searchUser.username}</p>
                        </div>
                    </div>
                </Link>
                
                <div className="suggest">
                    {this.state.suggestedUsers.length > 0 ? this.state.suggestedUsers.map(user => {
                        return  (
                        <div id="user" key={user.id} >
                            <div>
                                <img src={`/uploads/${user.userImage}`} /> 
                                <p>{user.username}</p>
                            </div>
                            <button className="inviteOff" onClick={(e) => {
                                if(e.target.className == "inviteOff") {
                                    e.target.className = "inviteOn"
                                    e.target.innerHTML = "sending..."
                                    axios.post(`/api/send-invitation/${user.id}`)
                                    .then(res => {
                                        if(res.status == 200){
                                            e.target.innerHTML = "sent"
                                            e.target.className = "completed"
                                        }
                                    }).catch(err => console.log(err))
                                }
                            }}> match <FaUserPlus /></button>
                        </div>)
                    }) : null}
                </div>
            </div>
        )
    }
}

export default Suggested