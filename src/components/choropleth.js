import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {legendColor} from 'd3-svg-legend';
import * as topojson from 'topojson';

function ChoroplethMap({
  statistic,
  mapData,
  setHoveredRegion,
  mapMeta,
  selectedRegion,
  setSelectedRegion,
}) {
  const choroplethMap = useRef(null);
  const [svgRenderCount, setSvgRenderCount] = useState(0);

  const ready = useCallback(
    (geoData) => {
      d3.selectAll('svg#chart > *').remove();
      const propertyField = 'st_nm';
      const svg = d3.select(choroplethMap.current);
      const width = +svg.attr('width');
      const height = +svg.attr('height');

      const handleMouseover = (name) => {
        try {
          setHoveredRegion(name, mapMeta);
          setSelectedRegion(name);
        } catch (err) {
          console.log('err', err);
        }
      };

      const topology = topojson.feature(
        geoData,
        geoData.objects[mapMeta.graphObjectName]
      );

      const projection = d3.geoMercator();
      projection.fitSize([width, height], topology);

      const path = d3.geoPath(projection);

      let onceTouchedRegion = null;

      svg
        .append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(topology.features)
        .enter()
        .append('path')
        .attr('class', 'path-region')
        .attr('fill', function (d) {
          const n = parseFloat(mapData[d.properties[propertyField]]) || 0.00;
          const color = (n >= 0.02 ? '#e41a1c' : ((n < 0.02 && n >= 0.01) ? '#fc8d62' : 
                ((n < 0.01 && n > 0.0) ? '#1f78b4' : '#1b9e77'))) ;
          return color;
        })
        .attr('d', path)
        .attr('pointer-events', 'all')
        .on('mouseover', (d) => {
          handleMouseover(d.properties[propertyField]);
        })
        .on('mouseleave', (d) => {
          setSelectedRegion(null);
          if (onceTouchedRegion === d) onceTouchedRegion = null;
        })
        .on('touchstart', (d) => {
          if (onceTouchedRegion === d) onceTouchedRegion = null;
          else onceTouchedRegion = d;
        })
        .on('click', (d) => {
          if (onceTouchedRegion) {
            return;
          }
        })
        .style('cursor', 'pointer')
        .append('title')
        .text(function (d) {
          const value = mapData[d.properties[propertyField]] || 0;
          return (
            Number(
              parseFloat(value).toFixed(3)
            ).toString() +
            '% affected in ' + d.properties[propertyField]
          );
        });

      svg
        .append('path')
        .attr('stroke', '#ff073a20')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr(
          'd',
          path(topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectName]))
        );
    },
    [
      mapData,
      mapMeta,
      statistic.total,
      statistic.maxConfirmed,
      setHoveredRegion,
      setSelectedRegion,
    ]
  );

  const renderData = useCallback(() => {
    const svg = d3.select(choroplethMap.current);

    // Colorbar
    const color = d3
      .scaleOrdinal()
      .domain(["0.00", "0.00-0.01", "0.01-0.02", "0.02+"])
      .range(["rgb(93, 199, 76)", "rgb(56, 106, 197)", "rgb(255,99,71)", "rgb(255,0,0)"]);

    let cells = null;

    const numCells = 4;
    const delta = (0.01);

    cells = Array.from(Array(numCells).keys()).map((i) => i * delta);
    svg
      .append('g')
      .attr('class', 'legendLinear')
      .attr('transform', 'translate(0.000, 0.030)');

    const legendLinear = legendColor()
      .shapeWidth(36)
      .shapeHeight(10)
      .cells(cells)
      .titleWidth(3)
      .labels(["0.00", "0.00-0.01", "0.01-0.02", "0.02+"])
      .title('Confirmed Cases')
      .orient('vertical')
      .scale(color);

    svg
      .select('.legendLinear')
      .call(legendLinear)
      .selectAll('text')
      .style('font-size', '10px');
  }, [statistic.maxConfirmed]);

  useEffect(() => {
    (async () => {
      const data = await d3.json(mapMeta.geoDataFile);
      if (statistic && choroplethMap.current) {
        ready(data);
        renderData();
        setSvgRenderCount((prevCount) => prevCount + 1);
      }
    })();
  }, [mapMeta.geoDataFile, statistic, renderData, ready]);

  const highlightRegionInMap = (name) => {
    const paths = d3.selectAll('.path-region');
    paths.classed('map-hover', (d, i, nodes) => {
      const propertyField = 'st_nm';
      if (name === d.properties[propertyField]) {
        nodes[i].parentNode.appendChild(nodes[i]);
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    highlightRegionInMap(selectedRegion);
  }, [svgRenderCount, selectedRegion]);

  return (
    <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
      <svg
        id="chart"
        width="480"
        height="450"
        viewBox="0 0 480 450"
        preserveAspectRatio="xMidYMid meet"
        ref={choroplethMap}
      ></svg>
    </div>
  );
}

export default ChoroplethMap;
