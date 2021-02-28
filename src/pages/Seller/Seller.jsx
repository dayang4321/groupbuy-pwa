import React,{useContext} from 'react';
import { Redirect, useHistory } from 'react-router';
import SellForms from '../../containers/SellForms/SellForms';
import { FormContext } from '../../context/FormContext';



function Seller(props) {

    const formContext = useContext(FormContext);

    const history = useHistory()

    let display

    if (formContext.isResumed || !formContext.needsCompleting) {
      

   
        display = <><SellForms  resetIncomplete={formContext.resetPrefill} />
            </>

    }

    else return <Redirect to="/resume"/>

    return (
    <>{display}</>
)


}

export default Seller;