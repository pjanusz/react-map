import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as data from './data'
import Marker from './MyMarker'
import styles from './styles'

class TheMap extends Component {

    componentDidMount() { 
        this.loadMap()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.google !== this.props.google) {
          this.loadMap()
        }
    }
    
    loadMap() {
        if (this.props && this.props.google) {
            const {google} = this.props
            const maps = google.maps

            const mapRefs = this.refs.map
            const mapElem = ReactDOM.findDOMNode(mapRefs)

            //map config
            const { lat, lng } = data.hometown
            const center = new maps.LatLng(lat, lng)
            const theMap = Object.assign({}, {
                zoom: 15,
                center: center,
                styles: styles,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_CENTER
                }
            })
            
            //the map            
            this.map = new maps.Map(mapElem, theMap)
            //bounds
            this.bounds = new google.maps.LatLngBounds()
            //infoWindow
            this.myInfoWindow = new google.maps.InfoWindow()

            //force update to get map
            this.forceUpdate()
        } else {
            global.gm_authFailure();
        }
    }

    render() {

        const { markerChange } = this.props

        return (
            <div tabIndex="-1" ref='map' style={{
                width: '100vw',
                height: '100vh'
            }}>    
                LOADING
                {data.places.map( (place, index) => (
                    <Marker
                        tabIndex="-1"
                        key={index} 
                        google={this.props.google}
                        map={this.map}
                        name={place.name}
                        position={place.coords} 
                        bounds={this.bounds}
                        myInfoWindow={this.myInfoWindow}
                        markerChange={markerChange} 
                    />
                ))}
            </div>
        )
    }
}

export default TheMap