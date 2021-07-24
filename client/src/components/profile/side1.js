import { React, Component} from 'react'
import './profile.css'


class Side1 extends Component{
    state = {
        aboutMe: '',
        edit: false
    }
    componentDidMount() {
        // get about me info
    }
    aboutMe = () => {
        
    }


    edit = () => { this.setState(() => ({edit: !this.state.edit})) }

    render() {
        console.log('side1 component')
        return (
            <div className="side1">
                <div className="friendsNumber">
                    <h1>22</h1>
                    <p>Friends</p>
                </div>
                <div className="userText">
                    <p id="aboutMe">About me</p>

                    {this.state.aboutMe ?

                        this.state.edit ?
                        <div className="save">
                                <textarea>hello hello hello hello there hello there hello therehello t
                                </textarea>
                            <button onClick={this.edit}>Save</button>
                            <button onClick={this.edit}>cancel</button>
                        </div>
                        :
                        <div className="edit">
                            <div className="parag">
                                <p>hello hello hello hello there hello there hello therehello there </p>
                            </div>
                            <button onClick={this.edit}>Edit</button>
                        </div>
                    :
                    <div className="save">
                        <h1>Write what's in your mind</h1>
                            <textarea>
                            </textarea>
                        <button onClick={this.aboutMe}>Save</button>
                    </div>
                    }

                </div>

            </div>
        )
    }
}

export default Side1
