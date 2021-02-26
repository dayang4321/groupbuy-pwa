import React from 'react';
import {Tooltip,OverlayTrigger} from 'react-bootstrap'
import {ReactComponent as InfoIcon} from '../../../assets/img/svg/info-icon.svg';

import './FormToolTip.css'


const tooltipTextArr = [<span>It’s important to properly name your product so as to help make it easy for people to find your product.</span>,
    <span>Declutter products are majorly pre-owned products and our buyers know this, they would like to know why the products are being sold to further improve their confidence in the sale.</span>,
    <span>Declutter pricing system advices that prices posted on our platform is way lower than the average market price. This encourages people buy faster.</span>,
  <span>Declutter ensures transparency in every sale. Sellers are required to catalogue pictures of any defect on their product and this would help prevent issues of returns after sale.<br /> Several buyers are comforatable buying products with defects and fixing as long as the price is right. So this doesn’t reduce your chances of sale.</span>,
  <span>Declutter allows you put up products that are not ready to be released immediately and gives you the flexiblity of letting the buyer know exactly when the product will be released.</span>,
  <span>Declutter requires our sellers add any extra explanations about the status of poduct in the description  e.g. brand new but no carton, in working condition but compressor needs to be fixed etc.</span>
]


function FormToolTip(props) {

    const {textArrIndex } = props;

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          {tooltipTextArr[textArrIndex]}
        </Tooltip>
      );

    return (

        <OverlayTrigger
        placement="bottom-end"
        delay={{ show: 200, hide: 200 }}
            overlay={renderTooltip}
            trigger={["click", "hover","focus"]}
      >
        <div className="toolicon position-absolute">
            <InfoIcon/>
            </div>
    </OverlayTrigger>
    )
}

export default FormToolTip;