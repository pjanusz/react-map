import React, { Component } from 'react'
import TheMap from './TheMap'
import Filters from './Filters'

export default class MapContainer extends Component {

    render() {
        const { google, markerChange, googleLocations } = this.props

        return (
            <div id="map-container" className="map-container" tabIndex="-1">
                <Filters googleLocations={googleLocations} />
                <main role="presentation"  aria-label="Map with interesting places locations" className="main-container" tabIndex="-1">
                    <TheMap 
                        google={google}
                        markerChange={markerChange} 
                    />
                </main>
            </div>
        )
    }
}