import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ReactComponent as PlusCircle } from "../../assets/img/svg/plus-circle-white.svg";
import { AuthContext } from '../../context/AuthContext';
import { FormContext } from '../../context/FormContext';
import Axios,{ setAuthToken } from '../../groupbuy-axios-base';

import './WelcomeBack.css'


const WelcomeBack = (props) => {

  const { setResume } = props;

  const [modalShow, setModalShow] = React.useState(false);
  
  const formContext = React.useContext(FormContext);

  const authContext = React.useContext(AuthContext);

  const deleteIncompleteHandler = () => {
    setAuthToken(authContext.token);
    Axios.delete('/products/incomplete')
      .then(res => {
        formContext.resetPrefill();
        formContext.setNeedsComplete(false)
      }      
    )
    .catch(err=>alert(err))
    
  }

    return (

        <div className="py-5 welcome-container">
            <h1>Welcome back,</h1>
            <p className="mt-4 font-weight-semibold">You didn’t finish creating your deal.</p>

        <Button className="another-btn continue-btn  w-100 mt-2 py-4 bg-transparent"
        onClick={()=>setResume(true)}
        > <span>{formContext.incompleteData.name}</span></Button>

            <button
        className="another-btn w-100 text-center btn secondary-btn text-white"
        onClick={() => setModalShow(true)}>
        <PlusCircle className="mr-3" stroke="#FFF"/>
        Create new deal
      </button>
      <MyVerticallyCenteredModal
        show={modalShow}
          onHide={() => setModalShow(false)}
          incompleteDelete={deleteIncompleteHandler}
      />
        </div>
        
    );
}

export default WelcomeBack;

function MyVerticallyCenteredModal(props) {
  const { incompleteDelete, ...modalProps} = props;

    return (
      <Modal
        {...modalProps}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="resume-modal"
      >
        <Modal.Body>
          <p className="text-white m-0">
            Creating a new deal would totally delete the the previously uncompleted upload.
            Are you sure you want to proceed?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn first-btn" onClick={() => {
            incompleteDelete();
          }}>Yes</button> <button className="btn second-btn" onClick={props.onHide}>No</button>
        </Modal.Footer>
      </Modal>
    );
  }
  