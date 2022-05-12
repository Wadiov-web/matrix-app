import { React, Component} from 'react'
import '../profile.css'
import {FaUserAltSlash} from 'react-icons/fa'
import http from '../../http/axios.config'
import URL from '../../http/URL'

class Friends extends Component{
    state = {
        friends: []
    }

    unfollow = (user) => {
        if(window.confirm(`Are you sure you want to unfollow ${user.friendName}`)){
            http.post(`/api/delete-friends/${user.friendId}`)
            .then(res => {
                this.setState(() => ( {friends: res.data} ))
            }).catch(err => console.log(err))
        }
    }

    componentDidMount() {
        http.get('/api/get-all-friends')
        .then(res => this.setState(() => ( {friends: res.data})))
        .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="friends">
                <h1 className="frTitle">My friends</h1>
                <div className="fiendWrap">
                    {this.state.friends.length > 0 ? 
                    this.state.friends.map(user => {
                        return (
                            <div key={Math.random()} className="friendTab">
                                <img src={`${URL}/uploads/${user.friendImage}`} />
                                <p>{user.friendName}</p>
                                <FaUserAltSlash id="iconDel" onClick={() => {this.unfollow(user)}} />
                            </div>
                        )
                    })
                    :
                    <h3>No friends</h3>}
                </div>
            </div>
        )
    }
}

export default Friends