import React, { useContext, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Input, { FileInput, Textbox } from "../../components/UI/Input/Input";
import { inputChangeHandler } from "../../shared/utility";
import { darkToast } from "../../shared/toasts";
import Axios, { setAuthToken } from "../../groupbuy-axios-base";

import "./ProfileForm.css";
import { AuthContext } from "../../context/AuthContext";
import MediaPreview from "../../components/MediaPreview/MediaPreview";

function ProfileForm(props) {
  const { profileComplete } = props;

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
    };
  }, []);

  const prefillImages = [];

  const authContext = useContext(AuthContext);

  const [formLoading, setFormLoading] = useState(false);

  const [profileForm, setProfileForm] = useState(profileFormObj);

  const [formTouched, setFormTouched] = useState(false);

  const [photoFiles, setPhotoFiles] = React.useState([]);

  const [profilePhotoFile, setProfilePhotoFile] = React.useState([]);


  const imagePreviewHandler = (e, type) => {
    if (photoFiles.length > 2) {
      darkToast("We don't need more than 3 product photos");
      return;
    }
    const fileList = e.target.files;
    var fl = fileList.length;
    // console.log(fl)
    var i = 0;
    while (i < fl) {
      // localize file var in the loop
      var file = fileList[i];
      //  formData.append("product_id",formId)
      let url;
      var reader = new FileReader();
      // eslint-disable-next-line no-loop-func
      reader.onload = function (e) {
        type === "profile"
          ? setProfilePhotoFile([{ file: file, data: e.target.result }])
          : setPhotoFiles([
              ...photoFiles,
              { file: file, data: e.target.result },
            ]);
      };
      reader.readAsDataURL(file);
      i++;
    }
  };


  console.log(profileForm)

  const mediaRemoveHandler = (type, id) => {
    if (type === "photo") {
      const newState = photoFiles.filter((data, index) => {
        return index !== id;
      });
      setPhotoFiles([...newState]);
    }
    if (type === "profile") {
      const newState = photoFiles.filter((data, index) => {
        return index !== id;
      });
      setProfilePhotoFile([...newState]);
    }
  };

  const completeFormHandler = (event) => {


    event.preventDefault();


    if (profileForm.formValidity === false) {
    return  setFormTouched(true);
    }
    else {
      setFormLoading(true)
      const formData = new FormData();
    formData.append("about_business", profileForm.description.value);
    formData.append("facebook", profileForm.facebook.value);
    formData.append("twitter", profileForm.twitter.value);
    formData.append("instagram", profileForm.instagram.value);

    photoFiles[0] && photoFiles.forEach((x, i) => {
      return formData.append("testimonials[]", x.file);
    });

    profilePhotoFile[0] &&  formData.append("profile_image", profilePhotoFile[0].file);

    setAuthToken(authContext.token);
    Axios.post("/user/profile", formData)
      .then((res) => {
        darkToast("Profile details saved");
        setFormLoading(false)
        profileComplete();
      })

      .catch((err) => {
        alert(err);
        setFormLoading(false)
      });}
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
      <div className="profile-bg d-none d-lg-block"></div>
      <div className="profile-container">
        <div className="profile-inner">
          <form className="w-100" noValidate id="profileForm" onSubmit={completeFormHandler}>
            <h2 className="mb-4 primary-text">People would want to know you</h2>
            <Textbox
              label="Tell us about your business "
              name="description"
              placeholder=""
              required={true}
              value={profileForm.description.value}
              onChange={(e) =>
                inputChangeHandler(
                  e,
                  "description",
                  profileForm,
                  setProfileForm
                )
              }
              isValid={shouldValidate("description")}
              isInvalid={shouldInValidate("description")}
            />

            <Row xs={1} md={2}>
              <Col>
                <div className="d-flex px-4 justify-content-between mt-3">
                  <FileInput
                    onChange={(e) => {
                      imagePreviewHandler(e,"profile");
                      inputChangeHandler(
                        e,
                        "profile_image",
                        profileForm,
                        setProfileForm
                      );
                    }}
                    name="profile_image"
                    //   errorStatus={formTouched && !sellForm.video.valid}
                    label={
                      <span className="d-block mt-n2 pr-3">
                        Upload
                        <br />
                        Profile image
                      </span>
                    }
                    //capture="environment"
                    accept="image/*"
                    type="profile"
                  />

                  <FileInput
                    name="testimonial_images"
                    onChange={(e) => {
                      imagePreviewHandler(e);
                      inputChangeHandler(
                        e,
                        "testimonial_images",
                        profileForm,
                        setProfileForm
                      );
                    }}
                    label={
                      <span className="d-block mt-n2 pr-3">
                        Upload
                        <br />
                        Testimonials
                      </span>
                    }
                    //  errorStatus={formTouched && !sellForm.images.valid}
                    //capture="environment"
                    accept="image/*"
                    type="profile"
                  />
                </div>

                <MediaPreview
                  photos={photoFiles.map((f) => f.data)}
                  profilePhoto={profilePhotoFile.map((f) => f.data)}
                  removeHandler={mediaRemoveHandler}
                  picturesLabel="Testimonials"
                  //video={videoFile.map((f) => f.data)}
                  video={[]}
                  // productPhotoProgress={photoFilesProgress.product}
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
                  value={profileForm.facebook.value}
                  onChange={(e) =>
                    inputChangeHandler(
                      e,
                      "facebook",
                      profileForm,
                      setProfileForm
                    )
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
                  value={profileForm.twitter.value}
                  onChange={(e) =>
                    inputChangeHandler(
                      e,
                      "twitter",
                      profileForm,
                      setProfileForm
                    )
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
                  value={profileForm.instagram.value}
                  onChange={(e) =>
                    inputChangeHandler(
                      e,
                      "instagram",
                      profileForm,
                      setProfileForm
                    )
                  }
                  isValid={shouldValidate("instagram")}
                  isInvalid={shouldInValidate("instagram")}
                />

                <div className="form-submit">
                  <Button
                    className="submit-btn secondary-btn p-3 w-100"
                    disabled={formLoading}
                    type="submit"
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
  );
}

export default ProfileForm;
