import {scaleOrdinal as d3_scaleOrdinal} from 'd3-scale'
import {hsl as d3_hsl} from 'd3-color'

const ColorSet = ["#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#d9d9d9",
    "#bc80bd",
    "#ccebc5",
    "#ffed6f",
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a",
    "#ffff99",
    "#b15928",
];


export const componentList = [
    //@formatter:off
  { order: 1,  id: "enrich"       , inPorts: 1 , outPorts: 1, type: "enrich"        , name: "Enrich"       , description: "This component creates a http request based on the data it recieves" },
  { order: 2,  id: "router"       , inPorts: 1 , outPorts: 2, type: "router"        , name: "Router"       , description: "SSHOperator" },
  { order: 3,  id: "grpc"         , inPorts: 1 , outPorts: 1, type: "grpc"          , name: "Grpc"         , description: "PythonOperator" },
  { order: 4,  id: "sub_workflow" , inPorts: 1 , outPorts: 1, type: "sub_workflow"  , name: "Sub Workflow" , description: "DummyOperator" },
  { order: 5,  id: "custom"       , inPorts: 1 , outPorts: 1, type: "custom"        , name: "Custom"       , description: "SubDagOperator" },
  { order: 5,  id: "return"       , inPorts: 1 , outPorts: 1, type: "return"        , name: "Return"       , description: "This component let's you run SAS code based on data passed by previous node" },
  { order: 6,  id: "http"         , inPorts: 1 , outPorts: 1, type: "http"          , name: "http"         , description: "This component let's you run Excel formulae on data passed by previous node" },
  { order: 7,  id: "add_items"    , inPorts: 1 , outPorts: 1, type: "add_items"     , name: "add_items"    , description: "Truth Table" },
  //@formatter:on
];

const ColorScale = function (darkness) {
    return d3_scaleOrdinal()
        .domain(componentList.map(operator => operator.id))
        .range(ColorSet.map(function (c) {
            return d3_hsl(c).darker(darkness).toString();
        }));
};

export default ColorScale

export const FillColor = ColorScale(-0.1);
export const StrokeColor = ColorScale(0.7);

