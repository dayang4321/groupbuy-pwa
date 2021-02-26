import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import FormToolTip from "../../../components/UI/FormToolTip/FormToolTip";
import Input, {Checkbox, FileInput,Select,Textbox,} from "../../../components/UI/Input/Input";
import { Collapse } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { FormContext } from "../../../context/FormContext";
import { inputChangeHandler, currencyDisplay, todayDate } from "../../../shared/utility";

import "./SellForm.css";
import MediaPreview from "../../../components/MediaPreview/MediaPreview";
import Axios, { setAuthToken } from "../../../declutter-axios-base";
import { Button, ProgressBar } from "react-bootstrap";
import getBlobDuration from "get-blob-duration";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { darkToast } from "../../../shared/toasts";



const SellForm = (props) => {
  const { isOpen, success } = props;

  const authContext = useContext(AuthContext);

  const formContext = useContext(FormContext);

  const [formLoading, setFormLoading] = useState(false);

  // // const [hasError, setHasError] =  useState(false);



  const formPrefill = formContext.incompleteData;
  const [defected, setDefected] = React.useState(!!formPrefill.defect.files[0]);
  //console.log(formPrefill)

  const prefillVideo = useMemo(() => { return !!formPrefill.files[0] ? formPrefill.files.filter((file) => {
    return file.file_type === "video"
  }).slice(-1).map((media) => { return { file: media.path, data: media.source } }) : [] },[formPrefill.files] )
  
  const prefillImages = useMemo(()=>{ return !!formPrefill.files[0] ? formPrefill.files.filter((file) => {
    return file.file_type === "image"
  }).slice(-3).map((media) => { return { file: media.path, data: media.source } }) : [] },[formPrefill.files]  )
  
  const prefillDefectVideo = useMemo(() => {
    return !!formPrefill.defect.files[0] ? formPrefill.defect.files.filter((file) => {
      return file.file_type === "video"
    }).slice(-1).map((media) => { return { file: media.path, data: media.source } }) : []}, [formPrefill.defect.files])
  
  const prefillDefectImages = useMemo(()=>{return !!formPrefill.defect.files[0] ? formPrefill.defect.files.filter((file) => {
    return file.file_type === "image"
  }).slice(-3).map((media)=>{return{file:media.path, data:media.source}}) : []}, [formPrefill.defect.files])
  

  const sellFormObj =  useMemo(() =>{ return {
    product_name: {
      value: formPrefill.name? formPrefill.name : "",
      validation: {
        required: true,
      },
      valid:  formPrefill.name? true: false,
      touched: formPrefill.name? true: false,
    },
    description: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    reason: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    price: {
      value: "",
      validation: {
        required: true,
        isNumeric: true,
      },
      valid: false,
      touched: false,
    },
    release_date: {
      value: todayDate(),
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
    },
  
    video: {
      value: prefillVideo,
      validation: {
        requiredArr: false,
      },
      valid: !!prefillVideo[0]||true,
      touched: !!prefillVideo[0],
    },
    product_status: {
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    images: {
      value: prefillImages,
      validation: {
        requiredArr: true,
      },
      valid: !!prefillImages[0],
      touched: !!prefillImages[0],
    },
    defect_description: {
      value: "null",
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
    },
    defect_video: {
      value: prefillDefectVideo,
      validation: {
        requiredArr: false,
      },
      valid: !!prefillDefectVideo[0]||true ,
      touched: !!prefillDefectVideo[0],
    },
    defect_images: {
      value: prefillDefectImages,
      validation: {
        requiredArr: false,
      },
      valid: !!prefillDefectImages[0],
      touched: !!prefillDefectImages[0],
    },
  
    formValidity: false,
  }},[formPrefill.name, prefillDefectImages, prefillDefectVideo, prefillImages, prefillVideo]);
  //console.log(sellFormObj)

  const customerInfoFormObj = {
    customer_name: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    customer_phone: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    customer_email: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    formValidity: false,

  }

  const [sellForm, setSellForm] = useState(sellFormObj);

  const [customerInfo, setCustomerInfo] = useState(customerInfoFormObj)

  const [formTouched, setFormTouched] = useState(false);



  const [isTitleSet, setIsTitleSet] = React.useState(!!formPrefill.name);

  const [formId, setFormId] = useState(formContext.incompleteData.productId?formContext.incompleteData.productId: null)

  const [photoFiles, setPhotoFiles] = React.useState(prefillImages);

  const [photoFilesProgress, setPhotoFilesProgress] = React.useState({
    product: { progress1: prefillImages[0]? 100: 0, progress2:  prefillImages[1]? 100: 0, progress3:  prefillImages[2]? 100: 0 },
    defect: { progress1: prefillDefectImages[0]? 100: 0, progress2:prefillDefectImages[1]? 100: 0, progress3:  prefillDefectImages[2]? 100: 0 }
  });

  const [videoFile, setVideoFile] = React.useState(prefillVideo);

  const [videoFileProgress, setVideoFileProgress] = React.useState({product:prefillVideo[0]?[100]:[], defect:prefillDefectVideo[0]?[100]:[]});

  const [defectPhotoFiles, setDefectPhotoFiles] = React.useState(prefillDefectImages);

  const [defectVideoFile, setDefectVideoFile] = React.useState(prefillDefectVideo);

  const [formProgress, setFormProgress] = React.useState(0);

  const [mediaDone, setMediaDone] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);


  const defectValidateHandler = useCallback(() => {
  
    defected
      ? setSellForm((s) => {
 
          return {
            ...s,
            defect_description: {
              value: "",
              validation: {
                required: true,
              },
              valid: false,
              touched: false,
            },
            defect_video: {
              value: prefillDefectVideo,
              validation: {
                requiredArr: false,
              },
              valid: !!prefillDefectVideo[0] || true ,
              touched: !!prefillDefectVideo[0],
            },
            defect_images: {
              value: prefillDefectImages,
              validation: {
                requiredArr: false,
              },
              valid: !!prefillDefectImages[0],
              touched: !!prefillDefectImages[0],
            },
            formValidity: false
          };
        })
      : setSellForm((s) => {
         // console.log("set");
          return {
            ...s,
            defect_description: {
              value: "",
              validation: {
                required: false,
              },
              valid: true,
              touched: false,
            },
            defect_video: {
              value: [],
              validation: {
                requiredArr: false,
              },
              valid: true,
              touched: false,
            },
            defect_images: {
              value: [],
              validation: {
                requiredArr: false,
              },
              valid: true,
              touched: false,
            },
          };
        });
  }, [defected, setSellForm,prefillDefectImages,prefillDefectVideo]);

  useEffect(defectValidateHandler, [defectValidateHandler]);

  const shouldValidate = (inputName) => {
    if (!sellForm[inputName].touched) {
      return null;
    } else return sellForm[inputName].valid;
  };
  const shouldInValidate = (inputName) => {
    if (!sellForm[inputName].touched && !formTouched) {
      return null;
    } else return !sellForm[inputName].valid;
  };

  const shouldValidateCustomer = (inputName) => {
    if (!customerInfo[inputName].touched) {
      return null;
    } else return customerInfo[inputName].valid;
  };
  const shouldInValidateCustomer  = (inputName) => {
    if (!customerInfo[inputName].touched && !formTouched) {
      return null;
    } else return !customerInfo[inputName].valid;
  };


  const handleDefectMode = (bool) => {
    setDefected(bool);
  };

  const imagePreviewHandler = (e, type) => {
    if (photoFiles.length > 2 && type!=="defect") {
      darkToast("We don't need more than 3 product photos");
      return;
    }
    else if (defectPhotoFiles.length > 2 && type === "defect") {
      darkToast("We don't need more than 3 defect photos");
      return;
    }
    const fileList = e.target.files;
    var fl = fileList.length;
    // console.log(fl)
    var i = 0;
    while (i < fl) {
      // localize file var in the loop
      var file = fileList[i];
      const formData = new FormData();
      formData.append("product_id",formId)
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
          if (type === "defect") {
            setPhotoFilesProgress((s) => {
              return { ...s, defect: { ...s.defect, [`progress${defectPhotoFiles.length + 1}`]: ((ProgressEvent.loaded / ProgressEvent.total) * 100) } };
            });
          }
          else {
            setPhotoFilesProgress((s) => {
              return {
                ...s, product: {
                  ...s.product, [`progress${photoFiles.length + 1}`]: ((ProgressEvent.loaded / ProgressEvent.total) * 100)
                }
              };});
          }}
      })
        .then(res => { 
          
        })
        .catch(err => {console.log(err);})

      var reader = new FileReader();
      // eslint-disable-next-line no-loop-func
      reader.onload = function (e) {
        //console.log(file,e.target)
        type === "defect"
          ? setDefectPhotoFiles([
              ...defectPhotoFiles,
              { file: file, data: e.target.result },
            ])
          : setPhotoFiles([
              ...photoFiles,
              { file: file, data: e.target.result },
            ]);
      };
      reader.readAsDataURL(file);
      i++;
    }
  };

  const videoPreviewHandler = (e, type) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      let blobURL = URL.createObjectURL(file);
      getBlobDuration(blobURL)
        .then(function (duration) {
        //console.log(duration + " seconds");
      if (duration > 21) {
            toast.dismiss();
            return  darkToast("Video must be 20 seconds or less!");
      }
      else {
        if (type === "defect") {
          setDefectVideoFile([{ file: file, data: blobURL }])
        }
        else {
          setVideoFile([{ file: file, data: blobURL }])
        };        
      const formData = new FormData();
      formData.append("product_id",formId)
      let url;
      if (type === "defect") {
        url = "/files/product-defect/video-upload";
        formData.append("defect_file", file)
      } else {
        url = "/files/product/video-upload";
        formData.append("file", file)
      };       
      
      setAuthToken(authContext.token);      
      Axios.post(url, formData, {
        onUploadProgress: (ProgressEvent) => {
          if (type === "defect") {
            setVideoFileProgress((s) => {
              return { ...s, defect:[((ProgressEvent.loaded / ProgressEvent.total) * 100)]  };
            });
          }
          else {
            setVideoFileProgress((s) => {
              return { ...s, product:[((ProgressEvent.loaded / ProgressEvent.total) * 100)]   }; });
          }
        }
      })
        .then(res => { })
        .catch(err => { console.log(err.response);})  
      }});    
    }
    return;
  };

  const mediaRemoveHandler = (type, id) => {
    if (type === "photo") {
      const newState = photoFiles.filter((data, index) => {
        return index !== id;
      });
      setPhotoFiles([...newState]);
    }
    if (type === "video") {
      const newState = videoFile.filter((data, index) => {
        return index !== id;
      });
      setVideoFile([...newState]);
    }
  };
  const defectRemoveHandler = (type, id) => {
    if (type === "photo") {
      const newState = defectPhotoFiles.filter((data, index) => {
        return index !== id;
      });
      setDefectPhotoFiles([...newState]);
    }
    if (type === "video") {
      const newState = defectVideoFile.filter((data, index) => {
        return index !== id;
      });
      setDefectVideoFile([...newState]);
    }
  };

  //console.log(customerInfo)

  const overallProgressHandler = useCallback(() => {
    
    const photoPrg = Object.values(photoFilesProgress.product).filter((prg, i) => {
      return i <= photoFiles.length - 1
    });
    const defPhotoPrg = Object.values(photoFilesProgress.defect).filter((prg, i) => {
      return i <= defectPhotoFiles.length - 1    
    })
    const videoPrg = videoFileProgress.product;
    const defVideoPrg = videoFileProgress.defect;
    const allPrg = [...photoPrg, ...defPhotoPrg, ...videoPrg, ...defVideoPrg]    
   // console.log(allPrg)
    const allPrgAvg = allPrg.reduce((acc, currVal) => acc + currVal / allPrg.length, 0)
  //  console.log(allPrgAvg)    
    setFormProgress(s => Math.round(allPrgAvg * 0.95))    
    if (allPrg.filter(x => x !== 100).length === 0) {
     return setMediaDone(true)
    }
    else{ return setMediaDone(false)}
  }, [photoFilesProgress, videoFileProgress, photoFiles.length, defectPhotoFiles.length])
  
  useEffect(() => {
  overallProgressHandler()
},[overallProgressHandler])

  
  const completeFormHandler = useCallback(() => {    
    const formData = new FormData();      
    formData.append("product_id", formId);
    formData.append("name", sellForm.product_name.value);
    formData.append("description", sellForm.description.value);
    formData.append("selling_price", sellForm.price.value);
    formData.append("release_date", sellForm.release_date.value);
    formData.append("product_status", sellForm.product_status.value);
    formData.append("reason", sellForm.reason.value);

     defectVideoFile[0] &&
      formData.append(
        "defect[description]",
        sellForm.defect_description.value
      );
    authContext.userRole === "admin" &&  formData.append(
        "customer_name",
        customerInfo.customer_name.value
      );
      authContext.userRole === "admin" && formData.append(
        "customer_phone",
        customerInfo.customer_phone.value
    );
    authContext.userRole === "admin" && formData.append(
      "customer_email",
      customerInfo.customer_email.value
    );
    
    

      console.log('done waiting done')
      setAuthToken(authContext.token);
 
      Axios.post("/products/incomplete/complete", formData, {
        onUploadProgress: (ProgressEvent) => {
          //   this.setState({
          //     loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
          // })
          setFormProgress(f => f + (ProgressEvent.loaded / ProgressEvent.total) * 5);
          //   console.log(ProgressEvent.loaded/ProgressEvent.total*100)
        },
      })
        .then((res) => {
          setFormTouched(false);
          setFormLoading(false);
          //setSellForm(sellFormObj);
          setIsSubmitted(false)
          setMediaDone(false)
          success();
        })
        .catch((err) => {
          alert(err.message);
          setFormTouched(false);
          setFormLoading(false);
          setIsSubmitted(false);
          setMediaDone(false);
        });
   

  }, [authContext.token, authContext.userRole, customerInfo.customer_email.value, customerInfo.customer_name.value, customerInfo.customer_phone.value, defectVideoFile, formId, sellForm.defect_description.value, sellForm.description.value, sellForm.price.value, sellForm.product_name.value, sellForm.product_status.value, sellForm.reason.value, sellForm.release_date.value, success])
 
  
  
  useEffect(() => {
    if (isSubmitted && mediaDone) {
      completeFormHandler()
    } 
  }, [isSubmitted, mediaDone, completeFormHandler])
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (sellForm.formValidity === false) {
      setFormTouched(true);
    } else {
      setFormLoading(true);
      setIsSubmitted(true);
    }
  };
  
  const titleSetHandler = (e) => {
    if (isTitleSet||!e.target.value.trim()) {
      return
    }
    else {   
          if (!formContext.needsCompleting) {
            const formData = new FormData();
            formData.append("name", sellForm.product_name.value);         
            setAuthToken(authContext.token);  
            Axios.post("/products/incomplete", formData)
              .then(
                res => {
                  setFormId(res.data.data.id)
                  setIsTitleSet(true)
              }
            )
              .catch(err => {
          toast.dark(err, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
      })
          }
      
    
      //   .catch(err => {
      //     toast.dark(err, {
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: true,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //     });
      // })
    }
  }
   //console.log(formProgress)


  return (
    <div className="switch-collapse">
    
      {/* <Collapse in={!isOpen} timeout={2000}>
                <div onClick={()=>openHandler(id)} className="label-text">{title ? <span>{title}</span> : <span>&nbsp;</span>}<RightArrow className="collapse-arrow"/></div>
         </Collapse> */}

      <Collapse in={isOpen} timeout={2000}>
        <div className="form-collapse d-flex align-items-center w-100 h-100 justify-content-center">
          <form
            className="w-100"
            noValidate
            id="sellForm"
            onSubmit={handleSubmit}
          >
            <div className="tooltip-group">
              <FormToolTip textArrIndex={0} />
              <Input
                disabled={isSubmitted}
                autoFocus
                label="Name of Product"
                placeholder="eg. Ox standing fan, Living room couch."
                name="product_name"
                required={true}
                value={sellForm.product_name.value}
                onChange={(e) =>
                  inputChangeHandler(e, "product_name", sellForm, setSellForm)
                }
                isValid={shouldValidate("product_name")}
                isInvalid={shouldInValidate("product_name")}
                onBlur={(e)=>titleSetHandler(e)}
              />
            </div>
            <fieldset
              disabled={!isTitleSet || isSubmitted}
              className={`${!isTitleSet && 'form-disable'}`} >    
            <div className="d-flex justify-content-between mt-3">
              <FileInput
                onChange={(e) => {
                  videoPreviewHandler(e);
                  inputChangeHandler(e, "video", sellForm, setSellForm);
                }}
                name="video"
                errorStatus={formTouched && !sellForm.video.valid}
                label="Add product video"
                //capture="environment"
                accept="video/*"
              />

              <FileInput
                name="images"
                onChange={(e) => {
                  imagePreviewHandler(e);
                  inputChangeHandler(e, "images", sellForm, setSellForm);
                }}
                label="Add product pictures"
                errorStatus={formTouched && !sellForm.images.valid}
                //capture="environment"
                accept="image/*"
                type="photo"
              />
            </div>
            <p className="font-italic upload-info text-center">Upload at least one picture and a video of your product.</p>
            
  
              <MediaPreview
              photos={photoFiles.map((f) => f.data)}
              removeHandler={mediaRemoveHandler}
              video={videoFile.map((f) => f.data)}
              productPhotoProgress={photoFilesProgress.product}
              productVideoProgress={videoFileProgress.product}
              />
                        <div className="tooltip-group">
              <FormToolTip textArrIndex={5} />
              <Select
                  options={["Brand new", "Used", "Repair required"]} 
             label="Product Status"
             name="product_status"
             required={true}
             value={sellForm.product_status.value}
             onChange={(e) =>
               inputChangeHandler(e, "product_status", sellForm, setSellForm)
             }
             isValid={shouldValidate("product_status")}
             isInvalid={shouldInValidate("product_status")}  />
              </div>
             <div className="tooltip-group">
              <FormToolTip textArrIndex={1} />
              <Textbox
                label="Description"
                name="description"
                placeholder="Product type, Size, Colour, Usage duration, etc."
                required={true}
                value={sellForm.description.value}
                onChange={(e) =>
                  inputChangeHandler(e, "description", sellForm, setSellForm)
                }
                isValid={shouldValidate("description")}
                isInvalid={shouldInValidate("description")}
                />
                <p className="font-italic mt-n2 mb-3">
                <strong>Highlights:</strong><br/><br/>
                Colour; Size; How long your item has been used; Has your item been repaired;
                   Specifications or materials of item.<br/><br/>
                 <strong>The more descriptive an item the higher its sale potential.</strong> 
                </p>
            </div>
            <div className="tooltip-group">
              <FormToolTip textArrIndex={4} />
              <Input
                type="date"
                label="Release Date"
                placeholder=""
                name="release_date"
                required={true}
                value={sellForm.release_date.value}
                min={todayDate()}
                onChange={(e) =>{
                  console.log(e.target.value);
                  inputChangeHandler(e, "release_date", sellForm, setSellForm)}
                }
                isValid={shouldValidate("release_date")}
                isInvalid={shouldInValidate("release_date")}
                onBlur={(e)=>titleSetHandler(e)}
              />
              </div>
              <div>   
              <Textbox
                label="Reason for selling"
                name="reason"
                placeholder=""
                required={true}
                value={sellForm.reason.value}
                onChange={(e) =>
                  inputChangeHandler(e, "reason", sellForm, setSellForm)
                }
                isValid={shouldValidate("reason")}
                  isInvalid={shouldInValidate("reason")}
                  rows={2}
                />
          
      </div>
            <div className="tooltip-group">
              <FormToolTip textArrIndex={2} />
              <Input
                label="Selling Price"
                controlId="price"
                groupClass="price-group"
                required={true}
                value={sellForm.price.value}
                inputMode="numeric"
                onChange={(e) => {
                  inputChangeHandler(e, "price", sellForm, setSellForm);
                  currencyDisplay(e);
                }}
                isValid={shouldValidate("price")}
                isInvalid={shouldInValidate("price")}
              />
              </div>
              
        { authContext.userRole==="admin" &&  <>
              <div className="tooltip-group">
        
              <Input
                label="Customer Name"
                controlId="customer_name"
                groupClass=""
                required={true}
                value={customerInfo.customer_name.value}
                onChange={(e) => {
                  inputChangeHandler(e, "customer_name", customerInfo, setCustomerInfo);
                }}
                isValid={shouldValidateCustomer("customer_name")}
                isInvalid={shouldInValidateCustomer("customer_name")}
                />
                
              </div>
              
              <div className="tooltip-group">
        
        <Input
          label="Customer Phone"
          controlId="customer_phone"
          groupClass=""
                  required={true}
                  type="tel"
          value={customerInfo.customer_phone.value}
          onChange={(e) => {
            inputChangeHandler(e, "customer_phone", customerInfo, setCustomerInfo);
          }}
          isValid={shouldValidateCustomer("customer_phone")}
          isInvalid={shouldInValidateCustomer("customer_phone")}
          />
       </div>
       <div>   
        <Input
          label="Customer Email"
          controlId="customer_email"
          groupClass=""
                  required={true}
                  type="email"
          value={customerInfo.customer_email.value}
          onChange={(e) => {
            inputChangeHandler(e, "customer_email", customerInfo, setCustomerInfo);
          }}
          isValid={shouldValidateCustomer("customer_email")}
          isInvalid={shouldInValidateCustomer("customer_email")}
          />
          
      </div>
              </>}
              

            <div className="tooltip-group mt-3 mb-4">
              <FormToolTip textArrIndex={3} />
              <Checkbox
                label="This product has some defects"
                onChange={(e) => {
                  handleDefectMode(e.target.checked);
                }}
                value={defected}
                checked={defected}
                controlId="defectCheck"
              />
            </div>

            <Collapse in={defected}>
              <div className="p-0">
                
                <div className="d-flex justify-content-between">
                  <FileInput
                    label="Add defect video"
                    //capture="environment"
                    accept="video/*"
                    onChange={(e) => {
                      videoPreviewHandler(e, "defect");
                      inputChangeHandler(
                        e,
                        "defect_video",
                        sellForm,
                        setSellForm
                      );
                    }}
                    name="defect_video"
                    errorStatus={formTouched && !sellForm.defect_video.valid}
                  />

                  <FileInput
                    label="Add defect pictures"
                    //capture="environment"
                    accept="image/*"
                    type="photo"
                    onChange={(e) => {
                      imagePreviewHandler(e, "defect");
                      inputChangeHandler(
                        e,
                        "defect_images",
                        sellForm,
                        setSellForm
                      );
                    }}
                    errorStatus={formTouched && !sellForm.defect_images.valid}
                    name="defect_images"
                  />
                </div>
                
                <MediaPreview
                  photos={defectPhotoFiles.map((f) => f.data)}
                  removeHandler={defectRemoveHandler}
                  video={defectVideoFile.map((f) => f.data)}
                  productPhotoProgress={photoFilesProgress.defect}
                  productVideoProgress={videoFileProgress.defect}
                />

                <div>
                  <Textbox
                    label="Defect description"
                    required={true}
                    placeholder="Nature of defect, Cause, Defect duration, etc."
                    value={sellForm.defect_description.value}
                    onChange={(e) =>
                      inputChangeHandler(
                        e,
                        "defect_description",
                        sellForm,
                        setSellForm
                      )
                    }
                    isValid={shouldValidate("defect_description")}
                    isInvalid={shouldInValidate("defect_description")}
                  />
                </div>
              </div>
            </Collapse>
            {formTouched && sellForm.formValidity === false && (
              <p className="text-danger text-center error-text font-weight-bolder">
                Kindly review your inputs
              </p>
            )}
            <div className="form-submit">
              <Button
                className="submit-btn btn btn-dark p-3 w-100"
                disabled={formLoading}
                type="submit"
              >
                {formLoading ? "Submitting.." : "Done"}
              </Button>
              {formLoading && <ProgressBar now={formProgress} />}
            </div>
            </fieldset>   
          </form>
        </div>
      </Collapse>
    </div>
  );
};

export default SellForm;
