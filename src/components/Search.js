import React, { Component } from 'react'

class NavSearch extends Component {

    showFilters() {
        let Filters = document.getElementsByTagName('aside')
        if(Filters.length > 0) {
            Filters[0].classList.add('visible')
        }
        
    }

    render() {
        const { queryHandler } = this.props
        return (
            <nav className="header-bar" tabIndex="-1">
                <h1 tabIndex="-1" className="main-header">The Map</h1>
                <input
                    className="filter-input"
                    aria-label="Places filer"
                    tabIndex="0"
                    type="search"
                    placeholder="Places Filter"
                    onFocus={() => this.showFilters()}
                    onChange={(e) => queryHandler(e.target.value)}
                />
            </nav>
        )
    }
}

export default NavSearch