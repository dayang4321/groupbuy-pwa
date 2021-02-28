import React,{useContext} from 'react';
import SellForms from '../../containers/SellForms/SellForms';
import { FormContext } from '../../context/FormContext';



function Seller(props) {

    const formContext = useContext(FormContext);

    let display = (<div>
<SellForms  resetIncomplete={formContext.resetPrefill} />
    </div>)

    return (
        display
    )
}

export default Seller;