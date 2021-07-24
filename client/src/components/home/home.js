import React, { Component } from 'react';
import './home.css';
import './mymsgs.css';
import Suggested from './suggests';
import Chat from './chat';
import axios from 'axios';


class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            users: [],
            openChat: '',
            myMsgUser: false,
            concernedFriend: null,
            red: false
        }
    }
    
    switchStatus = (user) => {
        this.setState(() => ({ 
            myMsgUser: true, concernedFriend: user, openChat: user.friendName, red: true,
            users: this.state.users.map(elmt => {
                if(user.friendName === elmt.friendName){
                    if (elmt.news == true) {
                        // Turn to false on client
                        elmt.news = false
                        // Turn to false on server
                        axios.post('/api/remove-news', {
                            friendId: elmt.friendId
                        })
                    }
                }
                return elmt
            })
        }))
    }

    closeChat = () => {
        this.setState(() =>( { myMsgUser: false, openChat: '' }))
    }

    componentDidMount(){
        // Fetch friends from the backend
        axios.get('/api/get-friends')
        .then(res => {
            this.setState(()=> (
                {users: res.data}
            ))
        }).catch(err => console.log(err))

        // receive news
        this.props.socketHome.on('newMsg', packet => {
            if (packet.from !== this.state.openChat) {
                console.log('from news it is RED now')
                console.log(packet)
                // turn it into red
                this.setState(() => ({
                    users: this.state.users.map(elmt => {
                        if(packet.from === elmt.friendName){
                            // Turn to true on client
                            elmt.news = true
                            // Turn to true on server
                            axios.post('/api/add-news', {
                                friendId: elmt.friendId
                            })
                        }
                        return elmt
                    })
                }))
            }
        })
    }


    render() {
        console.log('home render.......')
        console.log(this.state.openChat)
        
        const chatMsg = this.state.myMsgUser ? 
        (<Chat 
            concernedOne={this.state.concernedFriend} 
            closeOff={this.closeChat} 
            socketChat={this.props.socketHome}
            loggedIn={this.props.loggedIn}
        />)
        : null;

        return (
            <div className="activities">
                
                <div className="div1">
                    <h1>My messages</h1>
                    <div className="mssg">
                        <div id="space">
                            <p id="tag">Friends</p>
                        </div>

                        {this.state.users.length > 0 ? this.state.users.map(user => {
                            if (user.news && !user.connected) {
                                return <div id="friend"
                                onClick={this.switchStatus.bind(this, user)}  >
                                           {/* <img src="" /> */}
                                           <p id="msgname">{user.friendName}</p>
                                           <p id="news">new</p>
                                       </div>
                            }
                            if (user.connected && !user.news) {
                                return <div id="friend"
                                onClick={this.switchStatus.bind(this, user)}  >
                                           <div id="connect"></div>
                                           {/* <img src="" /> */}
                                           <p id="msgname">{user.friendName}</p>
                                       </div>
                            }
                            if (user.news && user.connected) {
                                return <div id="friend"
                                onClick={this.switchStatus.bind(this, user)}  >
                                           <div id="connect"></div>
                                           {/* <img src="" /> */}
                                           <p id="msgname">{user.friendName}</p>
                                           <p id="news">new</p>
                                       </div>
                            }                    
                            if (!user.news && !user.connected){
                                return <div id="friend"
                                onClick={this.switchStatus.bind(this, user)}  >
                                          
                                           {/* <img src="" /> */}
                                           <p id="msgname">{user.friendName}</p>
                                           
                                       </div>
                            }
                            
                        }) : <h2>no friends so far</h2>}
                    </div>
                </div>

                <Suggested getVisited={this.props.getVisited} />
                {chatMsg}
            </div>
        );
    }
}

export default Home;