import './App.css';
import {Fragment, useEffect, useRef} from "react";

import {select as d3_select} from 'd3-selection';
import {FillColor, StrokeColor} from "./utils/color";
import {drag as d3_drag} from 'd3-drag'

const node_height = 36
const node_width = 120

function redrawNode(nodeLayer, activeNodes) {

    const node = nodeLayer.selectAll('.nodegroup')
        .data(activeNodes, function (d) {
            return d.id;
        });

    node.exit().remove();

    node.selectAll('rect')
        .attr("stroke-width", function (d) {
            if (d.selected) {
                return 2;
            } else return 1;
        })
        .attr('stroke', function (d) {
            if (d.selected) {
                return "#ff7f0e"
            } else return StrokeColor(d.nodetype);
        })

    const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node nodegroup')

    nodeEnter.attr('id', d => d.id)
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        .call(d3_drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        .on('dblclick', function (d) {
            console.log("Double CLicked!!")
            // store.dispatch(contentAreaWorkspaceCanvasPropertiesShow({
            //     nodeType: d.nodeType,
            //     nodeId: d.id
            // }))
            // d3_event.stopPropagation()
            //TODO: add properties popup.. Similar to airflow output
        })
        .on("click", function (d) {

            let selectStatus = false;
            let selectedNodeId = ""

            let newActiveNodes = activeNodes.map(x => {
                x.selected = x.id === d.id ? !d.selected : false

                if (x.selected) {
                    selectStatus = true;
                    selectedNodeId = x.id
                }

                return x;
            })

            // store.dispatch(contentAreaWorkspaceCanvasUpdateNode({
            //     id: that.graphId,
            //     nodeData: newActiveNodes,
            //     linkData: that.activeLinks
            // }));
            //
            // store.dispatch(contentAreaWorkspaceCanvasSelectNode({
            //     selectedNode: selectStatus,
            //     selectedNodeId : selectedNodeId
            // }))
        })


    //TODO: node.each loop to clicl selector
    //
    nodeEnter.append('rect')
        .attr('class', 'node')
        .classed('node_unknown', function (d) {
            return d.nodetype === 'unknown';
        })

        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', function (d) {
            return FillColor(d.nodetype);
        })
        .attr("stroke-width", function (d) {
            if (d.selected) {
                return 2;
            } else return 1;
        })
        .attr('stroke', function (d) {
            if (d.selected) {
                return "#ff7f0e"
            } else return StrokeColor(d.nodetype);
        })
        .attr('height', function (d) {
            d.h = node_height;
            return d.h;
        })
        // TODO: revisit length logic
        .attr('width', function (d) {
            d.w = calculateTextWidth(d.nodetype, 'node_label', 10) + 10;
            return d.w;
        })

    nodeEnter.append('text')
        .attr('class', 'node_label')
        .attr('x', 10)
        .attr('y', 16)
        .attr('dy', '.35em')
        .attr('text-anchor', 'start')
        .text(d => d.nodetype);

    nodeEnter.each(function (d) {

        // if (componentList.filter(x => x.id === d.nodetype)[0].inPorts === 0) return;

        let nodePortInput = d3_select(this).append('g')
            .attr('class', 'port_input')
            .attr('transform', d => 'translate(-5,' + ((d.h / 2) - 5) + ')');

        nodePortInput.append('rect')
            .attr('class', 'port')
            .attr('rx', '3')
            .attr('ry', '3')
            .attr('width', '10')
            .attr('height', '10')
        // .on('mousedown', function (d, i) {
        //     console.log('input-port-mouse-down' + i);
        //     that.portMouseDown(d, that.PORT_TYPE_INPUT, i);
        // })
        // .on('mouseup', function (d, i) {
        //     console.log('input-port-mouse-mouseup');
        //     that.portMouseUp(d, that.PORT_TYPE_INPUT, 0);
        // })
        // .on('mousedown', function (d, i) {
        //     that.portMouseDown(d, that.PORT_TYPE_INPUT, 0);
        // })
        // .on('mouseover', function (d) {
        //     console.log('input-port-mouse-mouseover');
        //     that.portMouseOver(d3_select(this), d, that.PORT_TYPE_INPUT, 0);
        // })
        // .on('mouseout', function (d) {
        //     console.log('input-port-mouse-mouseout');
        //     that.portMouseOut(d3_select(this), d, that.PORT_TYPE_INPUT, 0);
        // });
    })

    nodeEnter.each(function (d) {
        // if (componentList.filter(x => x.id === d.nodetype)[0].outPorts === 0) return;

        let nodePortOutput = d3_select(this).append('g')
            .attr('class', 'port_output')
            // .attr("transform", "translate(115,10)")
            .attr('transform', function (d) {
                let i = 0;
                let y = (d.h / 2);
                /*-((numOutputs-1)/2)*13*/
                let x = d.w - 5;
                return 'translate(' + x + ',' + ((y + 13 * i) - 5) + ')';
            });

        nodePortOutput.append('rect')
            .attr('class', 'port')
            .attr('rx', '3')
            .attr('ry', '3')
            .attr('width', '10')
            .attr('height', '10')
        // .on('mousedown', function (d, j) {
        //     console.log('output-port-mouse-down' + j);
        //     that.portMouseDown(d, that.PORT_TYPE_OUTPUT, 0);
        // })
        // .on('mouseup', function (d) {
        //     that.portMouseUp(d, that.PORT_TYPE_OUTPUT, 0);
        // })
        // .on('mouseover', function (d) {
        //     that.portMouseOver(d3_select(this), d, that.PORT_TYPE_OUTPUT, 0);
        // })
        // .on('mouseout', function (d) {
        //     that.portMouseOut(d3_select(this), d, that.PORT_TYPE_OUTPUT, 0);
        // });

    })

    function dragstarted(d) {
        d3_select(this).classed('active', true);
    }

    function dragged(d) {
        this.x = this.x || d.x;
        this.y = this.y || d.y;
        // this.x += d3_event.dx;
        // this.y += d3_event.dy;

        d3_select(this).attr('transform', 'translate(' + this.x + ',' + this.y + ')');

        activeNodes = activeNodes.map(a => {
            if (a.id === d.id) {
                a.x = this.x;
                a.y = this.y;
            }
            a.selected = a.id === d.id

            return a;
        });

        // store.dispatch(contentAreaWorkspaceCanvasUpdateNode({
        //     id: that.graphId,
        //     nodeData: that.activeNodes,
        //     linkData: that.activeLinks
        // }));

    }

    function dragended(d) {
        d3_select(this).classed('active', false);
    }

    function calculateTextWidth(str, className, offset) {
        return calculateTextDimensions(str, className, offset, 0)[0];
    };

    function calculateTextDimensions(str, className, offsetW, offsetH) {
        let sp = document.createElement('span');
        sp.className = className;
        sp.style.position = 'absolute';
        sp.style.top = '-1000px';
        sp.textContent = (str || '');
        document.body.appendChild(sp);
        let w = sp.offsetWidth;
        let h = sp.offsetHeight;
        document.body.removeChild(sp);
        return [offsetW + w, offsetH + h];
    };
}

