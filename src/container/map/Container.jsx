import React, { Component } from 'react';
import { AutoSizer } from 'react-virtualized';

import GoogleApiHOC from '../../common/utils/GoogleApiHOC';
import SolarMap from './SolarMap';

const styles = {
  root: {
    display: 'flex',
  },
  leftPane: {
    width: 300,
    padding: 8,
  },
  rightPane: {
    flex: 1,
  },
  controls: {
    margin: 5,
    width: 283,
    lineHeight: '30px',
  },
  divResult: {
    border: '1px solid black',
    margin: 5,
    height: 200,
    padding: 18,
  },
};

const GOOGLE_API_KEY = 'AIzaSyAcYLFCr4zVtYoPvNiQyxtmUtdlXasabVY';

@GoogleApiHOC({
 apiKey: GOOGLE_API_KEY,
 libraries: ['places', 'visualization', 'geometry'],
})

export default class Container extends Component {
  computeNominalPower() {
    // the main input is the polygon of the rooftop

    // compute the area of the rooftop

    // take into account other factors: shading, rooftop's angle...

    return 290;
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    };

    return (
      <div style={style}>
        { !this.props.loaded
          ? <div>Loading...</div>
          : <AutoSizer>
            {({ height, width }) => {
              const style = {
                width,
                height,
                display: 'flex',
              };

              return (
                <div
                  style={style}
                >
                  <div style={styles.leftPane}>
                    <span>Welcome</span>
                    <input id="pac-input" style={styles.controls} type="text" placeholder="Enter your address" />
                    <ul style={styles.divResult}>
                      <span>Result</span>
                      <hr />
                      <li>Nominal Power: {this.computeNominalPower()}W</li>

                    </ul>
                  </div>
                  <SolarMap
                    style={styles.rightPane}
                    google={this.props.google}
                  />
                </div>
              );
            }}
            </AutoSizer>
        }
      </div>
    );
  }
}