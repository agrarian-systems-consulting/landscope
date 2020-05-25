import { ZoomSlider, ScaleLine, Attribution, MousePosition } from 'ol/control';
import { format } from 'ol/coordinate';

const attribution = new Attribution({
  collapsible: true,
  collapsed: true,
});

const mousePosition = new MousePosition({
  undefinedHTML: '<span class="mousePosition"> No data</span>',
  projection: 'EPSG:4326',
  coordinateFormat: function (coordinate) {
    return format(
      coordinate,
      '<span class="mousePosition"> {x} ° | {y} °</span>',
      4
    );
  },
});

// const fullScreen = new FullScreen()

const zoomSlider = new ZoomSlider();

const scaleLine = new ScaleLine();

export { zoomSlider, scaleLine, attribution, mousePosition };
