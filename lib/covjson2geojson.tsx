import { FeatureCollection, Feature } from "geojson";
import bboxPolygon from "@turf/bbox-polygon";

const covJson2GeoJSON: FeatureCollection = (covJson: any) => {
  const axesX = covJson.domain.axes.x;
  const axesY = covJson.domain.axes.y;
  const width = (axesX.stop - axesX.start) / axesX.num;
  const height = (axesY.stop - axesY.start) / axesY.num;
  const output: FeatureCollection = [...Array(axesY.num).keys()].reduce(
    (acc, _cur, index: number) => {
      let indexValue = 0;
      const rowFeatures = [...Array(axesX.num).keys()].map((_, i) => {
        const bbox = [
          axesX.start + width * i,
          axesY.start + height * index,
          axesX.start + width * (i + 1),
          axesY.start + height * (index + 1),
        ];
        const gridFeature = bboxPolygon(bbox, {
          //   properties: { volume: covJson.ranges.temperature.values[indexValue] },
        });
        indexValue = +1;
        // console.log(bbox);
        return gridFeature;
      });
      return { ...acc, features: [...acc.features, ...rowFeatures] };
    },
    { type: "FeatureCollection", features: [] }
  );
  const addVolumeToGrid = output.features.map((f: Feature, i: number) => {
    return {
      ...f,
      properties: { volume: covJson.ranges.temperature.values[i] },
    };
  });
  return {
    ...output,
    features: addVolumeToGrid, //addVolumeToGrid.filter((f: any) => f.properties.volume),
  };
};

export default covJson2GeoJSON;
