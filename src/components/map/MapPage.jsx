import React, { Component } from 'react';
import 'ol/ol.css';
import './Map.css';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { selectInfo } from './MapInteractions';
import {
  zoomSlider,
  scaleLine,
  attribution,
  mousePosition,
} from './MapControls';
import {
  layerVector,
  OSM,
  MapboxTerrain,
  coucheIgnOrtho,
  cartodb,
  MapboxSatellite,
  MapboxStreet,
} from './MapLayers';
import {
  Button,
  Container,
  Segment,
  Label,
  Grid,
  Dropdown,
  Menu,
} from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import CommoditiesList from '../projects/detail/CommoditiesList';
import _ from 'lodash';

class TheMap extends Component {
  // Local state
  state = {
    center: [0, 0],
    zoom: 2,
    showing: false,
    panelContent: {},
  };

  // React lifeCycle componentDidMount
  componentDidMount() {
    // Reference to map
    const olmap = this.olmap;
    olmap.setTarget('map');
    olmap.on('moveend', () => {
      let center = olmap.getView().getCenter();
      let zoom = olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
    olmap.addInteraction(selectInfo);
    olmap.on('click', this.handleMapClick.bind(this));
  }

  //componentWillUnmont to unsubscribe listeners
  componentWillUnmount() {
    // Reference to map
    const olmap = this.olmap;

    olmap.un('moveend', () => {
      let center = olmap.getView().getCenter();
      let zoom = olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
    olmap.removeInteraction(selectInfo);
    olmap.un('click', this.handleMapClick.bind(this));
  }

  // Prepare the instance of the map
  olmap = new OlMap({
    target: null,
    // Add default map controls (zoom buttons etc.)
    controls: defaultControls({ attribution: false }).extend([
      zoomSlider,
      scaleLine,
      attribution,
      mousePosition,
    ]),
    // Add basemaps and drawing layer
    layers: [
      OSM,
      MapboxTerrain,
      coucheIgnOrtho,
      cartodb,
      MapboxSatellite,
      MapboxStreet,
      layerVector,
    ],
    // Define geographic properties
    view: new OlView({
      projection: 'EPSG:3857',
      maxZoom: 18,
      center: this.state.center,
      zoom: this.state.zoom,
    }),
  });

  // Handle basemap toggle visility
  getBaseMap = (event, { value }) => {
    let optionsLayer = event.target.textContent;

    // Set all map to visible:false
    coucheIgnOrtho.setVisible(false);
    OSM.setVisible(false);
    cartodb.setVisible(false);
    MapboxTerrain.setVisible(false);
    MapboxStreet.setVisible(false);
    MapboxSatellite.setVisible(false);

    //Switch
    switch (optionsLayer) {
      case 'OSM':
        OSM.setVisible(true);
        break;
      case 'Fond Satellite':
        coucheIgnOrtho.setVisible(true);
        break;
      case 'CartoDB':
        cartodb.setVisible(true);
        break;
      case 'Mapbox Terrain':
        MapboxTerrain.setVisible(true);
        break;
      case 'Mapbox Street':
        MapboxStreet.setVisible(true);
        break;
      case 'Mapbox Satellite':
        MapboxSatellite.setVisible(true);
        break;
      default:
        OSM.setVisible(true);
        break;
    }
  };

  baseMapOptions = [
    {
      key: 1,
      text: 'OSM',
      value: 1,
      image: { avatar: false, src: '/assets/osm.png' },
    },
    {
      key: 2,
      text: 'Fond Satellite',
      value: 2,
      image: {
        avatar: false,
        src: '/assets/satellite.png',
      },
    },
    {
      key: 3,
      text: 'CartoDB',
      value: 3,
      image: {
        avatar: false,
        src: '/assets/cartodb.png',
      },
    },

    {
      key: 4,
      text: 'Mapbox Terrain',
      value: 4,
      image: {
        avatar: false,
        src: '/assets/cartodb.png',
      },
    },
    {
      key: 5,
      text: 'Mapbox Satellite',
      value: 5,
      image: {
        avatar: false,
        src: '/assets/cartodb.png',
      },
    },
    {
      key: 6,
      text: 'Mapbox Street',
      value: 6,
      image: {
        avatar: false,
        src: '/assets/cartodb.png',
      },
    },
  ];

  // Handle map click to select a project and show it in a side panel
  handleMapClick = (evt) => {
    // Retrieve mouse coordinates onClick
    var coordinate = evt.coordinate;

    // Select closest feature (points and polygons work)
    var feature = layerVector
      .getSource()
      .getClosestFeatureToCoordinate(coordinate);

    // Zoom to the extent of the selected feature
    var extentFeature = feature.getGeometry().getExtent();
    this.olmap.getView().fit(extentFeature, {
      padding: [150, 150, 150, 150],
      duration: 1000,
      minResolution: 1000,
    });

    // Workaround because padding doesn't work with Points

    // Retrieve feature data to display in side panel
    let project_id = feature.getId();
    let name = feature.get('name_project');
    let main_objective = feature.get('main_objective');
    let country = feature.get('country');
    let commodities = feature.get('commodities');

    // Display data in side panel
    this.setState({
      panelContent: {
        project_id: project_id,
        name: name,
        country: country,
        summary: main_objective,
        commodities: commodities,
      },
    });
    this.setState({ showing: true });
  };

  // Close side panel
  closeInfo = () => {
    this.setState({ showing: false });
  };

  render() {
    return (
      <div
        id='map'
        style={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          top: '0px',
          left: '0px',
        }}
      >
        <Button.Group
          style={{
            position: 'relative',
            top: '5rem',
            left: '1rem',
            zIndex: '1',
          }}
        >
          <Menu compact>
            <Dropdown
              icon='globe'
              text='Fonds de Carte'
              options={this.baseMapOptions}
              floating
              labeled
              button
              className='icon'
              onChange={this.getBaseMap}
            />
          </Menu>
        </Button.Group>
        <Container
          id='sidebar'
          style={{
            position: 'absolute',
            marginTop: '6.5rem',
            paddingLeft: '1rem',
            width: '30%',
            zIndex: '1',
            display: this.state.showing ? 'block' : 'none',
          }}
        >
          <Segment.Group>
            <Segment attached='top'>
              <h4>{this.state.panelContent.name}</h4>
            </Segment>
            <Segment attached='bottom'>
              <Grid>
                {this.state.panelContent.commodities && (
                  <Grid.Row>
                    <Grid.Column>
                      <h5>Filières concernées</h5>
                      <CommoditiesList
                        commodities={this.state.panelContent.commodities}
                      />
                    </Grid.Column>
                  </Grid.Row>
                )}
                <Grid.Row>
                  <Grid.Column>
                    <h5>Résumé</h5>
                    {_.truncate(this.state.panelContent.summary, {
                      length: 500, // maximum 30 characters
                      separator: /,?\.* +/, // separate by spaces, including preceding commas and periods
                    })}
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    <Button size='small' onClick={this.closeInfo}>
                      Fermer
                    </Button>
                    <Button
                      size='small'
                      color='teal'
                      as={NavLink}
                      to={`/projets/${this.state.panelContent.project_id}`}
                    >
                      En savoir plus
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Segment.Group>
        </Container>
      </div>
    );
  }
}

export default TheMap;
