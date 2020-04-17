import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ChoroplethMap from './choropleth';
import {MAP_TYPES, MAPS_DIR} from '../constants';
import {formatDate, formatDateAbsolute} from '../utils/common-functions';
import {formatDistance, format, parse} from 'date-fns';
import {formatNumber} from '../utils/common-functions';
import * as Icon from 'react-feather';

const mapMeta = {
  Mumbai: {
    name: 'Mumbai',
    geoDataFile: `${MAPS_DIR}/mumbai.json`,
    mapType: MAP_TYPES.COUNTRY,
    graphObjectName: 'export',
  },
  India: {
    name: 'India',
    geoDataFile: `${MAPS_DIR}/india.json`,
    mapType: MAP_TYPES.COUNTRY,
    graphObjectName: 'india',
  },
};

const getRegionFromState = (state) => {
  if (!state) return;
  const region = {...state};
  if (!region.name) region.name = region.Ward;
  return region;
};

const getRegionFromDistrict = (districtData, name) => {
  if (!districtData) return;
  const region = {...districtData};
  if (!region.name) region.name = region.name;
  return region;
};

function MapExplorer({
  forwardRef,
  states,
  stateDistrictWiseData,
  stateTestData,
  regionHighlighted,
  onMapHighlightChange,
}) {

  //******************************
  // states == wards
  //******************************
  const [selectedRegion, setSelectedRegion] = useState({});
  const [panelRegion, setPanelRegion] = useState(getRegionFromState(states[0]));
  const [currentHoveredRegion, setCurrentHoveredRegion] = useState(
    getRegionFromState(states[0])
  );
  const [testObj, setTestObj] = useState({});
  const [currentMap, setCurrentMap] = useState(mapMeta.Mumbai);

  const [statistic, currentMapData] = useMemo(() => {
    const statistic = {total: 0, maxConfirmed: 0};
    let currentMapData = {};
    currentMapData = states.reduce((acc, state) => {
      if (state.Ward === 'Total') {
        return acc;
      }
      const a = (isNaN(parseInt(state['Number_of_Cases-_Very_Congested_Area'])) ?
                0 : parseInt(state['Number_of_Cases-_Very_Congested_Area']));
      const b = (isNaN(parseInt(state['Number_of_Cases-_Medium_Congested'])) ?
                      0 : parseInt(state['Number_of_Cases-_Medium_Congested']));
      const c = (isNaN(parseInt(state['Number_of_Cases-_Standalone_Structure'])) ?
                0 : parseInt(state['Number_of_Cases-_Standalone_Structure']));
      acc[state.Ward] = a+b+c;
      return acc;
    }, {});
    return [statistic, currentMapData];
  }, [currentMap, states, stateDistrictWiseData]);

  const setHoveredRegion = useCallback(
    (name, currentMap) => {
      const region = getRegionFromState(
        states.find((state) => name === state.Ward)
      );
      setCurrentHoveredRegion(region);
      setPanelRegion(region);
      onMapHighlightChange(region);
    },
    [states, stateDistrictWiseData, onMapHighlightChange]
  );

  // useEffect(() => {
  //   if (regionHighlighted === undefined) {
  //     return;
  //   } else if (regionHighlighted === null) {
  //     setSelectedRegion(null);
  //     return;
  //   }
  //   const isState = !('district' in regionHighlighted);
  //   if (isState) {
  //     const newMap = mapMeta['Mumbai'];
  //     setCurrentMap(newMap);
  //     const region = getRegionFromState(regionHighlighted.state);
  //     setHoveredRegion(region.name, newMap);
  //     setSelectedRegion(region.name);
  //   } else {
  //     const newMap = mapMeta[regionHighlighted.state.state];
  //     if (!newMap) {
  //       return;
  //     }
  //     setCurrentMap(newMap);
  //     setHoveredRegion(regionHighlighted.district, newMap);
  //     setSelectedRegion(regionHighlighted.district);
  //   }
  // }, [regionHighlighted, setHoveredRegion]);

  const switchMapToState = useCallback(
    (name) => {
  //     const newMap = mapMeta[name];
  //     if (!newMap) {
  //       return;
  //     }
  //     setCurrentMap(newMap);
  //     setSelectedRegion(null);
  //     if (newMap.mapType === MAP_TYPES.COUNTRY) {
  //       setHoveredRegion(states[0].state, newMap);
  //     } else if (newMap.mapType === MAP_TYPES.STATE) {
  //       const {districtData} = stateDistrictWiseData[name] || {};
  //       const topDistrict = Object.keys(districtData)
  //         .filter((name) => name !== 'Unknown')
  //         .sort((a, b) => {
  //           return districtData[b].confirmed - districtData[a].confirmed;
  //         })[0];
  //       setHoveredRegion(topDistrict, newMap);
  //     }
    },
    [setHoveredRegion, stateDistrictWiseData, states]
  );

  const {name, lastupdatedtime} = currentHoveredRegion;

  useEffect(() => {
    setTestObj(
      stateTestData.find(
        (obj) => obj.state === panelRegion.name && obj.totaltested !== ''
      )
    );
  }, [panelRegion, stateTestData, testObj]);

  return (
    <div
      className="MapExplorer fadeInUp"
      style={{animationDelay: '1.5s'}}
      ref={forwardRef}
    >
      <div className="header">
        <h1>{currentMap.name}</h1>
        <h6>
          {window.innerWidth <= 769 ? 'Tap' : 'Hover'} over a{' '}
          {currentMap.mapType === MAP_TYPES.COUNTRY ? 'Ward' : 'district'}{' '}
          for more details
        </h6>
      </div>

      <div className="map-stats">
        <div className="stats fadeInUp" style={{animationDelay: '2s'}}>
          <h5>{window.innerWidth <= 769 ? 'VCongAr' : 'Very Congested'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion["Number_of_Cases-_Very_Congested_Area"])}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div
          className="stats is-orange fadeInUp"
          style={{animationDelay: '2.1s'}}
        >
          <h5>{window.innerWidth <= 769 ? 'MedCong' : 'Med. Congested'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion["Number_of_Cases-_Medium_Congested"])}</h1>
            <h6>{}</h6>
          </div>
        </div>

        <div
          className="stats is-blue fadeInUp"
          style={{animationDelay: '2.2s'}}
        >
          <h5>{window.innerWidth <= 769 ? 'Alone' : 'Standalone'}</h5>
          <div className="stats-bottom">
            <h1>{formatNumber(panelRegion["Number_of_Cases-_Standalone_Structure"])}</h1>
            <h6>{}</h6>
          </div>
        </div>
      </div>


      <ChoroplethMap
        statistic={statistic}
        mapMeta={currentMap}
        mapData={currentMapData}
        setHoveredRegion={setHoveredRegion}
        changeMap={switchMapToState}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
    </div>
  );
}

export default MapExplorer;
