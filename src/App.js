import './App.css';
import {Fragment, useEffect, useRef} from "react";

import {select as d3_select} from 'd3-selection';

function App() {

    let svgRef = useRef(null)
    const canvasWidth = 2000
    const canvasHeight = 2000
    const gridSize = 20

    useEffect(() => {

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

        updateGrid(vis.append("g"))
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
