import React, { Component } from 'react'
import './visitedProfile.css'
import {FaUserCheck, FaUserPlus, FaEnvelope} from 'react-icons/fa'
import {FiArrowUpRight, FiArrowDownLeft} from 'react-icons/fi'
import AboutVisited from './aboutVisited'
import VisitedInfos from './visitedInfos'
import http from '../http/axios.config'
import URL from '../http/URL'

class Visited extends Component {
    constructor(props){
        super(props)	   
        this.state = {
            input: '',
            visited: '',
            isFriend: false,
            form: false,
            success: '',
            searchedOne: ''
        }
    }
   
    getVisitedInfos = () => {
        let path = this.props.location.pathname
        let searchedOne = path.slice(16, path.length)
        http.post('/api/search-user', {username: searchedOne})
        .then(res => {
            if(res.status === 200) {
                this.setState(() => ({visited: res.data}))
            }
        }).catch(err => console.log(err)) 
    }

    componentDidMount() {
        this.getVisitedInfos()
    }

    openForm = () => {this.setState(() => ({form: true}))}
    closeForm = () => {this.setState(() => ({form: false}))}

    onChange = (e) => { this.setState({input: e.target.value}) }

    sendMessage = (e) => {
        e.preventDefault()
        if(this.state.input !== '') {
            http.post('/api/start-message', {to: this.state.visited.searchedId, msg: this.state.input})
            this.setState(() => ({success: 'Message is sent', input: ''}))
            setTimeout(() => this.setState(() => ( {success: ''})), 3000)
        }
    }
    
    render() {
        return (
            <div className="visitedDiv">
                {(() => {
                    if(this.state.visited.status === 'suggested'){
                        return (
                        <div className="tab1">
                            <img src={`${URL}/uploads/${this.state.visited.searchedImage}`} />
                            <h1>{this.state.visited.username}</h1>
                            <div className="status">
                                <button className="sendOff" onClick={(e) => {
                                    if(e.target.className == "sendOff") {
                                        e.target.className = "sendOn"
                                        http.post(`/api/send-invitation/${this.state.visited.searchedId}`)
                                        .then(res => {
                                            if(res.status == 200){
                                                e.target.innerText = "sent"
                                                e.target.className = "complet"
                                            }
                                        }).catch(err => console.log(err))
                                    }
                                }}><p>match</p><FaUserPlus className="msgIcon"/></button>
                            </div>
                        </div>)
                    }
                    if(this.state.visited.status === 'userFriends'){
                        return(
                        <div className="tab1">
                            <img src={`${URL}/uploads/${this.state.visited.searchedImage}`} />
                            <h1>{this.state.visited.username}</h1>
                            <div className="status">
                                <button className="statusInfo">
                                    <p>{this.state.visited.status}</p>
                                    <FaUserCheck className="msgIcon"/>
                                </button>
                            </div>
                            <div className="msgDiv">
                                <button className="startMsg" onClick={() => {this.openForm()}}>
                                    <FaEnvelope className="msgIcon" />
                                    <p>Message</p>
                                </button>
                            </div>
                            <div className={this.state.form ? "writeMsg" : "writeMsgOff"}>
                                <p id="closeDiv" onClick={this.closeForm}>close</p>
                                <div id="succDiv">
                                    <p id="success">{this.state.success}</p>
                                </div>
                                <form onSubmit={this.sendMessage}>
                                    <input type="text" value={this.state.input} onChange={this.onChange} />
                                    <button type="submit">send</button>
                                </form>
                            </div>
                        </div>)
                    }
                    if(this.state.visited.status === 'requestIsSent'){
                        return (
                        <div className="tab1">
                            <img src={`${URL}/uploads/${this.state.visited.searchedImage}`} />
                            <h1>{this.state.visited.username}</h1>
                            <div className="status">
                            <button className="statusInfo">
                                <p>{this.state.visited.status}</p> 
                                <FiArrowUpRight className="msgIcon"/>
                            </button>
                            </div>
                        </div>)
                    }
                    if(this.state.visited.status === 'newInvitations'){
                        return(
                        <div className="tab1">
                            <img src={`${URL}/uploads/${this.state.visited.searchedImage}`} />
                            <h1>{this.state.visited.username}</h1>
                            <div className="status">
                                <button className="statusInfo">
                                    <p>{this.state.visited.status}</p> 
                                    <FiArrowDownLeft className="msgIcon"/>
                                </button>
                            </div>
                        </div>)
                    }
                })()}
                <div className="sidesContainer">
                    {this.state.visited ?
                    <React.Fragment>
                        <AboutVisited visitedId={this.state.visited.searchedId} />
                        <VisitedInfos visitedId={this.state.visited.searchedId} />
                    </React.Fragment>
                    : null}
                </div>
            </div>
        )
    }
}

export default Visited