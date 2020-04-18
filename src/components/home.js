import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import {formatDistance, format} from 'date-fns';
import Level from './level'
import Table from './table'

import {
  formatDate,
  formatDateAbsolute,
  parseWardData
} from '../utils/common-functions';

import MapExplorer from './mapexplorer';

function Home(props) {
  const [mumbaiWardData, setmumbaiWardData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [activeStateCode, setActiveStateCode] = useState('TT'); // TT -> India
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      const [mumbaiWardResponse] = await Promise.all([axios.get('https://script.google.com/macros/s/AKfycbwEZfKz70mGL1YPW9qBtyx9L3IoLqyhLl46pnGb3kkqIcip2A/exec?id=17jRnQ8hS764Q7yqZ2l2qUIO6LYECWrKLsLUuYl2fYxI&sheet=COVID-19%20Cases')]);
      const wardData = parseWardData(mumbaiWardResponse.data);
      setmumbaiWardData(wardData);
      setLastUpdated(wardData[0]["Date_Entered"]);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) return setRegionHighlighted(null);
    setRegionHighlighted({state, index});
  };

  const onMapHighlightChange = useCallback(({statecode}) => {
    setActiveStateCode(statecode);
  }, []);

  const ref = useRef()

  return (
    <React.Fragment>
      <div className="Home">
        <div className="home-left">
          <div className="header fadeInUp" style={{animationDelay: '1s'}}>
            <div className="header-mid">
              <div className="titles">
                <h1>Mumbai COVID-19 Tracker</h1>
              </div>
              <div className="last-update">
                <h6>Last Updated</h6>
                <h6 style={{color: '#28a745', fontWeight: 600}}>
                  {lastUpdated}
                </h6>
                <h6 style={{color: '#28a745', fontWeight: 600}}>
                  {isNaN(Date.parse(formatDate(lastUpdated)))
                    ? ''
                    : formatDateAbsolute(lastUpdated)}
                </h6>
              </div>
            </div>
            {mumbaiWardData.length ? <Level data={mumbaiWardData[0]} /> : ''}
            {fetched && (
            <Table
              states={mumbaiWardData}
              onHighlightState={onHighlightState}
            />
          )}
          </div>
        </div>

        <div className="home-right">
          {fetched && (
            <React.Fragment>
              <MapExplorer
                forwardRef={ref}
                states={mumbaiWardData}
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
