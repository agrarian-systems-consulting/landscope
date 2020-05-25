import OlDraw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import Snap from 'ol/interaction/Snap';
import { pointerMove } from 'ol/events/condition';
import { layerVector, vectorDraw } from './MapLayers';
import {
  styleInteractionDraw,
  // styleSelectModify,
  // styleSelectDelete,
  styleSelectInfo,
} from './MapStyles';

const interactionDraw = new OlDraw({
  source: vectorDraw.getSource(),
  type: /** @type {ol.geom.GeometryType} */ 'Point',
  style: styleInteractionDraw,
});

// const selectModify = new Select({
//   style: styleSelectModify,
// });
// const interactionModify = new Modify({
//   features: selectModify.getFeatures(),
// });

// const interactionSnap = new Snap({
//   source: layerVector.getSource(),
// });

// const selectDelete = new Select({
//   style: styleSelectDelete,
// });

const selectInfo = new Select({
  style: styleSelectInfo,
  condition: pointerMove,
});

export {
  interactionDraw,
  // interactionModify,
  // interactionSnap,
  // selectDelete,
  // selectModify,
  selectInfo,
};
