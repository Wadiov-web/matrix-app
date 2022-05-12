import React, { Component } from 'react';
import './suggests.css';
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa'
import http from '../http/axios.config'
import URL from '../http/URL'

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
        http.get('/api/suggested-users')
        .then(users => {
            this.setState(() => ( {suggestedUsers: users.data} ))
        }).catch(err => console.log(err)) 
    }

    searchUser = (e) => {
        e.preventDefault();
        if(this.state.input !== '') {
            http.post('/api/search-user', {username: this.state.input})
            .then(res => {
                if(res.status === 200){
                    this.setState(() => ({searchUser: res.data, result: true}))
                }
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
        return (
            <div className="div2">
                <h1>Suggested Friends</h1>
                <form onSubmit={this.searchUser}>
                    <input type="text" id="search" placeholder="search user" value={this.state.input} onChange={this.onChange} />
                </form>
                <Link to={`/dashBoard/user/${this.state.searchUser.username}`}>
                    <div className={this.state.result ? "searchContainer" : "hidden"} >
                        <div className="user">
                            <img src={`${URL}/uploads/${this.state.searchUser.searchedImage}`} />
                            <p>{this.state.searchUser.username}</p>
                        </div>
                    </div>
                </Link>
                <div className="suggest">
                    {this.state.suggestedUsers.length > 0 ? this.state.suggestedUsers.map(user => {
                        return  (
                        <div id="user" key={Math.random()} >
                            <div>
                                <img src={`${URL}/uploads/${user.userImage}`} /> 
                                <p>{user.username}</p>
                            </div>
                            <button className="inviteOff" onClick={(e) => {
                                if(e.target.className === "inviteOff") {
                                    e.target.className = "inviteOn"
                                    
                                    http.post(`/api/send-invitation/${user.id}`)
                                    .then(res => {
                                        if(res.status === 200){
                                            e.target.innerText = "sent"
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