import React, {
    Component
} from 'react'
import {
    GoogleApiWrapper
} from 'google-maps-react'
import './App.css'
import * as data from './components/data'
import MapContainer from './components/MapContainer'
import Search from './components/Search'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            googleLocations: []
        }
        this.googleMarkers = [];
        this.markerChange = this.markerChange.bind(this);
        this.queryHandler = this.queryHandler.bind(this);
        global.gm_authFailure = () => {
            let mapEl = document.getElementById('map-container')
            mapEl.innerHTML = `
                <div class="error-message">
                    <h2>Google maps API Error!</h2>
                    <p>Map failed to load, please check browser's console for more information.</p>
                </div>
            `;
        };
    }

    markerChange(marker) {

        this.googleMarkers.push(marker);

        if (this.googleMarkers.length === data.places.length) {
            this.setState({
                googleLocations: this.googleMarkers
            })
        }
    }

    queryHandler(query) {
        let result = this.state.googleLocations.map(place => {
            let matched = place.props.name.toLowerCase().indexOf(query) >= 0;
            if (place.marker) {
                place.marker.setVisible(matched);
            }

            return place;
        })

        this.setState({
            googleLocations: result
        });
    }

    render() {
        return ( <
            div className = "App" >
            <
            Search queryHandler = {
                this.queryHandler
            }
            /> <
            MapContainer googleLocations = {
                this.state.googleLocations
            }
            google = {
                this.props.google
            }
            markerChange = {
                this.markerChange
            }
            /> <
            /div>
        );
    }
}

//google API key
export default GoogleApiWrapper({
    apiKey: '', //google API key
})(App)