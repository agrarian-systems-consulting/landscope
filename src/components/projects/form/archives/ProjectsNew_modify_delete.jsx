import React, { Component } from 'react';
import 'ol/ol.css';
import '../../map/Map.css';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import OlFeature from 'ol/Feature';
import { WFS as OlFormatWFS } from 'ol/format';
import {
  zoomSlider,
  scaleLine,
  attribution,
  mousePosition,
} from '../../map/MapControls';
import {
  layerVector,
  vectorDraw,
  formatGML,
  MapboxStreet,
} from '../../map/MapLayers';
import {
  interactionDraw,
  interactionModify,
  interactionSnap,
  selectDelete,
  selectModify,
  selectInfo,
} from '../../map/MapInteractions';
import {
  Button,
  Container,
  Segment,
  Label,
  Grid,
  Form,
  TextArea,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextField } from '../../../app/common/form/TextField';
import { useHistory, withRouter } from 'react-router-dom';
import { ProjectInnerForm } from './ProjectInnerForm';

var arrDraw = [];
var arrModify = [];
var arrDelete = [];

class ProjectsNew extends Component {
  state = {
    center: [0, 0],
    zoom: 1,
    action: null,
    panelContent: null,
  };

  // React lifecycle
  componentDidMount() {
    const olmap = this.olmap;
    olmap.setTarget('map');
    olmap.on('moveend', () => {
      let center = olmap.getView().getCenter();
      let zoom = olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
  }

  // Prepare the instance of the map
  olmap = new OlMap({
    target: null,
    // Set default controls
    controls: defaultControls({ attribution: false }).extend([
      zoomSlider,
      scaleLine,
      attribution,
      mousePosition,
    ]),
    // Set layers
    layers: [MapboxStreet, layerVector],
    // Set view
    view: new OlView({
      projection: 'EPSG:3857',
      center: this.state.center,
      zoom: this.state.zoom,
    }),
  });

  // Je pense qu'on peut faire encore mieux ici en nettoyant tout à chaque fois
  cleanUpInteractions = () => {
    // Reference to the map
    const olmap = this.olmap;

    if (this.state.action !== 'modify') {
      // Remove modifying interactions
      olmap.removeInteraction(interactionDraw);
      selectModify.getFeatures().clear();
      olmap.removeInteraction(interactionModify);
      olmap.removeInteraction(selectModify);
      olmap.removeInteraction(interactionSnap);
      //Clear modify array
      this.setState({ arrModify: [] });
      layerVector.getSource().refresh();
    }

    if (this.state.action !== 'delete') {
      // Remove deleting interaction
      olmap.removeInteraction(selectDelete);
      // Clear delete array
      this.setState({ arrDelete: [] });
      // Ne faut-il pas mettre un egtSource().refresh()?
    }

    if (this.state.action !== 'add') {
      // Remove adding interactions
      olmap.removeInteraction(interactionDraw);
      olmap.removeLayer(vectorDraw);
      // Clear source and draw array
      this.setState({ arrDraw: [] });
      vectorDraw.getSource().clear();
    }
  };

  // Handle drawing interaction
  doDraw = () => {
    // Reference to the map
    const olmap = this.olmap;
    this.setState({ action: 'add' });
    this.cleanUpInteractions(olmap);

    // Add drawing layer and interactions
    olmap.addLayer(vectorDraw);
    olmap.addInteraction(interactionDraw);
    interactionDraw.on('drawend', (e) => {
      arrDraw.push(e.feature);
    });
  };

  // Handle modify
  doModify = () => {
    const olmap = this.olmap;
    this.setState({ action: 'modify' });
    this.cleanUpInteractions();

    // Add interactions
    olmap.addInteraction(selectModify);
    olmap.addInteraction(interactionModify);
    olmap.addInteraction(interactionSnap);

    // Select feature to modify
    selectModify.getFeatures().on('add', (e) => {
      // Retrieve element properties
      let f = e.element;
      let featureProperties = f.getProperties();

      //TODO : Push dans le form

      // Create a deep copy to push in modify array
      var clone = new OlFeature(featureProperties);
      clone.setId(f.getId());
      // Push clone in arrModify
      arrModify.push(clone);
    });
  };

  // Handle delete feature
  doDelete = () => {
    this.setState({ action: 'delete' });
    this.cleanUpInteractions();

    // Add select delete interaction
    this.olmap.addInteraction(selectDelete);
    selectDelete.getFeatures().on('change:length', (e) => {
      // Push selected feature in delete array
      arrDelete.push(e.target.item(0));
    });
  };

  // Handle registration through WFS

  doRegister = () => {
    const formatWFS = new OlFormatWFS();

    if (this.state.action === 'add') {
      // Add new Feature in the database through WFS

      for (var i = 0; i < arrDraw.length; i++) {
        let node = formatWFS.writeTransaction(
          [arrDraw[i]],
          null,
          null,
          formatGML
        );
        this.wfst(node);
      }
      // Cleanup
      arrDraw.length = 0;
      vectorDraw.getSource().clear();
      // TODO : Récupérer l'id pour rediriger vers la bonne page
      this.props.history.push('/projets/projects.58');
    } else if (this.state.action === 'modify') {
      // Handle update features in databse through WFS
      for (var j = 0; j < arrModify.length; j++) {
        let node = formatWFS.writeTransaction(
          null,
          [arrModify[j]],
          null,
          formatGML
        );
        this.wfst(node);
      }
      // Cleanup
      selectModify.getFeatures().clear();
      arrModify.length = 0;
    } else if (this.state.action === 'delete') {
      // Handle delete features in database through <WFS></WFS>
      for (var k = 0; k < arrDelete.length; k++) {
        let node = formatWFS.writeTransaction(
          null,
          null,
          [arrDelete[k]],
          formatGML
        );
        this.wfst(node);
      }
      // Cleanup
      selectDelete.getFeatures().clear();
      arrDelete.length = 0;
    }
  };

  wfst = (node) => {
    const s = new XMLSerializer();
    let str = s.serializeToString(node);

    fetch('https://map.geomatick.com/geoserver/apf/wfs', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('apfgs:8hN5q7qmk3U5KX'),
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: str,
    }).then(async (response) => {
      //let data = await response.text();
      layerVector.getSource().refresh();
    });
  };

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Segment.Group>
              <Segment attached='top'>
                <h5>Description du projet</h5>
              </Segment>
              <Segment attached='bottom'>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Formik
                        initialValues={{
                          name: '',
                          description: '',
                          country: '',
                          startDate: '',
                          endDate: '',
                        }}
                        // Handle form validation
                        //validationSchema={validationSchema}
                        // Handle form submit
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          setSubmitting(true);
                          if (this.state.action === 'add') {
                            arrDraw[0].set('name_project', values.name);
                            arrDraw[0].set('country', values.country);
                            arrDraw[0].set(
                              'main_objective',
                              values.description
                            );
                          } else {
                            arrModify[0].set('name_project', values.name);
                            arrModify[0].set('country', values.country);
                            arrModify[0].set(
                              'main_objective',
                              values.description
                            );
                          }
                          this.doRegister();

                          setSubmitting(false);
                          // TODO : il faudrait récupérer l'id du projet créé ici pour rediriger vers sa page détaillée
                          console.log('here');
                        }}
                      >
                        {({
                          values,
                          errors,
                          dirty,
                          isValid,
                          handleSubmit,
                          isSubmitting,
                        }) => (
                          <Form onSubmit={handleSubmit}>
                            <ProjectInnerForm />

                            <div>
                              <Button
                                primary
                                content='Valider'
                                type='submit'
                                disabled={isSubmitting || !isValid || !dirty}
                                loading={isSubmitting}
                              />
                            </div>

                            {/* Uncomment following lines to debug form */}
                            <pre>
                              values = {JSON.stringify(values, null, 2)}
                            </pre>
                            <pre>
                              errors = {JSON.stringify(errors, null, 2)}
                            </pre>
                          </Form>
                        )}
                      </Formik>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column width={8}>
            <div
              id='map'
              style={{
                position: 'relative',
                top: '-37px',
                margin: 'none',
                padding: 'none',
                width: '100%',
                height: '700px',
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
                <Button content='Dessiner' onClick={this.doDraw.bind(this)} />
                {/* <Button content='Modifier' onClick={this.doModify.bind(this)} /> */}
                {/* <Button content='Supprimer' onClick={this.doDelete.bind(this)} /> */}
                {/* <Button content='Enregistrer' onClick={this.doRegister.bind(this)} /> */}
              </Button.Group>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(ProjectsNew);
