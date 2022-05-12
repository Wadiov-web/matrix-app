import React, { Component } from 'react'
import './chat.css'
import { FaImage } from 'react-icons/fa'
import '../profile/profile.css'
import http from '../http/axios.config'

class Chat extends Component {
    constructor(props){
        super(props)
        this.state = {
            chatUser: '',
            image: '',
            input: '',
            previousMsgs: [],
            messages: [],
	        error: '',
            viewImage: false,
            image: ''
        }
    }
    sendMsg = (e) => {
        e.preventDefault();
       	const st = this.state
        if(!st.input && !st.image){
            this.setState({error: 'input is empty'})
            setTimeout(() => this.setState({error: ''}), 3000)
        } 
        if(st.input && st.image){
            this.setState({error: 'input are both full'})          		
            setTimeout(() => this.setState({error: ''}), 3000) 
        }
        if(st.input) {
            // send message
            this.props.socketChat.emit('private', {
                from: this.props.loggedIn,
                to: this.props.concernedOne.friendId,
                msg: this.state.input,
                type: 'text'
            })
            this.setState({messages: [...this.state.messages, {me: st.input}]})		                                         
        }
        if(st.image){
            if(st.image.type === 'image/jpeg' || st.image.type === 'image/png'){
                const file = this.state.image
                const fr = new FileReader()
                fr.readAsDataURL(file)
                fr.onload = () => {                           
                    this.props.socketChat.emit('private', {
                        from: this.props.loggedIn,
                        to: this.props.concernedOne.friendId,
                        msg: fr.result,
                        type: 'image'
                    })
                    this.setState({messages: [...this.state.messages, {imgMe: fr.result}]});
                }
            } else {
                this.setState({error: 'file type should be jpeg or png'})
                setTimeout(() => this.setState({error: ''}), 3000)
            }
        }
    }

    onChange = (e) => { this.setState({input: e.target.value})}
    imageHandler = (e) => this.setState( {image: e.target.files[0]})
    
    getPreviousMsg = () => {
        // Fetch messages of that specific friend with ID
        http.get(`/api/get-msgs/${this.props.concernedOne.friendId}`)
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
            if (packet.from === this.state.chatUser){
                let mes
                if(packet.type === 'text'){ mes = { him: packet.msg }}
                if(packet.type === 'image'){ mes = { imgHim: packet.msg }}
                this.setState(() => ({messages: [...this.state.messages, mes]}))
            }
        })
    }

    componentDidUpdate(prevProps) {  // one render
        // fetch msgs
        if(this.props.concernedOne.friendName !== prevProps.concernedOne.friendName) {
            this.getPreviousMsg()
        }
    }

    viewImage = (e) => this.setState({image: e.target.src, viewImage: true})
    closeVI = () => { this.setState(() => ( {viewImage: false} ))}

    render() {
        return (
            <div className="div3">
                <h1>Chat</h1>
                <p style={{color: 'white'}}>{this.state.chatUser}</p>
		        <p style={{color: 'red'}}>{this.state.error}</p>
                <button onClick={this.props.closeOff} id="close">X</button>

                <div className="chat">
                    {this.state.previousMsgs.map(previous => {
                    if (previous.me) {
                        return(
                        <div key={Math.random()} id="senderMsg">
                            <div id="data">
                                <p id="mymsg">{previous.me}</p>
                            </div>
                        </div>)
                    } 
                    if (previous.imgMe) {
                        return(
                        <div key={Math.random()} id="senderMsg">
                            <div id="data">
                                <img onClick={this.viewImage} id="chatImg" src={previous.imgMe} />
                            </div>
                        </div>)
                    } 
		            if(previous.him) {
                        return (
                        <div key={Math.random()} id="incomingMsg">
                            <div id="income">
                                <p id="mymsg">{previous.him}</p>
                            </div>
                        </div>)
                    }
                    if (previous.imgHim) {
                        return(
                        <div key={Math.random()} id="incomingMsg">
                            <div id="income">
                                <img onClick={this.viewImage} id="chatImg" src={previous.imgHim} />
                            </div>
                        </div>)
                    } 
		            })}
                    {this.state.messages.map(message => {
                    if(message.me){
                        return(
                        <div key={Math.random()} id="senderMsg">
                            <div id="data">
                                <p id="mymsg">{message.me}</p>
                            </div>
                        </div>)
                    }
                    if(message.imgMe){
                        return(
                        <div key={Math.random()} id="senderMsg">
                            <div id="data">
                                <img onClick={this.viewImage} id="chatImg" src={message.imgMe} />
                            </div>
                        </div>)
                    }                                         
		            if(message.him) {
                        return(
                        <div key={Math.random()} id="incomingMsg">
                            <div id="income">
                                <p id="mymsg">{message.him}</p>
                            </div>
                        </div>)
                    }
                    if(message.imgHim){
                        return(
                        <div key={Math.random()} id="incomingMsg">
                            <div id="income">
                                <img onClick={this.viewImage} id="chatImg" src={message.imgHim} />
                            </div>
                        </div>)
                    }})}
                </div>
                <form onSubmit={this.sendMsg}>
                    <input type="text" value={this.state.input} onChange={this.onChange} id="msg" />
                    <input id="fileInput" type="file" id="file" onChange={this.imageHandler} />
		            <FaImage />
                    <button id="send" type="submit">send</button>
                </form>
                {this.state.viewImage ?
                <div className="viewModal">
                    <div onClick={this.closeVI}>X</div>
                    <h1>view Image</h1>
                    <img src={this.state.image} />
                </div> : null}
            </div>
        )
    }
}

export default Chat;
