import React, { Component } from 'react'
import './chat.css'
import axios from 'axios'

class Chat extends Component {
    constructor(props){
        super(props)
        this.state = {
            chatUser: '',
            image: '',
            input: '',
            previousMsgs: [],
            messages: []
        }
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

    onChange = (e) => { this.setState({input: e.target.value})}
    imageHandler= (e) => { this.setState({filename: e.target.value})}

    getPreviousMsg = () => {
        // Fetch messages of that specific friend with ID
        axios.get(`/api/get-msgs/${this.props.concernedOne.friendId}`)
        .then(res => {
            if(res.status === 200) {
                this.setState(() => ({previousMsgs: res.data, chatUser: this.props.concernedOne.friendName }))
            } else {
                this.setState(() => ({chatUser: this.props.concernedOne.friendName}))
            }
        }).catch(err => console.log(err)) 
    }

    componentDidMount() {  // one render
        this.getPreviousMsg()

        // receive current messages
        this.props.socketChat.on('incoming', packet => {
            console.log('mesg received')
            console.log(packet)
            if (packet.from === this.state.chatUser) {
                this.setState(() => ({messages: [...this.state.messages, {him: packet.msg}]}))
            }
        })
    }

    componentDidUpdate(prevProps) {  // one render
        // fetch msgs
        if(this.props.concernedOne.friendName !== prevProps.concernedOne.friendName) {
            this.getPreviousMsg()
        }
    }

    render() {
        return (
            <div className="div3">
                <h1>Chat</h1>
                <p style={{color: 'white'}}>{this.state.chatUser}</p>
                <button onClick={this.props.closeOff} id="close">X</button>

                <div className="chat">
                    {this.state.previousMsgs.map(previous => {
                    if (previous.me) {
                        return(
                        <div id="senderMsg">
                            <div id="data">
                                <p id="mymsg">{previous.me}</p>
                            </div>
                        </div>)
                    } else {
                        return (
                        <div id="incomingMsg">
                            <div id="income">
                                <p id="mymsg">{previous.him}</p>
                            </div>
                        </div>)
                    }})}

                    {this.state.messages.map(message => {
                    if(message.me){
                        return(
                        <div id="senderMsg">
                            <div id="data">
                                <p id="mymsg">{message.me}</p>
                            </div>
                        </div>)
                    } else {
                        return(
                        <div id="incomingMsg">
                            <div id="income">
                                <p id="mymsg">{message.him}</p>
                            </div>
                        </div>)
                    }})}
                </div>

                <form onSubmit={this.sendMsg}>
                    <input type="text" value={this.state.input} onChange={this.onChange} id="msg" />
                    <input type="file" id="file" value={this.state.image} onChange={this.imageHandler} />
                    <button id="send" type="submit">send</button>
                </form>
            </div>
        )
    }
}

export default Chat;