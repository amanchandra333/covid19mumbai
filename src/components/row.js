import React, {useState, useEffect, useCallback} from 'react';
import * as Icon from 'react-feather';
import {
  formatDate,
  formatDateAbsolute,
  formatNumber,
} from '../utils/common-functions';
import {formatDistance} from 'date-fns';

const VERY_CONGESTED_FIELD = "Number_of_Cases-_Very_Congested_Area";
const MEDIUM_CONGESTED_FIELD = "Number_of_Cases-_Medium_Congested";
const STANDALONE_FIELD = "Number_of_Cases-_Standalone_Structure";
const WARD = "Ward";
const TOTAL = "TOTAL";

function Row(props) {
  const [state, setState] = useState(props.state);

  useEffect(() => {
    setState(props.state);
  }, [props.state]);


  const handleReveal = () => {
    props.handleReveal(props.state.WARD);
  };


  return (
    <React.Fragment>
      <tr
        className={props.total ? 'state is-total' : 'state'}
        onMouseEnter={() => props.onHighlightState?.(state, props.index)}
        style={{background: props.index % 2 === 0 ? '#f8f9fa' : ''}}
      >
        <td style={{fontWeight: 600}}>
          <div className="table__title-wrapper">
            <span className="actual__title-wrapper">
              {state.Ward}
            </span>
          </div>
        </td>
        <td>
          <span className="table__count-text">
            {parseInt(state["Number_of_Cases-_Very_Congested_Area"]) === 0
              ? '-'
              : formatNumber(state["Number_of_Cases-_Very_Congested_Area"])}
          </span>
        </td>
        <td
          style={{color: parseInt(state["Number_of_Cases-_Medium_Congested"]) === 0 ? '#B5B5B5' : 'inherit'}}
        >
          {parseInt(state["Number_of_Cases-_Medium_Congested"]) === 0 ? '-' : formatNumber(state["Number_of_Cases-_Medium_Congested"])}
        </td>
        <td
          style={{
            color: parseInt(state["Number_of_Cases-_Standalone_Structure"]) === 0 ? '#B5B5B5' : 'inherit',
          }}
        >
          <span className="table__count-text">
            {parseInt(state["Number_of_Cases-_Standalone_Structure"]) === 0
              ? '-'
              : formatNumber(state["Number_of_Cases-_Standalone_Structure"])}
          </span>
        </td>
        <td
          style={{color: parseInt(state.TOTAL) === 0 ? '#B5B5B5' : 'inherit'}}
        >
          <span className="table__count-text">
            {parseInt(state.TOTAL) === 0 ? '-' : formatNumber(state.TOTAL)}
          </span>
        </td>
      </tr>

      <tr
        className={`spacer`}
        style={{display: props.reveal && !props.total ? '' : 'none'}}
      >
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </React.Fragment>
  );
}

export default Row;
