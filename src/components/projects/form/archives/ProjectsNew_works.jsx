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
} from '../../../map/MapControls';
import {
  layerVector,
  vectorDraw,
  formatGML,
  MapboxStreet,
} from '../../../map/MapLayers';
import {
  interactionDraw,
  interactionModify,
  interactionSnap,
  selectDelete,
  selectModify,
  selectInfo,
} from '../../../map/MapInteractions';
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
import { TextField } from '../../../../app/common/form/TextField';

var arrDraw = [];
var arrModify = [];
var arrDelete = [];

class ProjectsNew extends Component {
  state = {
    center: [0, 0],
    zoom: 1,
    action: null,
    checkDraw: true,
    checkModify: true,
    checkDelete: true,
    checkRegister: false,
    showing: false,
    panelContent: null,
  };

  olmap = new OlMap({
    target: null,
    controls: defaultControls({ attribution: false }).extend([
      zoomSlider,
      scaleLine,
      attribution,
      mousePosition,
    ]),
    layers: [MapboxStreet, layerVector],
    view: new OlView({
      projection: 'EPSG:3857',
      center: this.state.center,
      zoom: this.state.zoom,
    }),
  });

  componentDidMount() {
    this.olmap.setTarget('map');
    this.olmap.on('moveend', () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
  }

  doDraw = () => {
    console.log(arrDraw.length);
    if (this.state.action === 'modify') {
      this.doModify();
    } else if (this.state.action === 'delete') {
      this.doDelete();
    }
    this.setState({ checkDraw: !this.state.checkDraw });
    if (this.state.checkDraw === false) {
      this.setState({ action: null });
      this.setState({ showing: false });
      this.olmap.removeInteraction(interactionDraw);
      this.olmap.removeLayer(vectorDraw);
      vectorDraw.getSource().clear();
      arrDraw.length = 0;
    } else {
      this.setState({ action: 'add' });
      this.olmap.addLayer(vectorDraw);
      this.olmap.addInteraction(interactionDraw);
      interactionDraw.on('drawend', (e) => {
        let information = 'Please add Informations for the layers';
        this.showInfo(information);
        arrDraw.push(e.feature);
      });
    }
  };

  doModify = () => {
    if (this.state.action === 'add') {
      this.doDraw();
    } else if (this.state.action === 'delete') {
      this.doDelete();
    }
    this.setState({ checkModify: !this.state.checkModify });
    if (this.state.checkModify === false) {
      this.setState({ action: null });
      this.setState({ showing: false });
      this.olmap.removeInteraction(interactionDraw);
      selectModify.getFeatures().clear();
      this.olmap.removeInteraction(interactionModify);
      this.olmap.removeInteraction(selectModify);
      this.olmap.removeInteraction(interactionSnap);
      arrModify.length = 0;
      layerVector.getSource().refresh();
    } else {
      this.setState({ action: 'modify' });
      this.olmap.addInteraction(selectModify);
      this.olmap.addInteraction(interactionModify);
      this.olmap.addInteraction(interactionSnap);
      selectModify.getFeatures().on('add', (e) => {
        let informationModify = 'Please add Informations for the layers';
        this.showInfo(informationModify);
        let f = e.element;
        let featureProperties = f.getProperties();
        //ici push dans le form
        console.log(featureProperties);
        var clone = new OlFeature(featureProperties);
        clone.setId(f.getId());
        arrModify.push(clone);
      });
    }
  };

  doDelete = () => {
    if (this.state.action === 'add') {
      this.doDraw();
    } else if (this.state.action === 'modify') {
      this.doModify();
    }
    this.setState({ checkDelete: !this.state.checkDelete });
    if (this.state.checkDelete === false) {
      this.setState({ action: null });
      this.olmap.removeInteraction(selectDelete);
      arrDelete.length = 0;
    } else {
      this.setState({ action: 'delete' });
      this.olmap.addInteraction(selectDelete);
      selectDelete.getFeatures().on('change:length', (e) => {
        arrDelete.push(e.target.item(0));
      });
    }
  };

  doRegister = () => {
    const formatWFS = new OlFormatWFS();
    this.setState({ checkRegister: !this.state.checkRegister });
    if (this.state.checkRegister === false) {
    } else {
    }
    if (this.state.action === 'add') {
      console.log(arrDraw.length);
      this.setState({ showing: true });
      for (var i = 0; i < arrDraw.length; i++) {
        this.setState({ showing: false });
        let node = formatWFS.writeTransaction(
          [arrDraw[i]],
          null,
          null,
          formatGML
        );
        this.wfst(node);
      }
      arrDraw.length = 0;
      vectorDraw.getSource().clear();
    } else if (this.state.action === 'modify') {
      for (var j = 0; j < arrModify.length; j++) {
        let node = formatWFS.writeTransaction(
          null,
          [arrModify[j]],
          null,
          formatGML
        );
        this.wfst(node);
      }
      selectModify.getFeatures().clear();
      arrModify.length = 0;
    } else if (this.state.action === 'delete') {
      for (var k = 0; k < arrDelete.length; k++) {
        let node = formatWFS.writeTransaction(
          null,
          null,
          [arrDelete[k]],
          formatGML
        );
        this.wfst(node);
      }
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

  showInfo = (info) => {
    //this.setState({ panelContent: info });
    this.setState({ showing: true });
  };

  render() {
    return (
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
          <Button content='Modifier' onClick={this.doModify.bind(this)} />
          <Button content='Supprimer' onClick={this.doDelete.bind(this)} />
          <Button content='Enregistrer' onClick={this.doRegister.bind(this)} />
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
                          arrDraw[0].set('main_objective', values.description);
                        } else {
                          arrModify[0].set('name_project', values.name);
                          arrModify[0].set('country', values.country);
                          arrModify[0].set(
                            'main_objective',
                            values.description
                          );
                        }
                        setSubmitting(false);
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
                          <TextField label='Nom du projet' name='name' />
                          <TextField label='Pays' name='country' />
                          <TextField label='Description' name='description' />
                          <Form.Group>
                            <TextField
                              label='Année de début'
                              name='startYear'
                              placeholder='2020-05-01'
                            />
                            <TextField
                              label='Année de fin'
                              name='endYear'
                              placeholder='2021-05-01'
                            />
                          </Form.Group>

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
                          <pre>values = {JSON.stringify(values, null, 2)}</pre>
                          <pre>errors = {JSON.stringify(errors, null, 2)}</pre>
                        </Form>
                      )}
                    </Formik>
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

export default ProjectsNew;
