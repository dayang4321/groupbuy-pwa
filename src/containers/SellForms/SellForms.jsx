import React, { useState, useEffect, useCallback,useContext } from "react";
import SellForm from "./SellForm/SellForm";

import { ReactComponent as PlusCircle } from "../../assets/img/svg/plus-circle.svg";
import Tick from "../../assets/img/svg/tick.svg";
import "./SellForms.css";
import { Select } from "../../components/UI/Input/Input";
import Axios, { setAuthToken } from "../../declutter-axios-base"
import { AuthContext } from "../../context/AuthContext";
import { Fade } from "react-bootstrap";

function SellForms(props) {

  const authContext = useContext(AuthContext)

  const {resetIncomplete} = props;

  const [isOpenArr, setIsOpenArr] = React.useState([true]);

  const [isSuccess, setIsSuccess] = React.useState(false);

  const [sellFormsArr, setSellFormsArr] = useState([]);

  const [isHeard, setIsHeard] = useState(!!localStorage.getItem('isDeclutterHeard'))

  const [heardLoading, setHeardLoading] = useState(false)

  // const formIndex = sellFormsArr.length;

  const addProductHandler = () => {
    resetIncomplete()
    //  setSellFormsArr([]);
    setIsSuccess(false);
    console.log(isOpenArr);

    console.log(sellFormsArr);

    if (isOpenArr.length > 4) {
      return;
    }

    //    setSellFormsArr(sellFormsArr.concat(<SellForm isOpen={isOpenArr[formIndex]} key={formIndex} />));
    const newArr = isOpenArr
      .map((bool) => {
        return false;
      })
      .concat(true);
    setIsOpenArr(newArr);
  };

  const openHandler = useCallback(
    (id) => {
      console.log(id);
      const newArr = isOpenArr.map((bool, index) => {
        if (index === id) {
          return true;
        } else return false;
      });
      setIsOpenArr([...newArr]);
    },
    [isOpenArr]
  );

  const successHandler = () => {
    setIsOpenArr([]);
    setIsSuccess(true);
  };


  const heardSubmit = (value) => {
    console.log('heard',value)
    if (!!value) {
      setHeardLoading(true)
      setTimeout(() => {
        
      setAuthToken(authContext.token)
      Axios.post('/how-you-heard-about-us', {platform: value})
      .then(
          res => {
  
          localStorage.setItem('isDeclutterHeard', true);     
          setHeardLoading(false);
          setIsHeard(true);
          }
  )
      .catch(error => {
        error.response ? alert(error.response.data.message) : alert(error.message);
        setHeardLoading(false)
      });
      }, 2000);

    }

    else return
   
  }

  useEffect(() => {
    const formArr = isOpenArr.map((bool, index) => {
      return (
        <SellForm
          isOpen={bool}
          key={index}
          id={index}
          success={successHandler}
          openHandler={openHandler}
        />
      );
    });

    setSellFormsArr(formArr);
  }, [isOpenArr, openHandler]);

  const completeMsg = (
    <div className="text-center">
      <img className="tick-svg mx-auto" src={Tick} alt="tick" />
      <h2 className="text-left">
        You would be notified once your product is verified
      </h2>
      <button
        className="another-btn w-100 text-center btn bg-transparent"
        onClick={(e) => {
          e.preventDefault();

          addProductHandler();
          console.log(sellFormsArr);
        }}
        disabled={heardLoading}
      >
        <PlusCircle className="mr-3" />
        Add another product
      </button>
      <Fade in={!isHeard}>

      <div className="mt-3 text-left">
      <Select
             options={["Friend", "Whatsapp", "Instagram", "Twitter", "Facebook", "Newsletter"]} 
             label="How did you hear about us?"
             name="platform"
          required={true}
          onChange={(e)=>heardSubmit(e.target.value)}
        />
    
      </div>
      </Fade>
    </div>
  );

  //console.log(isOpenArr, formIndex, sellFormsArr )

  return (
    <div>
      {!isSuccess && <h2 className="mb-4">Lets help you sell your product.</h2>}

      {isSuccess ? completeMsg : sellFormsArr}
    </div>
  );
}

export default SellForms;