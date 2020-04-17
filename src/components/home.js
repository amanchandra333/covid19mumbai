import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import {formatDistance, format} from 'date-fns';

import {
  formatDate,
  formatDateAbsolute,
  preprocessTimeseries,
  parseStateTimeseries,
  parseWardData
} from '../utils/common-functions';

import Table from './table';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  const [mumbaiWardData, setmumbaiWardData] = useState({});
  const [stateTestData, setStateTestData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState({});
  const [activeStateCode, setActiveStateCode] = useState('TT'); // TT -> India
  const [activityLog, setActivityLog] = useState([]);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      const [
        response,
        stateDistrictWiseResponse,
        {data: statesDailyResponse},
        updateLogResponse,
        stateTestResponse,
        mumbaiWardResponse
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get('https://api.covid19india.org/updatelog/log.json'),
        axios.get('https://api.covid19india.org/state_test_data.json'),
        axios.get('https://script.google.com/macros/s/AKfycbwEZfKz70mGL1YPW9qBtyx9L3IoLqyhLl46pnGb3kkqIcip2A/exec?id=17jRnQ8hS764Q7yqZ2l2qUIO6LYECWrKLsLUuYl2fYxI&sheet=COVID-19%20Cases')
      ]);
      setStates(response.data.statewise);
      const wardData = parseWardData(mumbaiWardResponse.data);
      setmumbaiWardData(wardData);
      console.log(wardData);
      const ts = parseStateTimeseries(statesDailyResponse);
      ts['TT'] = preprocessTimeseries(response.data.cases_time_series); // TT -> India
      setTimeseries(ts);
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setStateTestData(stateTestResponse.data.states_tested_data.reverse());
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      setActivityLog(updateLogResponse.data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) return setRegionHighlighted(null);
    setRegionHighlighted({state, index});
  };
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) return setRegionHighlighted(null);
    setRegionHighlighted({district, state, index});
  };

  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
  }, []);

  const refs = [useRef(), useRef(), useRef()];
  // const scrollHandlers = refs.map((ref) => () =>
  //   window.scrollTo({
  //     top: ref.current.offsetTop,
  //     behavior: 'smooth',
  //   })
  // );

  return (
    <React.Fragment>
      <div className="Home">
        <div className="home-left">
          <div className="header fadeInUp" style={{animationDelay: '1s'}}>
            <div className="header-mid">
              <div className="titles">
                <h1>Mumbai COVID-19 Tracker</h1>
                <h6 style={{fontWeight: 600}}>A Crowdsourced Initiative</h6>
              </div>
              <div className="last-update">
                <h6>Last Updated</h6>
                <h6 style={{color: '#28a745', fontWeight: 600}}>
                  {isNaN(Date.parse(formatDate(lastUpdated)))
                    ? ''
                    : formatDistance(
                        new Date(formatDate(lastUpdated)),
                        new Date()
                      ) + ' Ago'}
                </h6>
                <h6 style={{color: '#28a745', fontWeight: 600}}>
                  {isNaN(Date.parse(formatDate(lastUpdated)))
                    ? ''
                    : formatDateAbsolute(lastUpdated)}
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="home-right">
          {fetched && (
            <React.Fragment>
              <MapExplorer
                forwardRef={refs[1]}
                states={mumbaiWardData}
                stateDistrictWiseData={stateDistrictWiseData}
                stateTestData={stateTestData}
                regionHighlighted={regionHighlighted}
                onMapHighlightChange={onMapHighlightChange}
              />


            </React.Fragment>
          )}
        </div>

      </div>

    </React.Fragment>
  );
}

export default Home;
