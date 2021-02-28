import React,{useContext, useState} from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Input, { FileInput, Textbox } from '../../components/UI/Input/Input';
import { inputChangeHandler } from '../../shared/utility';
import { darkToast } from "../../shared/toasts";
import Axios, { setAuthToken } from "../../groupbuy-axios-base";

import './ProfileForm.css'
import { AuthContext } from '../../context/AuthContext';
import MediaPreview from '../../components/MediaPreview/MediaPreview';

function ProfileForm(props) {

  const {profileComplete } = props;

  
  const profileFormObj = React.useMemo(() => {
    return {
    
    description: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    facebook: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    instagram: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    twitter: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    testimonial_images: {
      value: "",
      validation: {
        requiredArr: false,
      },
      valid: true,
      touched: false,
    },
    profile_image: {
      value: "",
      validation: {
        requiredArr: false,
      },
      valid: true,
      touched: false,
    },

  
    formValidity: false,
    }
  }, []);
  
  const prefillImages = []

  const authContext = useContext(AuthContext);


  const [formLoading, setFormLoading] = useState(false);

  const [profileForm, setProfileForm] = useState(profileFormObj);

  const [formTouched, setFormTouched] = useState(false);

  const [photoFiles, setPhotoFiles] = React.useState([]);

    const [photoFilesProgress, setPhotoFilesProgress] = React.useState({
    product: { progress1: prefillImages[0]? 100: 0, progress2:  prefillImages[1]? 100: 0, progress3:  prefillImages[2]? 100: 0 },
    // defect: { progress1: prefillDefectImages[0]? 100: 0, progress2:prefillDefectImages[1]? 100: 0, progress3:  prefillDefectImages[2]? 100: 0 }
  });


  
  const [formProgress, setFormProgress] = React.useState(0);

  const [mediaDone, setMediaDone] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);


  const imagePreviewHandler = (e, type) => {
    if (photoFiles.length > 2 && type!=="defect") {
      darkToast("We don't need more than 3 product photos");
      return;
    }
    // else if (defectPhotoFiles.length > 2 && type === "defect") {
    //   darkToast("We don't need more than 3 defect photos");
    //   return;
    // }
    const fileList = e.target.files;
    var fl = fileList.length;
    // console.log(fl)
    var i = 0;
    while (i < fl) {
      // localize file var in the loop
      var file = fileList[i];
      const formData = new FormData();
    //  formData.append("product_id",formId)
      let url;
      if (type === "defect") {
        url = "/files/product-defect/image-upload";
        formData.append("defect_file", file)
      } else {
        url = "/files/product/image-upload";
        formData.append("file", file)
      };
      setAuthToken(authContext.token);
      Axios.post(url, formData, {
        onUploadProgress: (ProgressEvent) => {
          // if (type === "defect") {
          //   setPhotoFilesProgress((s) => {
          //     return { ...s, defect: { ...s.defect, [`progress${defectPhotoFiles.length + 1}`]: ((ProgressEvent.loaded / ProgressEvent.total) * 100) } };
          //   });
          // }
     
            setPhotoFilesProgress((s) => {
              return {
                ...s, product: {
                  ...s.product, [`progress${photoFiles.length + 1}`]: ((ProgressEvent.loaded / ProgressEvent.total) * 100)
                }
              };});
     
        }
      })
        .then(res => { 
          
        })
        .catch(err => {console.log(err);})

      var reader = new FileReader();
      // eslint-disable-next-line no-loop-func
      reader.onload = function (e) {
        //console.log(file,e.target)
        // type === "defect"
        //   ? setDefectPhotoFiles([
        //       ...defectPhotoFiles,
        //       { file: file, data: e.target.result },
        //     ])
        //   :
          setPhotoFiles([
              ...photoFiles,
              { file: file, data: e.target.result },
            ]);
      };
      reader.readAsDataURL(file);
      i++;
    }
  };

  const mediaRemoveHandler = (type, id) => {
    if (type === "photo") {
      const newState = photoFiles.filter((data, index) => {
        return index !== id;
      });
      setPhotoFiles([...newState]);
    }
  };






  const shouldValidate = (inputName) => {
    if (!profileForm[inputName].touched) {
      return null;
    } else return profileForm[inputName].valid;
  };
  const shouldInValidate = (inputName) => {
    if (!profileForm[inputName].touched && !formTouched) {
      return null;
    } else return !profileForm[inputName].valid;
  };

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
        value={profileForm.description.value}
        onChange={(e) =>
          inputChangeHandler(e, "description", profileForm, setProfileForm)
        }
        isValid={shouldValidate("description")}
        isInvalid={shouldInValidate("description")}
      />
   
            <Row xs={1} md={2}>
              <Col>
              <div className="d-flex px-4 justify-content-between mt-3">
        <FileInput
              onChange={(e) => {
            imagePreviewHandler(e);
            inputChangeHandler(e, "profile_image", profileForm, setProfileForm); }}
          
          name="profile_image"
          //   errorStatus={formTouched && !sellForm.video.valid}
          label={<span className="d-block mt-n2 pr-3">Upload<br />Profile image</span>}
          //capture="environment"
          accept="image/*"
          type="profile"
        />

        <FileInput
          name="testimonial_images"
          onChange={(e) => {
            imagePreviewHandler(e);
            inputChangeHandler(e, "testimonial_images", profileForm, setProfileForm); }}
          label={<span className="d-block mt-n2 pr-3">Upload<br />Testimonials</span>}
          //  errorStatus={formTouched && !sellForm.images.valid}
          //capture="environment"
          accept="image/*"
          type="profile"
        />
                </div>
                  
        
              <MediaPreview
              photos={photoFiles.map((f) => f.data)}
              removeHandler={mediaRemoveHandler}
              //video={videoFile.map((f) => f.data)}
                  video={[]}
              productPhotoProgress={photoFilesProgress.product}
          //    productVideoProgress={videoFileProgress.product}
              />
         
              </Col>

              <Col>
              <Input
        // disabled={isSubmitted}
        label="Facebook"
        placeholder=""
        name="facebook"
                  required={false}
                  value={profileForm.description.value}
                  onChange={(e) =>
                    inputChangeHandler(e, "facebook", profileForm, setProfileForm)
                  }
                  isValid={shouldValidate("facebook")}
                  isInvalid={shouldInValidate("facebook")}
      />
            
      <Input
        // disabled={isSubmitted}
        label="Twitter"
        placeholder=""
        name="twitter"
                  required={false}
                  value={profileForm.description.value}
                  onChange={(e) =>
                    inputChangeHandler(e, "twitter", profileForm, setProfileForm)
                  }
                  isValid={shouldValidate("twitter")}
                  isInvalid={shouldInValidate("twitter")}
      />
            
      <Input
        // disabled={isSubmitted}
        label="Instagram"
        placeholder=""
        name="instagram"
                  required={false}
                  value={profileForm.description.value}
                  onChange={(e) =>
                    inputChangeHandler(e, "instagram", profileForm, setProfileForm)
                  }
                  isValid={shouldValidate("instagram")}
                  isInvalid={shouldInValidate("instagram")}
                  
      />
            
      <div className="form-submit">
        <Button
          className="submit-btn secondary-btn p-3 w-100"
          disabled={formLoading}
                    type="submit"
                    onClick={()=>profileComplete()}
        >
          {formLoading ? "Submitting.." : "Done"}
        </Button>
        {/* {formLoading && <ProgressBar now={formProgress} />} */}
      </div>
    
              </Col>
            </Row>     


  
          
        
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
