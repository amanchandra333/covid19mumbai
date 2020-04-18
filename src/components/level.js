import React, {useState, useEffect} from 'react';
import {formatNumber} from '../utils/common-functions';

//  to acces the fields in the JSON created from sheet
const VERY_CONGESTED_FIELD = "Number_of_Cases-_Very_Congested_Area";
const MEDIUM_CONGESTED_FIELD = "Number_of_Cases-_Medium_Congested";
const STANDALONE_FIELD = "Number_of_Cases-_Standalone_Structure";
const TOTAL = "TOTAL";

function Level(props) {
  return (
    <div className="Level">
    <div
        className="level-item is-cherry fadeInUp"
        style={{animationDelay: '1s'}}
      >
        <h5>Total Affected</h5>
        <h1>{formatNumber(props.data[TOTAL])} </h1>
      </div> 

      <div
        className="level-item is-cherry fadeInUp"
        style={{animationDelay: '1s'}}
      >
        <h5>Very Congested Area</h5>
        <h1>{formatNumber(props.data[VERY_CONGESTED_FIELD])} </h1>
      </div>

      <div
        className="level-item is-orange fadeInUp"
        style={{animationDelay: '1.1s'}}
      >
        <h5 className="heading">Medium Congested Area</h5>
       <h1 className="title has-text-info">{formatNumber(props.data[MEDIUM_CONGESTED_FIELD])}</h1>
      </div>

      <div
        className="level-item is-blue fadeInUp"
        style={{animationDelay: '1.2s'}}
      >
        <h5 className="heading">Standalone Area</h5>
        <h1 className="title has-text-success">{formatNumber(props.data[STANDALONE_FIELD])} </h1>
      </div>

    </div>
  );
}

export default Level;
