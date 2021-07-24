import React, { Component } from 'react'
import '../profile.css'

import axios from 'axios'
import {  FaEnvelope, FaGlobeAmericas, FaMapMarked, FaMapMarkerAlt, FaPhoneAlt, FaMapMarker, FaUser, FaKey } from 'react-icons/fa'



class SetInfos extends Component {

    state = {
       
    }

   
    render() {

        return (
            <div className="setInfos">
                

                <div className="accountInf">
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
                </div>
                    
                


                <div>
                
                    <div className="contactInf">
                        <h3>Contact</h3>
                        <div class="flexit">
                            <FaPhoneAlt className="infIcon"/>
                            <p id="bold">Phone:</p>
                            <input type="text" value="021548663636" />
                        </div>
                        <div class="flexit">
                            <FaMapMarked className="infIcon"/>
                            <p id="bold">Address:</p>
                            <input type="text" value="TommyStoranhotmai" />
                        </div>
                        <div class="flexit">
                            <FaEnvelope className="infIcon"/>
                            <p id="bold">Email:</p>
                            <input type="text" value="TommyStoran@hotmail.com" />
                        </div>
                        <div class="flexit">
                            <FaGlobeAmericas className="infIcon"/>
                            <p id="bold">Site:</p>
                            <input type="text" value="www.TommyStoran.com" />
                        </div>
                    </div>

                
                    <div className="placesInf">
                        <h3>Places Lived</h3>
                        <div class="flexit">
                            <FaMapMarker className="infIcon"/>
                            <p id="bold">Current City:</p>
                            <input type="text" value="new york" />
                        </div>
                        <div class="flexit">
                            <FaMapMarkerAlt className="infIcon"/>
                            <p id="bold">Hometown:</p>
                            <input type="text" value="Tomm" />
                        </div>
                    </div>

                    <button>save changes</button>

                </div>

            </div>
        )
    }
}

export default SetInfos