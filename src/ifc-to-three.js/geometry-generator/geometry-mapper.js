import { mapCurve2D } from "./ifc-curve2d.js";
import { mapSweptSolid } from "./ifc-sweptSolid.js";
import {
  geometryTypes as g,
  namedProps as n,
  structuredData as s,
  typeValue as t,
} from "../../utils/global-constants.js";

const geometryMap = {
  [g.curve2D]: mapCurve2D,
  [g.sweptSolid]: mapSweptSolid,
};

function constructGeometry(structured) {
  structured[s.products].forEach((product) => {
    getRepresentations(product);
    mapARepresentations(product);
  });
}

function getRepresentations(product) {
  getRepresentationValue(product);
  if (product[n.openings])
    product[n.openings].forEach((opening) => {
      getRepresentationValue(opening);
    });
}

function getRepresentationValue(product) {
  product[n.geomRepresentations] =
    product[n.representation][t.value][n.representations][t.value];
}

function mapARepresentations(product) {
  mapProductRepresentations(product);
  if (product[n.openings])
    product[n.openings].forEach((opening) => {
      mapProductRepresentations(opening);
    });
}

function mapProductRepresentations(product) {
  product[n.geometry] = [];
  product[n.geomRepresentations].forEach((representation) => {
    product[n.geometry].push(getMappedGeometry(representation, product));
  });
}

function getMappedGeometry(representation, product) {
  return geometryMap[getType(representation)](representation, product);
}

function getType(representation) {
  return representation[n.representationType][t.value];
}

export { constructGeometry };