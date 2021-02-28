import React from 'react';
import {Tooltip,OverlayTrigger} from 'react-bootstrap'
import {ReactComponent as InfoIcon} from '../../../assets/img/svg/info-icon.svg';

import './FormToolTip.css'


const tooltipTextArr = [<span>It’s important to properly name your product so as to help make it easy for people to find your product.</span>,
    <span>GroupBuy requires the products are fully detailed, giving the specification that is necessary for the product to be properly understood by people who are interested in this deal</span>,
    <span>This is total number of units required to make the purchase work. The deal would be open to people to join until this number is reached. After this the order is made and deal closed.</span>,
  <span>This is the minimum amount a buyer can get to take advantage of the deal.</span>,
  <span>This is the actual amount for for a single unit of this item in regular markets and other platforms. This helps the buyers appreciate the deals much more when they compare.</span>,
  <span>This is the set date for this deal to close and if the deal amount isn’t hit by then, the transaction is canceled and all buyers are fully refunded.</span>,
  <span>After a deal is completed, you can allow interested buyers to restart the deal. You would be notified if this a buyer wants to restart your deal. The deal would have the same details you have provided unless you change it.</span>,
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
            trigger={["click"]}
      >
        <div className="toolicon position-absolute">
            <InfoIcon/>
            </div>
    </OverlayTrigger>
    )
}

export default FormToolTip;