import React,{useContext, useState} from 'react';
import Loader from '../../components/UI/Loader/Loader';
import Resume from '../../containers/Resume/Resume';
import SellForms from '../../containers/SellForms/SellForms';
import { FormContext } from '../../context/FormContext';



function Seller(props) {

    const formContext = useContext(FormContext);

    const [isResumed, setIsResumed] = useState(false)
    




    let display =  (<div>
<SellForms  resetIncomplete={formContext.resetPrefill} />
    </div>)

    if (formContext.isInCompleteLoading) {
        display =  <div>
            <Loader />
        </div>
    }
    else {

        if (formContext.needsCompleting) {
            display = (<div>
                <Resume setResume={setIsResumed}
                />
            </div>)
        
            if (formContext.needsCompleting && isResumed) {
                display = (<div>
                    <SellForms  resetIncomplete={formContext.resetPrefill}/>
                </div>)
            
            }
        }

    }
    return (
        display
    )
}

export default Seller;