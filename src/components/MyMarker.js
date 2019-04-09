import { Component } from 'react'
import PropTypes from 'prop-types'

class MyMarker extends Component {

    componentDidUpdate(previousProps) {
        if ((this.props.map !== previousProps.map) ||
            (this.props.position !== previousProps.position)) {
            this.renderMarker()
        }
    }

    renderMarker() {
        if (this.marker) {
            this.marker.setMap(null)
        }

        let { map, google, markerChange, bounds, position, myInfoWindow  } = this.props
        let markerIcon = this.myMarkerIcon('00ff00')      
        let pos = position

        position = new google.maps.LatLng(pos.lat, pos.lng)
        const pref = {
            map: map,
            position: position,
            icon: markerIcon
        }

        this.marker = new google.maps.Marker(pref)
        const marker = this.marker

    // Create an onclick event to open the large infoWindow at each marker.
        let self = this
        marker.addListener('click', function() {
            self.showInfo(this, myInfoWindow)
        })

        markerChange(this)
        map.fitBounds(bounds)
        bounds.extend(marker.position)
    }

    showInfo(marker, infoWindow) {
        // check already opened marker
        if (infoWindow.marker !== marker) {
            let { map, google, bounds, name } = this.props
            //click animation - bounce
            marker.setAnimation(google.maps.Animation.BOUNCE)
            setTimeout(function() {
                marker.setAnimation(null)
            }, 1400)

            infoWindow.setContent('<<< LOADING >>>')
            //foursquare API request
            let placeId
            let tips
            fetch(`https://api.foursquare.com/v2/venues/search?ll=50.064650,19.944980&v=20180630&query=${name}&limit=1&client_id=UALPUP1A4IL53WHDK1RE3SSWVRGGZX5Z3J2SVLMPK14PO5P0&client_secret=TYOOX2Q05QBXYBZTYKRCTVQYEHWETCDK15MFLAKTJB5YSEMM`)
                .then(response => response.json())
                .then(data => {
                    placeId = data.response.venues[0].id
                    return fetch(`https://api.foursquare.com/v2/venues/${placeId}/tips?v=20180630&limit=2&client_id=UALPUP1A4IL53WHDK1RE3SSWVRGGZX5Z3J2SVLMPK14PO5P0&client_secret=TYOOX2Q05QBXYBZTYKRCTVQYEHWETCDK15MFLAKTJB5YSEMM`)
                })
                .then(response => response.json())
                .then(foursquareTips => {
                    tips = foursquareTips
                    return fetch(`https://api.foursquare.com/v2/venues/${placeId}/photos?v=220180630&limit=2&client_id=UALPUP1A4IL53WHDK1RE3SSWVRGGZX5Z3J2SVLMPK14PO5P0&client_secret=TYOOX2Q05QBXYBZTYKRCTVQYEHWETCDK15MFLAKTJB5YSEMM`)
                })
                .then(response => response.json())
                .then(foursquarePhotos => addFoursquareInfo(tips, foursquarePhotos))
                .catch(error => console.log(error)
                )

            //if success
            function addFoursquareInfo(tips, foursquarePhotos) {
                let infoContent = '' //reslut html code for infowindow
                const tipsList = tips.response.tips ? tips.response.tips.items : tips.meta.code //check for items in tips
                const photosList = foursquarePhotos.response.photos ? foursquarePhotos.response.photos.items : foursquarePhotos.meta.code //and photos, if there is an error get error code

                infoContent += `<h4>${name}</h4>` //set info window header
                if (tips.meta.code === 200 && foursquarePhotos.meta.code === 200) { //check for OK code, if quote limit exceeded code will be 429, other codes for other errors
                    //Photos
                    infoContent += '<h6 tabIndex="-1"> Photos </h6> <div id="infowindow-photos" tabIndex="-1">' //photo header and div content open
                    if (photosList.length !== 0) { //check for photos in the array
                        for (let i = 0; i < photosList.length; i++) { //add photos
                        const photo = photosList[i]
                        infoContent += `<img alt="${name}" class="infowindow-photos" src="${photo.prefix}120x120${photo.suffix}" />`
                        }
                    } else { //if photos array is empty
                        infoContent += `<p tabIndex="-1">No photos for this place</p>`
                    }

                    //Tips
                    infoContent += '</div><h6 tabIndex="-1"> Tips </h6><ul>' //close photo content, set header for tips, open list
                    if (tipsList.length !== 0){ //if there are tips add them to list
                        tipsList.forEach(tip => { //add tips to list
                            infoContent += `<li tabIndex="-1"><p tabIndex="-1">${tip.text}</p></li>`
                        })
                    } else { //"there is no spoon" ekhm... tip (if tips array is empty)
                        infoContent += '<li tabIndex="-1"><p tabIndex="-1">No tips for this place</p></li>'
                    }
                    infoContent += '</ul>' //close list
                } else {
                    /*error handler, if code is not 200, function will give error code and link to check what it mean,
                    error will be displayed in infowindow and browser's console*/
                    infoContent += `
                    <p class="foursquare-error" tabIndex="-1">Foursquare API error: ${tips.meta.code}, check 
                    <a href="https://developer.foursquare.com/docs/api/troubleshooting/errors">HERE</a></p>
                    `;
                    console.log(
                        `Foursquare API error: ${tips.meta.code}\nYou can check error code here: \nhttps://developer.foursquare.com/docs/api/troubleshooting/errors`
                    );
                }
                infoWindow.setContent(infoContent)
            }

        infoWindow.marker = marker
  
        //set to null, if not, info window can't open on last marker if was closed on it
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null
        })

        infoWindow.open(map, marker)
        map.fitBounds(bounds)
        map.panTo(marker.getPosition())
        }
    }

    myMarkerIcon(markerColor) {
        var markerImage = new this.props.google.maps.MarkerImage(
            `http://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=star|${markerColor}`,
            new this.props.google.maps.Size(25, 50),
            new this.props.google.maps.Point(0, 0),
            new this.props.google.maps.Point(0, 50),
            new this.props.google.maps.Size(20,40)
        )
        return markerImage
    }

    render() {
        return null
    }
}

export default MyMarker

MyMarker.propTypes = {
    map: PropTypes.object
}