function convertDomToSvgCoordinate(x, y) {
    let node = d3_select('#chart>svg').node();
    let svgRect = node.createSVGPoint();
    console.log(x, y)
    svgRect.x = x;
    svgRect.y = y;

    const _svgRect = svgRect.matrixTransform(node.getScreenCTM().inverse());

    return {
        x: _svgRect.x,
        y: _svgRect.y
    };
};

function addNodeToCanvas(nodetype, _x, _y) {

    let {x, y} = convertDomToSvgCoordinate(_x, _y);

    const id = (1 + Math.random() * 4294967295).toString(16);
    return ({
        id,
        nodetype,
        x,
        y,
        inputs: 1,
        outputs: 1,
        changed: false,
        dirty: false,
        valid: true,
        selected: false
    })
}

function App() {

    let svgRef = useRef(null)
    const canvasWidth = 2000
    const canvasHeight = 2000
    const gridSize = 20

    useEffect(() => {

        let activeNodes = []

        let outer = d3_select(svgRef.current)
            .append('svg')
            .attr('class', 'outerCanvas')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .style('cursor', 'crosshair')
            .on('contextmenu', function () {
                //TODO: add context menu thingy for future
                // d3_event.preventDefault();
            });

        let vis = outer.append('g')
            .on('dblclick.zoom', null)
            .append('g')
            .attr('class', 'innerCanvas')

        activeNodes.push(addNodeToCanvas("test", 1, 2))

        updateGrid(vis.append("g"))
        redrawNode(vis.append("g"), activeNodes)
    }, [])


    const updateGrid = (grid) => {
        let gridTicks = [];
        for (let i = 0; i < canvasWidth; i += gridSize) {
            gridTicks.push(i);
        }
        grid.selectAll('line.horizontal').remove();

        grid.selectAll('line.horizontal')
            .data(gridTicks)
            .enter()
            .append('line')
            .attr('class', 'horizontal')
            .attr('x1', 0)
            .attr('x2', canvasWidth)
            .attr('y1', d => d)
            .attr('y2', d => d)
            .attr('fill', 'none')
            .attr('shape-rendering', 'crispEdges')
            .attr('stroke', '#eee')
            .attr('stroke-width', '1px');

        grid.selectAll('line.vertical').remove();
        grid.selectAll('line.vertical').data(gridTicks).enter()
            .append('line')
            .attr('class', 'vertical')
            .attr('y1', 0)
            .attr('y2', canvasWidth)
            .attr('x1', d => d)
            .attr('x2', d => d)
            .attr('fill', 'none')
            .attr('shape-rendering', 'crispEdges')
            .attr('stroke', '#eee')
            .attr('stroke-width', '1px');
    }

    return <Fragment>

        <div
            id={"chart"}
            ref={svgRef}
            style={{width: "100%", height: "100vh"}}
        />
    </Fragment>
}

export default App;
