import React, { Component } from 'react';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getLatLngRange, arrayGenerator } from '../../common/utils/util';
import { fetchRooftop } from  '../../redux/modules/domain/rooftop';

const mapStateToProps = (state, ownProps) => ({
  zoom: state.map.zoom,
  center: state.map.center,
  polygon: state.rooftop.polygon,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchRooftop: (address) => {
    dispatch(fetchRooftop({ address }));
  },
});

export class SolarMap extends Component {
  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }

    if (prevProps.polygon !== this.props.polygon) {
      if (this.map) {
        this.showPolygon(this.map, this.props.polygon);
      }
    }
  }

  handleEvent(e) {
    console.log(e.latLng.lat(), e.latLng.lng());
  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const { google, zoom, center, polygon } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      const mapConfig = Object.assign({}, {
        center: new maps.LatLng(center.lat, center.lng),
        zoom,
      })
      this.map = new maps.Map(node, mapConfig);

      const evtNames = ['click'];
      evtNames.forEach(e => {
        this.map.addListener(e, this.handleEvent);
      });

      this.showPolygon(this.map, polygon);

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new maps.places.SearchBox(input);

      // Bias the SearchBox results towards current map's viewport.
      this.map.addListener('bounds_changed', () => {
        searchBox.setBounds(this.map.getBounds());
      });

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', () => {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        this.map.fitBounds(bounds);

        const address = places[0]['formatted_address'];
        this.props.fetchRooftop(address);
      });
    }
  }

  showPolygon = (map, polygon) => {
    const maps = this.props.google.maps;
    this.poly = new maps.Polygon({
      paths: polygon,
      strokeColor: '#FF0000',
      strokeWeight: 2,
      fillOpacity: 0
    });

    this.poly.setMap(this.map);
  }

  render() {
    const { style } = this.props;

    return (
      <div
        style={Object.assign({}, style)}
        ref='map'
      />
    )
  }
}

SolarMap.defaultProps = {
  zoom: 1,
  center: {
    lat: 37.774929,
    lng: -122.419416
  },
};

SolarMap.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  center: PropTypes.object,
  polygon: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(SolarMap);