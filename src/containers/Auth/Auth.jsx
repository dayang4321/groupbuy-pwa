import React,{useState,useContext} from 'react';
import Input, { Checkbox, Textbox } from '../../components/UI/Input/Input';

import { AuthContext } from '../../context/AuthContext'
import {inputChangeHandler} from '../../shared/utility'
// import { useHistory } from "react-router-dom";

import { Button, Col } from 'react-bootstrap';

import './Auth.css'

const authFormObj = {
    name: {
        value: '',
        validation: {
            required: true,
        },
        valid: false,
        touched: false
      },
      email: {
      value: '',
      validation: {
          required: true,
        isEmail: true,
      },
      valid: false,
      touched: false
    },
    phone: {
        value: '',
        validation: {
            required: true,
            isPhone:true,
        },
        valid: false,
        touched: false
    },
    address: {
        value: '',
        validation: {
            required: true,
        },
        valid: false,
        touched: false
    },
    // isAgreed: {
    //     value: false,
    //     validation: {
    //         mustCheck: true,
    //     },
    //     valid: false,
    //     touched: false
    //   },

     formValidity: false
}


const Auth = (props) => {

   // const history = useHistory();

   //  const [isSignedUp, setIsSignedUp] =  useState(false);

    // // const [hasError, setHasError] =  useState(false);

    const [authForm, setAuthForm] = useState(authFormObj);

    const [formTouched, setFormTouched] =  useState(false);

     const authContext = useContext(AuthContext)
  
    const shouldValidate = (inputName) => {
        if (!authForm[inputName].touched) {
            return null
        }
        else return authForm[inputName].valid

    }
    const shouldInValidate = (inputName) => {
        if (!authForm[inputName].touched && !formTouched) {
            return null
        }
        else return !authForm[inputName].valid

    }

    const handleSubmit = (event) => {     
        event.preventDefault();
        if (authForm.formValidity === false) {
                setFormTouched(true)
         }

        else {
            const postData = {
                name: authForm.name.value,
                email: authForm.email.value,
                phone: authForm.phone.value,
                pickup_address: authForm.address.value,
            };       
            authContext.signin(postData);
       if (authContext.completed){
         return setAuthForm(authFormObj) }
    }      
    }

//console.log(authForm.isAgreed)



    return (
        <div className="start-container">

            <h1 className="mb-4 text-white">
            Get buyers for bulk purchase deals.
         </h1>
            <div className="d-flex align-items-center w-100 h-100 justify-content-center">       
                <form className="w-100 row row-cols-1 row-cols-md-2" noValidate id="signinForm" onSubmit={handleSubmit}>

                    <Col>
                    <Input label="Name" type="text" value={authForm.name.value} name="name" required={true}
                        onChange={(e) => inputChangeHandler(e, "name", authForm, setAuthForm)}
                        isValid={shouldValidate("name")}
                        isInvalid={shouldInValidate("name")}                 
                    />
                    </Col>
                    <Col>
                    <Input label="Email Address" type="email" value={authForm.email.value} required={true}
                        onChange={(e) => inputChangeHandler(e, "email", authForm, setAuthForm)}
                        isValid={shouldValidate("email")}
                        isInvalid={shouldInValidate("email")} />
                    </Col>
                    <Col>                         
                    <Input label="Phone Number"  type="tel" value={authForm.phone.value} required={true}
                        onChange={(e) => inputChangeHandler(e, "phone", authForm, setAuthForm)}
                        isValid={shouldValidate("phone")}
                        isInvalid={shouldInValidate("phone")} />
                    </Col>
                    <Col>
                    <Textbox label="Pickup Address" value={authForm.address.value} required={true}
                        rows={2}
                        onChange={(e) => inputChangeHandler(e, "address", authForm, setAuthForm)}
                        isValid={shouldValidate("address")}
                        isInvalid={shouldInValidate("address")} />
                    </Col>
                
                
                  
                     {/* <Checkbox
                    label="I agree to Declutter.ng's"
                    onChange={(e) => {
                        inputChangeHandler(e, "isAgreed", authForm, setAuthForm)
                    }}
                    value={authForm.isAgreed.value}
                        link="https://declutter.ng/index.php?route=pages/terms_seller" 
                        linkText="Terms &amp; Conditions"
                        isValid={shouldValidate("isAgreed")}
                        isInvalid={shouldInValidate("isAgreed")}
                        controlId="isAgreed"
                  /> */}
                    <Col className="ml-auto">
                    <Button className="submit-btn secondary-btn mb-3 p-3 w-100"
                        disabled={authContext.authLoading} type="submit">{authContext.authLoading ? 'Starting...' : ' Start Selling'}
                    </Button>
                    </Col>
            
                   
                </form>
            </div>
            </div>
        );
      
}

export default Auth;