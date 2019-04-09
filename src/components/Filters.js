import React, { PureComponent } from 'react'

class Filters extends PureComponent {

    closeFilters() {
        let Filters = document.getElementsByTagName('aside')
        Filters[0].classList.remove('visible')
    }

    setMarker(onPlace) {
        onPlace.showInfo(onPlace.marker, onPlace.props.myInfoWindow)
    }

    onSpacePress(event, loc) {
        if (event.key === " ") {
            event.preventDefault()
            this.setMarker(loc)   
        }
    }

    render() {
        const { googleLocations } = this.props
        return (
            <aside className="filter-panel" tabIndex="-1">
                <div className="filter-header-bar" tabIndex="-1">
                    <h2 className="filter-header" tabIndex="-1">Interesting Places</h2>
                    <button aria-label="Close filters button" tabIndex="0" className="filter-close-button" onClick={() => this.closeFilters()}>
                    Hide
                    </button>
                </div>
                <ul aria-label="List of interesting places" tabIndex="-1" className="filter-list">
                    {googleLocations.filter(loc => loc.marker.visible === true).map((loc, index) => (
                        <li
                            className="filter-content"
                            role="button"
                            tabIndex="0"
                            key={index}
                            onKeyPress={(event) => this.onSpacePress(event, loc)}
                            onClick={
                                () => {
                                    this.setMarker(loc)
                                    this.closeFilters()
                                }
                            }
                        >
                            {loc.props.name} 
                        </li>
                    ))}
                    </ul>
            </aside>
        )
    }
}

export default Filters