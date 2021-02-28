import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Input, { FileInput, Textbox } from '../../components/UI/Input/Input';


import './ProfileForm.css'

function ProfileForm() {


  const [formLoading, setFormLoading] = React.useState(false);

  return (

    <div className="d-flex">
        <div className="profile-bg d-none d-lg-block">

</div>
    <div className="profile-container">
          <div  className="profile-inner">
          <form
      className="w-100"
      noValidate
      id="profileForm"
    >
      <h2 className="mb-4 primary-text">People would want to know you</h2>
      <Textbox
        label="Tell us about your business "
        name="description"
        placeholder=""
        required={true}
            
      />
   
            <Row xs={1} md={2}>
              <Col>
              <div className="d-flex px-4 justify-content-between mt-3">
        <FileInput
          // onChange={(e) => {
          //   videoPreviewHandler(e);
          //   inputChangeHandler(e, "video", sellForm, setSellForm);
          // }}
          name="profile_image"
          //   errorStatus={formTouched && !sellForm.video.valid}
          label={<span className="d-block mt-n2 pr-3">Upload<br />Profile image</span>}
          //capture="environment"
          accept="image/*"
          type="profile"
        />

        <FileInput
          name="testimonial_images"
          // onChange={(e) => {
          //   imagePreviewHandler(e);
          //   inputChangeHandler(e, "images", sellForm, setSellForm);
          // }}
          label={<span className="d-block mt-n2 pr-3">Upload<br />Testimonials</span>}
          //  errorStatus={formTouched && !sellForm.images.valid}
          //capture="environment"
          accept="image/*"
          type="profile"
        />
      </div>
         
              </Col>

              <Col>
              <Input
        // disabled={isSubmitted}
        label="Facebook"
        placeholder=""
        name="facebook"
        required={true}
      />
            
      <Input
        // disabled={isSubmitted}
        label="Twitter"
        placeholder=""
        name="twitter"
        required={true}
      />
            
      <Input
        // disabled={isSubmitted}
        label="Instagram"
        placeholder=""
        name="instagram"
        required={true}
      />
            
      <div className="form-submit">
        <Button
          className="submit-btn secondary-btn p-3 w-100"
          //  disabled={formLoading}
          type="submit"
        >
          {formLoading ? "Submitting.." : "Done"}
        </Button>
        {/* {formLoading && <ProgressBar now={formProgress} />} */}
      </div>
    
              </Col>
            </Row>     


    
      {/*   
              <MediaPreview
              photos={photoFiles.map((f) => f.data)}
              removeHandler={mediaRemoveHandler}
              video={videoFile.map((f) => f.data)}
              productPhotoProgress={photoFilesProgress.product}
              productVideoProgress={videoFileProgress.product}
              /> */}
          
        
      {/* {formTouched && sellForm.formValidity === false && (
              <p className="text-danger text-center error-text font-weight-bolder">
                Kindly review your inputs
              </p>
            )} */}

    </form>
     
    </div>
 
    </div>


    </div>

  )
}

export default ProfileForm
