import React, { Component } from 'react';
import 'ol/ol.css';
import '../../map/Map.css';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { WFS as OlFormatWFS } from 'ol/format';
import {
  zoomSlider,
  scaleLine,
  attribution,
  mousePosition,
} from '../../map/MapControls';
import {
  vectorDraw,
  formatGML,
  MapboxStreet,
  layerVector,
} from '../../map/MapLayers';
import { interactionDraw } from '../../map/MapInteractions';
import {
  Button,
  Segment,
  Grid,
  Form,
  Breadcrumb,
  CommentGroup,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withRouter, Link } from 'react-router-dom';
import { ProjectInnerForm } from './ProjectInnerForm';

// TODO in future versions : Move arrDraw to local state
var arrDraw = [];

class ProjectsNew extends Component {
  // Local state
  state = {
    center: [0, 0],
    zoom: 1,
    action: null,
    id: null,
  };

  // React lifecycles
  componentDidMount() {
    const olmap = this.olmap;
    olmap.setTarget('map');
    olmap.on('moveend', () => {
      let center = olmap.getView().getCenter();
      let zoom = olmap.getView().getZoom();
      this.setState({ center, zoom });
    });
  }

  // omponentWillUnmount unsubscribe listeners
  componentWillUnmount() {
    const olmap = this.olmap;

    olmap.un('moveend', () => {
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
    layers: [MapboxStreet],
    // Set view
    view: new OlView({
      projection: 'EPSG:3857',
      center: this.state.center,
      zoom: this.state.zoom,
    }),
  });

  // Handle drawing projects
  doDraw = () => {
    // Reference to the map
    const olmap = this.olmap;
    this.setState({ action: 'add' });

    // Add drawing layer and interactions
    olmap.addLayer(vectorDraw);
    olmap.addInteraction(interactionDraw);
    interactionDraw.on('drawend', (e) => {
      arrDraw.push(e.feature);
    });
  };

  doClear = () => {
    // Clear source and draw array
    arrDraw.length = 0;
    vectorDraw.getSource().clear();
  };

  // Handle registration through WFS
  doRegister = async () => {
    const formatWFS = new OlFormatWFS();

    // Add new features in the database through WFST protocol
    for (var i = 0; i < arrDraw.length; i++) {
      let node = formatWFS.writeTransaction(
        [arrDraw[i]],
        null,
        null,
        formatGML
      );
      this.wfst(node);
    }
  };

  wfst = (node) => {
    const s = new XMLSerializer();
    let str = s.serializeToString(node);
    let idProject = null;
    //console.log(str);
    fetch('https://map.geomatick.com/geoserver/apf/wfs', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('apfgs:8hN5q7qmk3U5KX'),
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: str,
    }).then(async (response) => {
      // layerVector.getSource().refresh();
      await response
        .text()
        .then(function (text) {
          // Retrieve id to redirect to the right page
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          const ogcFeatureId = xmlDoc.getElementsByTagName('ogc:FeatureId');
          let idProject = ogcFeatureId[0].getAttribute('fid');
          return idProject;
        })
        .then((response) => {
          if (response !== null) {
            this.props.history.push(`/projets/${response}`);
            // Cleanup
            arrDraw.length = 0;
          }
        });
    });
  };

  render() {
    const validationSchema = Yup.object().shape({
      name: Yup.string().required(),
      main_objective: Yup.string().required(),
      country: Yup.string().required(),
      area: Yup.number().positive().integer(),
      year_start: Yup.number().positive().integer(),
      year_end: Yup.number().positive().integer(),
    });

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Breadcrumb>
              <Breadcrumb.Section as={Link} to='/projets'>
                Projets
              </Breadcrumb.Section>
              <Breadcrumb.Divider />
              <Breadcrumb.Section active>Ajouter un projet</Breadcrumb.Section>
            </Breadcrumb>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
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
                  {this.state.action === 'add' ? (
                    <Button
                      floated='right'
                      content='Recommencer'
                      onClick={this.doClear.bind(this)}
                    />
                  ) : (
                    <Button
                      primary
                      content='Dessiner'
                      onClick={this.doDraw.bind(this)}
                    />
                  )}
                </Button.Group>
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment.Group>
              <Segment attached='top'>
                <h5>Description du projet</h5>
              </Segment>
              <Segment attached='bottom'>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Formik
                        // Initializing values in Formik is mandatory
                        initialValues={{
                          name: '',
                          country: '',
                          city: '',
                          area: '',
                          main_objective: '',
                          funds: '',
                          year_start: '',
                          year_end: '',
                          /*current: '',*/
                          contact: '',
                          phone: '',
                          mail: '',
                          links: '',
                          crit_formal_agreement: false,
                          crit_int_commitment: false,
                          crit_baseline: false,
                          crit_landscape_plan_agreed: false,
                          crit_landscape_plan_implemented: false,
                          crit_governance: false,
                          crit_parti_monitoring: false,
                          crit_strenth_capacity: false,
                          commodities: '',
                          actors: '',
                        }}
                        // Handle form validation
                        validationSchema={validationSchema}
                        // Handle form submit
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          setSubmitting(true);
                          // Add form values to geometry
                          // TODO : Should be cleaned with setState si arrDraw est passé dans le local state
                          if (this.state.action === 'add') {
                            arrDraw[0].set('name_project', values.name);
                            arrDraw[0].set('country', values.country);
                            arrDraw[0].set('city', values.city);
                            arrDraw[0].set('area', values.area);
                            arrDraw[0].set(
                              'main_objective',
                              values.main_objective
                            );
                            arrDraw[0].set('funds', values.funds);
                            arrDraw[0].set('date_start', values.year_start);
                            arrDraw[0].set('date_end', values.year_end);
                            /*arrDraw[0].set('current',values.current);*/
                            arrDraw[0].set('contact', values.contact);
                            arrDraw[0].set('phone', values.phone);
                            arrDraw[0].set('mail', values.mail);
                            arrDraw[0].set('links', values.links);
                            arrDraw[0].set(
                              'crit_formal_agreement',
                              values.crit_formal_agreement
                            );
                            arrDraw[0].set(
                              'crit_int_commitment',
                              values.crit_int_commitment
                            );
                            arrDraw[0].set(
                              'crit_baseline',
                              values.crit_baseline
                            );
                            arrDraw[0].set(
                              'crit_landscape_plan_agreed',
                              values.crit_landscape_plan_agreed
                            );
                            arrDraw[0].set(
                              'crit_landscape_plan_implemented',
                              values.crit_landscape_plan_implemented
                            );
                            arrDraw[0].set(
                              'crit_governance',
                              values.crit_governance
                            );
                            arrDraw[0].set(
                              'crit_parti_monitoring',
                              values.crit_parti_monitoring
                            );
                            arrDraw[0].set(
                              'crit_strenth_capacity',
                              values.crit_strenth_capacity
                            );
                            arrDraw[0].set('commodities', values.commodities);
                            arrDraw[0].set('actors', values.actors);
                          }
                          // Register the data and the geometry through WFS
                          this.doRegister();
                        }}
                      >
                        {({
                          // Desctructuring formik props
                          values,
                          errors,
                          dirty,
                          isValid,
                          handleSubmit,
                          isSubmitting,
                        }) => {
                          return (
                            <Form onSubmit={handleSubmit}>
                              <ProjectInnerForm values={values} />

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
                              {/* <pre>
                                values = {JSON.stringify(values, null, 2)}
                              </pre>
                              <pre>
                                errors = {JSON.stringify(errors, null, 2)}
                              </pre> */}
                            </Form>
                          );
                        }}
                      </Formik>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(ProjectsNew);
