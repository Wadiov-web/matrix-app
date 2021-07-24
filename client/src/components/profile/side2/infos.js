import { React, Component} from 'react'
import '../profile.css'
import { FaBirthdayCake, FaEnvelope, FaGlobeAmericas, FaMale, FaMapMarked, FaMapMarkerAlt, FaPhoneAlt, FaMapMarker, FaFemale } from 'react-icons/fa'


class Infos extends Component{
    state = {
      account: {email: 'helloworld@gmail.com'},
      contact: {phone: '+192-548-254-541', address: 'NYC fifth avenue 15 Street', email: 'hello@gmail.com', site: 'www.hello.com'},
      places: {currentCity: 'New York', homeTown: 'Silicon Vally'},
      basics: {birthday: '01/01/1999', gender: 'Male'}
    }

    componentDidMount(){
        //this.setState({places: {currentCity: 'New York', homeTown: 'Silicon Vally'}})
    }

    render() {
       
        return (
            
            <div className="infos">
            
                <div className="accountInf">
                    <h3>Account</h3>
                    <div class="flexit">
                        <FaEnvelope className="infIcon" />
                        <p id="bold">Email-address:</p>
                        <p>{this.state.account.email}</p>
                    </div>
                    
                </div>



                {this.state.contact ?
                    <div className="contactInf">
                        <h3>Contact</h3>
                        <div class="flexit">
                            <FaPhoneAlt className="infIcon"/>
                            <p id="bold">Phone:</p>
                            <p>{this.state.contact.phone}</p>
                        </div>
                        <div class="flexit">
                            <FaMapMarked className="infIcon"/>
                            <p id="bold">Address:</p>
                            <p>{this.state.contact.address}</p>
                        </div>
                        <div class="flexit">
                            <FaEnvelope className="infIcon"/>
                            <p id="bold">Email:</p>
                            <p>{this.state.contact.email}</p>
                        </div>
                        <div class="flexit">
                            <FaGlobeAmericas className="infIcon"/>
                            <p id="bold">Site:</p>
                            <p>{this.state.contact.site}</p>
                        </div>
                    </div> : null}

                {this.state.places ?
                    <div className="placesInf">
                        <h3>Places Lived</h3>
                        <div class="flexit">
                            <FaMapMarker className="infIcon"/>
                            <p id="bold">Current City:</p>
                            <p>{this.state.places.currentCity}</p>
                        </div>
                        <div class="flexit">
                            <FaMapMarkerAlt className="infIcon"/>
                            <p id="bold">Hometown:</p>
                            <p>{this.state.places.homeTown}</p>
                        </div>
                    </div> : null}

                <div className="basicInf">
                    <h3>Basic Infos</h3>
                    <div class="flexit">
                        <FaBirthdayCake className="infIcon"/>
                        <p id="bold">Birthday:</p>
                        <p>{this.state.basics.birthday}</p>
                    </div>
                    <div class="flexit">
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

export default Infos