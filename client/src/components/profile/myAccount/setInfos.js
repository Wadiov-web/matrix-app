import React, { Component } from 'react'
import '../profile.css'

import axios from 'axios'
import {  FaEnvelope, FaGlobeAmericas, FaMapMarked, FaMapMarkerAlt, FaPhoneAlt, FaMapMarker, FaUser, FaKey } from 'react-icons/fa'



class SetInfos extends Component {
   // const {newPhone, newAddress, newEmail, newSite, newCity, newHometown} = req.body
    state = {
        newPhone: '',
        newAddress: '',
        newEmail: '',
        newSite: '',
        newCity: '',
        newHometown: ''
    }

    componentDidMount() {
        axios.get('/api/get-infos')
        .then(res => {
            this.setState(() => (
                {newPhone: res.data.contact.phone,
                newAddress: res.data.contact.address,
                newEmail: res.data.contact.email,
                newSite: res.data.contact.site,
                newCity: res.data.places.currentCity,
                newHometown: res.data.places.hometown}
            ))
        }).catch(err => console.log(err))
    }

    onChange = (e) => { this.setState({ [e.target.name]: e.target.value}) }
    submitInfos = (e) => {
        e.preventDefault()
        console.log(this.state)
        axios.post('/api/update-infos', this.state)
        .then(res => {
            this.setState(() => (
                {newPhone: res.data.contact.phone,
                newAddress: res.data.contact.address,
                newEmail: res.data.contact.email,
                newSite: res.data.contact.site,
                newCity: res.data.places.currentCity,
                newHometown: res.data.places.hometown}
            ))
        }).catch(err => console.log(err))
    }
   
    render() {

        return (
            <div className="setInfos">
                

                {/*<div className="accountInf">
                    <h3>Personal</h3>
                    <div class="flexit">
                        <FaUser className="infIcon" />
                        <p id="bold">Username:</p>
                        <input type="text" value="Tommy Storan" />
                    </div>
                    <div class="flexit">
                        <FaKey className="infIcon" />
                        <p id="bold">Password:</p>
                        <input type="password" value="sdsd" />
                    </div>
                    <div class="flexit">
                        <button>submit</button>
                    </div>
                </div>*/}
                    
                

                <form onSubmit={this.submitInfos}>
                    <div>
                        <div className="contactInf">
                            <h3>Contact</h3>
                            <div class="flexit">
                                <FaPhoneAlt className="infIcon"/>
                                <p id="bold">Phone:</p>
                                <input name="newPhone" type="text" value={this.state.newPhone} onChange={this.onChange} />
                            </div>
                            <div class="flexit">
                                <FaMapMarked className="infIcon"/>
                                <p id="bold">Address:</p>
                                <input name="newAddress" type="text" value={this.state.newAddress} onChange={this.onChange} />
                            </div>
                            <div class="flexit">
                                <FaEnvelope className="infIcon"/>
                                <p id="bold">Email:</p>
                                <input name="newEmail" type="text" value={this.state.newEmail} onChange={this.onChange} />
                            </div>
                            <div class="flexit">
                                <FaGlobeAmericas className="infIcon"/>
                                <p id="bold">Site:</p>
                                <input name="newSite" type="text" value={this.state.newSite} onChange={this.onChange} />
                            </div>
                        </div>

                        <div className="placesInf">
                            <h3>Places Lived</h3>
                            <div class="flexit">
                                <FaMapMarker className="infIcon"/>
                                <p id="bold">Current City:</p>
                                <input name="newCity" type="text" value={this.state.newCity} onChange={this.onChange} />
                            </div>
                            <div class="flexit">
                                <FaMapMarkerAlt className="infIcon"/>
                                <p id="bold">Hometown:</p>
                                <input name="newHometown" type="text" value={this.state.newHometown} onChange={this.onChange} />
                            </div>
                        </div>
                        <button type="submit">save changes</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default SetInfos