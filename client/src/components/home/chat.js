import React, { Component } from 'react';
import './chat.css';
import axios from 'axios';
import Img from './wadiov.jpeg';

class Chat extends Component {
    constructor(props){
        console.log('chat constructor')
        super(props)
        this.state = {
            userInf: {},
            chatUser: '',
            image: '',
            input: '',
            incomingPic: '',
            previousMsgs: [],
            messages: []
        }
    }
    

    getPreviousMsg = () => {
       // Fetch messages of that specific friend with ID
       axios.get(`/api/get-msgs/${this.props.concernedOne.friendId}`)
        .then(res => {
            console.log(res)
            if(res.status == 204) {
                console.log('No conversations')
                this.setState(() => (
                    {chatUser: this.props.concernedOne.friendName }
                ))
            } else {
                console.log('chat CDM')
                console.log(res)
                this.setState(() => (
                    {previousMsgs: res.data, chatUser: this.props.concernedOne.friendName }
                ))
                
            }    
        }).catch(err => console.log(err)) 
    }
    

    sendMsg = (e) => {
        e.preventDefault();

        if (this.state.input === '' && this.state.image === '') {
            console.log('cannot send both emty');
        } else if (this.state.input !== '' && this.state.image !== '') {
            console.log('cannot send both full');
        } else {
            if (this.state.input === '') {
               console.log(this.state.image);
               this.setState({image: 'kkkk'});
            } else {
                console.log(this.state.input);
                const msg = { me: this.state.input}
                this.setState({messages: [...this.state.messages, msg]});
                console.log(this.state.messages);
                
                //send message
                
                this.props.socketChat.emit('private', {
                    from: this.props.loggedIn,
                    to: this.props.concernedOne.friendId,
                    msg: this.state.input
                })

                this.setState({input: ''});
            }
        }
    }

    onChange = (e) => {
        this.setState({input: e.target.value});
    }
    
    imageHandler= (e) => {
        this.setState({filename: e.target.value});
    }

    componentDidMount() {  // one render
        console.log('--------------------')
        console.log('did mount')
        console.log(this.props.concernedOne.friendName)
        console.log('------------------------------')
        

        this.getPreviousMsg()

        // receive message 
        this.props.socketChat.on('incoming', packet => {
            console.log('mesg received')
            console.log(packet)
            if (packet.from == this.state.chatUser) {
                this.setState(() => (
                    {messages: [...this.state.messages, {him: packet.msg}]}
                ))
            } else {
                console.log('chat user is not open')
            }
        })
    }




    componentDidUpdate(prevProps) {  // one render
        console.log('component did update')
        console.log(this.props.concernedOne.friendName)
        console.log('prevProps ', prevProps)
        console.log('-------------------------------')
        // fetch msgs
        if(this.props.concernedOne.friendName !== prevProps.concernedOne.friendName) {
            
            //     axios.get(`/api/get-msgs/${this.props.concernedOne.friendId}`)
            //     .then(res => {
            //         console.log(res)
            //         if(res.status == 204) {
            //             console.log('No conversations')
            //             this.setState(() => (
            //                 {previousMsgs: [], messages: [], chatUser: this.props.concernedOne.friendName }
            //             ))
            //         } else {
            //             this.setState(() => (
            //                 {previousMsgs: res.data, messages: [], chatUser: this.props.concernedOne.friendName }
            //             ))
            //         }
            //    })
            this.getPreviousMsg()
            
        }
    }
    

    render() {
        console.log('chat render......')
        //console.log(this.props.concernedOne.friendName)
        //console.log('chatUser = ' + this.state.chatUser)
        return (
            <div className="div3">
                <h1>Chat</h1>
                <p style={{color: 'white'}}>{this.state.chatUser}</p>
                <button onClick={this.props.closeOff} id="close">X</button>

                <div className="chat">

                    {this.state.previousMsgs.map(previous => {
                          if (previous.me){
                            return (
                                <div id="senderMsg">
                                    <div id="data">
                                        <p id="mymsg">{previous.me}</p>
                                    </div>
                                </div> )
                          } else {
                            return (<div id="incomingMsg">
                                    <div id="income">
                                        <p id="mymsg">{previous.him}</p>
                                    </div>
                                </div>)
                          }
                    })}

                    {this.state.messages.map(message => {
                          if(message.me){
                            return (
                                <div id="senderMsg">
                                    <div id="data">
                                        <p id="mymsg">{message.me}</p>
                                    </div>
                                </div> )
                          }else {
                            return (<div id="incomingMsg">
                                    <div id="income">
                                        <p id="mymsg">{message.him}</p>
                                    </div>
                                </div>)
                          }
                    })}
                </div>

                <form onSubmit={this.sendMsg}>
                    <input type="text" value={this.state.input} onChange={this.onChange} id="msg" />
                    <input type="file" id="file" value={this.state.image} onChange={this.imageHandler} />
                    <button id="send" type="submit">send</button>
                </form>
                
            </div>
        );
    }
}

export default Chat;