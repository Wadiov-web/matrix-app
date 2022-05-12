import { React, Component} from 'react'
import './profile.css'
import http from '../http/axios.config'

class Side1 extends Component{
    state = {
        aboutMe: '',
        input: '',
        friendsCount: '',
        edit: false
    }

    componentDidMount() {
        http.get('/api/get-aboutMe')
        .then(res => {
            this.setState({aboutMe: res.data.aboutMe, input: res.data.aboutMe, friendsCount: res.data.friendsCount})
        }).catch(err => console.log(err))
    }

    onChange = (e) => { this.setState({input: e.target.value})}
    save = () => {
        http.post('/api/update-aboutMe', {aboutMe: this.state.input})
        .then(res => {
            this.setState({aboutMe: res.data.aboutMe, input: res.data.aboutMe})
        }).catch(err => console.log(err))
    }

    edit = () => { this.setState(() => ({edit: !this.state.edit})) }

    render() {
        return (
            <div className="side1">
                <div className="friendsNumber">
                    <h1>{this.state.friendsCount}</h1>
                    <p>Friends</p>
                </div>
                <div className="userText">
                    <p id="aboutMe">About me</p>
                    {this.state.aboutMe ?
                        this.state.edit ?
                            <div className="save">
                                <textarea value={this.state.input} onChange={this.onChange} ></textarea>
                                <button onClick={() => {
                                    this.edit()
                                    this.save()
                                    }}>Save</button>
                                <button onClick={() => {
                                    this.setState({input: this.state.aboutMe})
                                    this.edit()
                                }}>cancel</button>
                            </div>
                        :
                            <div className="edit">
                                <div className="parag">
                                    <p>{this.state.aboutMe}</p>
                                </div>
                                <button onClick={this.edit}>Edit</button>
                            </div>
                    :
                        <div className="save">
                            <h1>Write what's in your mind</h1>
                            <textarea value={this.state.input} onChange={this.onChange} ></textarea>
                            <button onClick={this.save}>Save</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Side1