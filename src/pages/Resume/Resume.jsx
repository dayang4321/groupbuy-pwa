import React,{useContext, useState} from 'react';
import { useHistory } from 'react-router';
import Loader from '../../components/UI/Loader/Loader';
import WelcomeBack from '../../containers/WelcomeBack/WelcomeBack';

import { FormContext } from '../../context/FormContext';


function Resume() {

    const formContext = useContext(FormContext);

    const history = useHistory();

 

    let display;
    
    if (formContext.isInCompleteLoading) {
        display =  <div>
            <Loader />
        </div>
    }

    else {

        if (formContext.needsCompleting) {
            display = (<div>
                <WelcomeBack setResume={formContext.setIsResumed}
                />
            </div>)
        
            if (formContext.needsCompleting && formContext.isResumed) {
                history.push('/sell')
            }
        }

        else  history.push('/sell')

    }

    return (

        <div>
            {display}
        </div>
    )
}

export default Resume
