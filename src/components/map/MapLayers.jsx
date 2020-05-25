import {
  OSM as OlSourceOSM,
  Vector as OlVectorSource,
  WMTS as OlWMTSSource,
} from 'ol/source';
import { Tile as OlTileLayer, Vector as OlVectorLayer } from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import { GML as OlFormatGML, GeoJSON } from 'ol/format';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { getWidth, getTopLeft } from 'ol/extent';
import { get as getProjection } from 'ol/proj';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { stylePolygonBasic } from './MapStyles';

const OSM = new OlTileLayer({
  title: 'OSM',
  source: new OlSourceOSM(),
  preload: 0,
});

const cartodb = new OlTileLayer({
  title: 'CartoDB',
  source: new OlSourceOSM({
    url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  }),
  visible: false,
});

// Flux WMS : https://api.mapbox.com/styles/v1/hugolehoux/cjj8osoft3i6n2rntgrmw4jsk/wmts?access_token=pk.eyJ1IjoiaHVnb2xlaG91eCIsImEiOiItOHl6Sm5jIn0.12l_k0K_Z28UE-Jc0kDgpw

const MapboxStreet = new OlTileLayer({
  title: 'Fond Satellite',
  visible: true,
  source: new XYZ({
    url:
      'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaHVnb2xlaG91eCIsImEiOiItOHl6Sm5jIn0.12l_k0K_Z28UE-Jc0kDgpw',
  }),
});

const MapboxTerrain = new OlTileLayer({
  title: 'Mapbox Terrain',
  visible: false,
  source: new XYZ({
    url:
      'https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaHVnb2xlaG91eCIsImEiOiItOHl6Sm5jIn0.12l_k0K_Z28UE-Jc0kDgpw',
  }),
});

const MapboxSatellite = new OlTileLayer({
  title: 'Mapbox Satellite',
  visible: false,
  source: new XYZ({
    url:
      'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaHVnb2xlaG91eCIsImEiOiItOHl6Sm5jIn0.12l_k0K_Z28UE-Jc0kDgpw',
  }),
});

const projection = getProjection('EPSG:3857');
const projectionExtent = projection.getExtent();
const originTopLeft = getTopLeft(projectionExtent);
const resolutions = new Array(31);
const matrixIds = new Array(31);
const size = getWidth(projectionExtent) / 256;
for (var z = 0; z < 31; ++z) {
  matrixIds[z] = z.toString();
  resolutions[z] = size / Math.pow(2, z);
}
const maxLevels = 31;
const tileGrid = (levels = maxLevels) =>
  new WMTSTileGrid({
    origin: originTopLeft,
    resolutions: resolutions.slice(0, levels + 1),
    matrixIds: matrixIds.slice(0, levels + 1),
  });
const sourceIgnOrtho = new OlWMTSSource({
  url: 'https://wxs.ign.fr/pratique/geoportail/wmts',
  layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
  matrixSet: 'PM',
  format: 'image/jpeg',
  projection: projection,
  tileGrid: tileGrid(31),
  style: 'normal',
  attributions: '',
});
const coucheIgnOrtho = new OlTileLayer({
  opacity: 1.0,
  preload: Infinity,
  source: sourceIgnOrtho,
  title: 'Fond Satellite',
  visible: false,
});

const formatGML = new OlFormatGML({
  featureNS: 'https://map.geomatick.com/apf',
  featureType: 'projects',
  srsName: 'EPSG:3857',
  type: 'Point',
});

const sourceVector = new OlVectorSource({
  loader: function (extent) {
    fetch(
      'https://map.geomatick.com/geoserver/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&typename=apf:projects&' +
        'outputFormat=application/json&srsname=EPSG:3857&' +
        'bbox=' +
        extent.join(',') +
        ',EPSG:3857',
      {
        headers: {
          Authorization: 'Basic ' + btoa('apfgs:8hN5q7qmk3U5KX'),
        },
      }
    ).then(async (response) => {
      const data = await response.json();
      console.log(data);
      sourceVector.addFeatures(new GeoJSON().readFeatures(data));
    });
  },
  strategy: bboxStrategy,
  projection: 'EPSG:3857',
});

const layerVector = new OlVectorLayer({
  title: 'Projects',
  source: sourceVector,
  style: stylePolygonBasic,
});

const sourceDraw = new OlVectorSource({ wrapX: false });
const vectorDraw = new OlVectorLayer({
  source: sourceDraw,
});

export {
  OSM,
  MapboxStreet,
  MapboxSatellite,
  layerVector,
  formatGML,
  vectorDraw,
  coucheIgnOrtho,
  cartodb,
  MapboxTerrain,
};
