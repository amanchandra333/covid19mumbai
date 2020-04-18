import React, {useState, useEffect} from 'react';

import Row from './row';

const VERY_CONGESTED_FIELD = "Number_of_Cases-_Very_Congested_Area";
const MEDIUM_CONGESTED_FIELD = "Number_of_Cases-_Medium_Congested";
const STANDALONE_FIELD = "Number_of_Cases-_Standalone_Structure";

function Table(props) {
  const [states, setStates] = useState(props.states.slice(2));
  // console.log(states);
  const [revealedStates, setRevealedStates] = useState({});
  const [count, setCount] = useState(0);
  const [sortData, setSortData] = useState({
    sortColumn: localStorage.getItem('state.sortColumn')
      ? localStorage.getItem('state.sortColumn')
      : 'TOTAL',
    isAscending: localStorage.getItem('state.isAscending')
      ? localStorage.getItem('state.isAscending') === 'true'
      : false,
  });

  useEffect(() => {
    if (props.states[0]) {
      setRevealedStates(
        props.states.reduce((a, state) => {
          return {...a, [state.Ward]: false};
        }, {})
      );
    }
  }, [props.states]);

  useEffect(() => {
    if (states.length > 0) {
      setCount(states.filter((s) => s && s["TOTAL"] > 0).length);
    }
  }, [states]);


  const doSort = (e, props) => {
    const totalRow = states.splice(0,1);
    states.sort((StateData1, StateData2) => {
      const sortColumn = sortData.sortColumn;
      let value1 = StateData1[sortColumn];
      let value2 = StateData2[sortColumn];

      if (sortColumn !== 'Ward') {
        value1 = parseInt(StateData1[sortColumn]);
        value2 = parseInt(StateData2[sortColumn]);
      }

      if (sortData.isAscending) {
        return value1 > value2
          ? 1
          : value1 === value2 && StateData1['Ward'] > StateData2['Ward']
          ? 1
          : -1;
      } else {
        return value1 < value2
          ? 1
          : value1 === value2 && StateData1['Ward'] > StateData2['Ward']
          ? 1
          : -1;
      }
    });
    states.unshift(totalRow[0]);
  };

  const handleSort = (e, props) => {
    const currentsortColumn = e.currentTarget
      .querySelector('abbr')
      .getAttribute('title');
    const isAscending =
      sortData.sortColumn === currentsortColumn
        ? !sortData.isAscending
        : sortData.sortColumn === 'Ward';
    setSortData({
      sortColumn: currentsortColumn,
      isAscending: isAscending,
    });
    localStorage.setItem('state.sortColumn', currentsortColumn);
    localStorage.setItem('state.isAscending', isAscending);
  };

  const handleReveal = (state) => {
    setRevealedStates({
      ...revealedStates,
      [state]: !revealedStates[state],
    });
  };

  doSort();

  return (
    <React.Fragment>
      <table className="table fadeInUp" style={{animationDelay: '1.8s'}}>
        <thead>
          <tr>
            <th
              className="sticky state-heading"
              onClick={(e) => handleSort(e, props)}
            >
              <div className="heading-content">
                <abbr title="Ward">Ward</abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'Ward' ? 'initial' : 'none',
                  }}
                >
                  {sortData.isAscending ? (
                    <div className="arrow-up" />
                  ) : (
                    <div className="arrow-down" />
                  )}
                </div>
              </div>
            </th>
            <th className="sticky" onClick={(e) => handleSort(e, props)}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? 'is-cherry' : ''}`}
                  title="Number_of_Cases-_Very_Congested_Area"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? 'VC'
                      : 'VCngstd'
                    : 'Very Congested'}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'Number_of_Cases-_Very_Congested_Area' ? 'initial' : 'none',
                  }}
                >
                  {sortData.isAscending ? (
                    <div className="arrow-up" />
                  ) : (
                    <div className="arrow-down" />
                  )}
                </div>
              </div>
            </th>
            <th className="sticky" onClick={(e) => handleSort(e, props)}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? 'is-blue' : ''}`}
                  title="Number_of_Cases-_Medium_Congested"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? 'MC'
                      : 'MCngstd'
                    : 'Med Congested'}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'Number_of_Cases-_Medium_Congested' ? 'initial' : 'none',
                  }}
                >
                  {sortData.isAscending ? (
                    <div className="arrow-up" />
                  ) : (
                    <div className="arrow-down" />
                  )}
                </div>
              </div>
            </th>
            <th className="sticky" onClick={(e) => handleSort(e, props)}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? 'is-green' : ''}`}
                  title="Number_of_Cases-_Standalone_Structure"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? 'S'
                      : 'Stndln'
                    : 'Standalone'}
                </abbr>
                <div
                  className={
                    sortData.sortColumn === 'Number_of_Cases-_Standalone_Structure' ? 'sort-black' : ''
                  }
                ></div>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'Number_of_Cases-_Standalone_Structure' ? 'initial' : 'none',
                  }}
                >
                  {sortData.isAscending ? (
                    <div className="arrow-up" />
                  ) : (
                    <div className="arrow-down" />
                  )}
                </div>
              </div>
            </th>
            <th className="sticky" onClick={(e) => handleSort(e, props)}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? 'is-gray' : ''}`}
                  title="TOTAL"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? 'T'
                      : 'Total'
                    : 'Total'}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === 'TOTAL' ? 'initial' : 'none',
                  }}
                >
                  {sortData.isAscending ? (
                    <div className="arrow-up" />
                  ) : (
                    <div className="arrow-down" />
                  )}
                </div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {states.map((state, index) => {
            if (index !== 0 && state.TOTAL > 0) {
              return (
                <Row
                  key={index}
                  state={state}
                  total={false}
                  onHighlightState={props.onHighlightState}
                />
              );
            }
            return null;
          })}
        </tbody>

        <tbody>
          {states.length > 1 && props.summary === false && (
            <Row
              key={0}
              state={states[0]}
              total={true}
              onHighlightState={props.onHighlightState}
            />
          )}
        </tbody>
      </table>
      <h5 className="table-fineprint fadeInUp" style={{animationDelay: '1s'}}>
        {count} Wards Affected
      </h5>
    </React.Fragment>
  );
}

export default Table;
