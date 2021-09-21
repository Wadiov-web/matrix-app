import { React, Component} from 'react'
import '../profile/profile.css'
import axios from 'axios'


class AboutVisited extends Component{
    constructor(props){
        super(props)
        this.state = {
            aboutMe: '',
        }
    }
    

    componentDidMount() {
        console.log('this.props.visitedId')
        console.log(this.props.visitedId)
        axios.get(`/api/get-visited-aboutMe/${this.props.visitedId}`)
        .then(res => {
            console.log(res)
            this.setState({aboutMe: res.data.aboutMe})
        }).catch(err => console.log(err))
    }

    render() {
        console.log('render sub component')

        return (
            <div className="side1">
                <div className="friendsNumber">
                    <h1>{this.state.friendsCount}</h1>
                    <p>Friends</p>
                </div>
                <div className="userText">

                    {this.state.aboutMe ?
                    <div>
                        <p id="aboutMe">About me</p>
                        <div className="edit">
                            <div className="parag">
                                <p>{this.state.aboutMe}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="save">
                        <h1>No about me info</h1>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default AboutVisited