import React, { useState, useEffect, Fragment } from 'react';
import 'ol/ol.css';
import '../../map/Map.css';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import {
  zoomSlider,
  scaleLine,
  attribution,
  mousePosition,
} from '../../map/MapControls';
import { OSM } from '../../map/MapLayers';
import { stylePolygonBasic } from '../../map/MapStyles';
import { Vector as OlVectorSource } from 'ol/source';
import { Vector as OlVectorLayer } from 'ol/layer';
import { GML as OlFormatGML, GeoJSON } from 'ol/format';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import {
  Grid,
  Segment,
  Breadcrumb,
  Label,
  Icon,
  Button,
  List,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { ProjectCriterias } from './ProjectCriterias';
import CommoditiesList from './CommoditiesList';

const ProjectDetailPage = ({ match }) => {
  const idProject = match.params.id;

  // Hooks to local state
  const [project, setProject] = useState('');
  const [id] = useState('map');

  const sourceOneProject = new OlVectorSource({
    loader: function (extent) {
      fetch(
        'https://map.geomatick.com/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=apf:projects&featureId=' +
          idProject +
          '&outputFormat=application/json&srsname=EPSG:3857',
        {
          headers: {
            Authorization: 'Basic ' + btoa('apfgs:8hN5q7qmk3U5KX'),
          },
        }
      ).then(async (response) => {
        const data = await response.json();
        sourceOneProject.addFeatures(new GeoJSON().readFeatures(data));
      });
    },
    strategy: bboxStrategy,
    projection: 'EPSG:3857',
  });

  const vectorOneProject = new OlVectorLayer({
    title: 'Project',
    source: sourceOneProject,
    style: stylePolygonBasic,
  });

  // Effect hook
  useEffect(() => {
    const olmap = new OlMap({
      target: id,
      // Add default map controls (zoom buttons etc.)
      controls: defaultControls({ attribution: false }).extend([
        //zoomSlider,
        scaleLine,
        attribution,
        mousePosition,
      ]),
      layers: [OSM, vectorOneProject],
      view: new OlView({
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 2,
        maxZoom: 18,
      }),
    });
    OSM.setVisible(true);
    sourceOneProject.on('change', function (e) {
      olmap.getView().fit(sourceOneProject.getExtent(), {
        padding: [50, 50, 50, 50],
        duration: 1000,
        minResolution: 1000,
      });
    });

    try {
      fetch(
        'https://map.geomatick.com/geoserver/apf/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=apf:projects&outputFormat=application/json&featureID=' +
          idProject +
          '',
        {
          headers: {
            Authorization: 'Basic ' + btoa('apfgs:8hN5q7qmk3U5KX'),
          },
        }
      ).then(async (response) => {
        const data = await response.json();
        setProject(data.features[0].properties);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Grid>
      <Grid.Column width={16}>
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to='/cases'>
            Cases
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>
            {_.capitalize(project.name_project)}
          </Breadcrumb.Section>
        </Breadcrumb>
      </Grid.Column>

      <Grid.Row textAlign='justified'>
        <Grid.Column width={10}>
          <Segment.Group>
            <Segment attached='top'>
              <h5>Case description</h5>
            </Segment>
            <Segment attached='bottom'>
              <h5>Case title</h5>
              <p>{project.name_project}</p>

              <h5>History</h5>
              <p>{project.main_objective}</p>

              <h5>Main crops</h5>
              <Label.Group>
                {project.commodities && (
                  <CommoditiesList commodities={project.commodities} />
                )}
              </Label.Group>

              <h5>Approche paysagère</h5>
              <ProjectCriterias project={project} />
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment attached='top'>
              <h5>Informations complémentaires</h5>
            </Segment>
            <Segment attached='bottom'>
              <Fragment>
                <h5>Contact</h5>
                {project.contact ? (
                  <Fragment>
                    <List>
                      <List.Item>{project.contact}</List.Item>
                      <List.Item>{project.mail}</List.Item>
                      <List.Item>{project.phone}</List.Item>
                    </List>
                  </Fragment>
                ) : (
                  'Non renseigné'
                )}
              </Fragment>

              <Fragment>
                <h5>Liens externes</h5>
                {project.links ? (
                  <Fragment>
                    <List bulleted>
                      {project.links.split(',').map((link) => (
                        <List.Item as={'a'} target='_blank' href={link} basic>
                          {link}
                        </List.Item>
                      ))}
                    </List>
                  </Fragment>
                ) : (
                  'Non renseignés'
                )}
              </Fragment>
            </Segment>
          </Segment.Group>
        </Grid.Column>
        <Grid.Column width={6}>
          <Segment.Group>
            <Segment attached='top'>
              <h5>Localisation</h5>
            </Segment>
            <Segment attached='bottom'>
              <div id='map' style={{ width: '100%', height: '300px' }}></div>
              <h5>Surface concernée</h5>
              <p>
                {project.area ? (
                  <Fragment>
                    {parseInt(project.area).toLocaleString('fr')} ha
                  </Fragment>
                ) : (
                  'Non renseignée'
                )}
              </p>

              <h5>Suku</h5>
              <p>
                {project.country ? (
                  <Fragment>
                    <Label.Group>
                      {project.country.split(',').map((cou) => (
                        <Label basic>{cou}</Label>
                      ))}
                    </Label.Group>
                  </Fragment>
                ) : (
                  'Non renseignés'
                )}
              </p>
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment attached='top'>
              <h5>Stakeholders</h5>
            </Segment>
            <Segment attached='bottom'>
              {project.actors ? (
                <Fragment>
                  <List bulleted>
                    {project.actors.split(',').map((actor) => (
                      <List.Item basic>{actor}</List.Item>
                    ))}
                  </List>
                </Fragment>
              ) : (
                'Non renseignés'
              )}
            </Segment>
          </Segment.Group>
          {/* <Segment.Group>
            <Segment attached='top'>
              <h5>Financements</h5>{' '}
            </Segment>
            <Segment attached='bottom'>
              {project.funds ? project.funds : 'Non renseignés'}
            </Segment>
          </Segment.Group> */}
        </Grid.Column>
        {/* Uncomment following line to debug */}
        {/* <pre>project = {JSON.stringify(project, null, 2)}</pre> */}
      </Grid.Row>
    </Grid>
  );
};

export default ProjectDetailPage;
