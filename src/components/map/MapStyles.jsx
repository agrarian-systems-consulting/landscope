import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
  Icon,
} from 'ol/style';

// Simple polygon style
let fillColor = 'rgba(0, 0, 0, 0.05)';
let strokeColor = 'rgba(0, 181, 174, 1.0)';

const stylePolygonBasic = new Style({
  stroke: new Stroke({
    color: strokeColor,
    width: 2,
  }),
  fill: new Fill({
    color: fillColor,
  }),
  image: new Icon(
    /** @type {olx.style.IconOptions} */ ({
      anchor: [15, 30],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: '/assets/mapmarker_green.png',
    })
  ),
});

// Handle style when drawing a new feature
const styleInteractionDraw = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.5)',
  }),
  stroke: new Stroke({
    color: '#ffcc33',
    lineDash: [10, 10],
    width: 3,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: '#E0126E',
    }),
    width: 4,
    fill: new Fill({
      color: 'white',
    }),
  }),
});

const styleSelectInfo = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.1)',
  }),
  stroke: new Stroke({
    color: 'rgba(224, 18, 110,1)',
    width: 1.5,
  }),
  image: new Icon(
    /** @type {olx.style.IconOptions} */ ({
      anchor: [15, 30],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: '/assets/mapmarker_red.png',
    })
  ),
});

// May be used in future versions
// Handle style when selecting a feature to modify
// const styleInteractionModify = new Style({
//   fill: new Fill({
//     color: 'rgba(255, 255, 255, 0.1)',
//   }),
//   stroke: new Stroke({
//     color: 'rgba(40, 0, 255, 1.0)',
//     lineDash: [10, 10],
//     width: 2,
//   }),
//   image: new CircleStyle({
//     radius: 5,
//     stroke: new Stroke({
//       color: 'rgba(40, 0, 255, 0.85)',
//     }),
//     fill: new Fill({
//       color: 'rgba(40, 0, 255, 0.85)',
//     }),
//   }),
// });

// May be used in future versions
// Handle style when selecting a feature to modify
// const styleSelectModify = new Style({
//   fill: new Fill({
//     color: 'rgba(255, 255, 255, 0.1)',
//   }),
//   stroke: new Stroke({
//     color: 'rgba(40, 0, 255, 1.0)',
//     lineDash: [10, 10],
//     width: 2,
//   }),
//   image: new CircleStyle({
//     radius: 5,
//     stroke: new Stroke({
//       color: 'rgba(40, 0, 255, 0.85)',
//     }),
//     fill: new Fill({
//       color: 'rgba(40, 0, 255, 0.85)',
//     }),
//   }),
// });

// May be used in future versions
// Handle style when selecting a feature to delete
// const styleSelectDelete = new Style({
//   fill: new Fill({
//     color: 'rgba(255, 255, 255, 0.2)',
//   }),
//   stroke: new Stroke({
//     color: 'rgba(255, 0, 40, 1.0)',
//     lineDash: [10, 10],
//     width: 2,
//   }),
//   image: new CircleStyle({
//     radius: 5,
//     stroke: new Stroke({
//       color: 'rgba(40, 0, 255, 0.85)',
//     }),
//     fill: new Fill({
//       color: 'rgba(40, 0, 255, 0.85)',
//     }),
//   }),
// });

//TODO : Style pour les points. Peut-on mettre un SVG ?
//const stylePointBasic

// TODO : Style différencié par commodité concernée ou autre, à revoir avec 148

// var remplissageCouleur;
// var contourCouleur;
// var styleVectorProjects = function (entite, resolution) {
//   var name_project = entite.get('name_project');
//   if (name_project[0] === 't') {
//     remplissageCouleur = 'rgba(0, 255, 0, 0.3)';
//     contourCouleur = 'rgba(34, 121, 34, 1.0)';
//   } else {
//     remplissageCouleur = 'rgba(0, 0, 255, 0.3)';
//     contourCouleur = 'rgba(0, 0, 255, 1.0)';
//   }
//   var styleBasic = new Style({
//     stroke: new Stroke({
//       color: contourCouleur,
//       width: 3,
//     }),
//     fill: new Fill({
//       color: remplissageCouleur,
//     }),
//   });
//   var styleTexte = new Style({
//     stroke: new Stroke({
//       color: contourCouleur,
//       width: 3,
//     }),
//     fill: new Fill({
//       color: remplissageCouleur,
//     }),
//     text: new Text({
//       text: name_project,
//       font: 'bold 16px Times New Roman',
//       offsetY: -15,
//       fill: new Fill({
//         color: '#fff',
//       }),
//       stroke: new Stroke({
//         color: contourCouleur,
//         width: 5,
//       }),
//     }),
//   });
//   // On retourne les styles selon la résolution de la carte
//   if (resolution > 100000) {
//     return [styleBasic];
//   } else {
//     return [styleTexte];
//   }
// };

export {
  styleInteractionDraw,
  // styleInteractionModify,
  // styleSelectModify,
  // styleSelectDelete,
  styleSelectInfo,
  stylePolygonBasic,
};
