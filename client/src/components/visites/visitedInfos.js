import { React, Component} from 'react'
import '../profile/profile.css'
import { FaBirthdayCake, FaEnvelope, FaGlobeAmericas, FaMale, FaMapMarked, FaMapMarkerAlt, FaPhoneAlt, FaMapMarker, FaFemale } from 'react-icons/fa'
import http from '../http/axios.config'

class VisitedInfos extends Component {
    constructor(props){
        super(props)
        this.state = {
            basics: {},
            contact: {},
            places: {}
        }
    }

    componentDidMount(){
        http.get(`/api/get-visited-infos/${this.props.visitedId}`)
        .then(res => {
            this.setState(() => ({basics: res.data.basics, contact: res.data.contact, places: res.data.places}))
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <div className="infos">
                {this.state.contact ?
                    <div className="contactInf">
                        <h3>Contact</h3>
                        <div className="flexit">
                            <FaPhoneAlt className="infIcon"/>
                            <p id="bold">Phone:</p>
                            <p>{this.state.contact.phone}</p>
                        </div>
                        <div className="flexit">
                            <FaMapMarked className="infIcon"/>
                            <p id="bold">Address:</p>
                            <p>{this.state.contact.address}</p>
                        </div>
                        <div className="flexit">
                            <FaEnvelope className="infIcon"/>
                            <p id="bold">Email:</p>
                            <p>{this.state.contact.email}</p>
                        </div>
                        <div className="flexit">
                            <FaGlobeAmericas className="infIcon"/>
                            <p id="bold">Site:</p>
                            <p>{this.state.contact.site}</p>
                        </div>
                    </div> : null}
                {this.state.places ?
                    <div className="placesInf">
                        <h3>Places Lived</h3>
                        <div className="flexit">
                            <FaMapMarker className="infIcon"/>
                            <p id="bold">Current City:</p>
                            <p>{this.state.places.currentCity}</p>
                        </div>
                        <div className="flexit">
                            <FaMapMarkerAlt className="infIcon"/>
                            <p id="bold">Hometown:</p>
                            <p>{this.state.places.hometown}</p>
                        </div>
                    </div> : null}
                <div className="basicInf">
                    <h3>Basic Infos</h3>
                    <div className="flexit">
                        <FaBirthdayCake className="infIcon"/>
                        <p id="bold">Birthday:</p>
                        <p>{this.state.basics.birthday}</p>
                    </div>
                    <div className="flexit">
                        <FaMale className="infIcon"/>
                        <FaFemale className="infIcon"/>
                        <p id="bold">Gender:</p>
                        <p>{this.state.basics.gender}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default VisitedInfos