import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import FormToolTip from "../../../components/UI/FormToolTip/FormToolTip";
import Input, {Checkbox, FileInput,ReactSelect,Textbox,} from "../../../components/UI/Input/Input";
import { Col, Collapse, Row } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { FormContext } from "../../../context/FormContext";
import { inputChangeHandler, currencyDisplay, todayDate } from "../../../shared/utility";

import "./SellForm.css";
import MediaPreview from "../../../components/MediaPreview/MediaPreview";
import Axios, { setAuthToken } from "../../../groupbuy-axios-base";
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

  const prefillVideo = useMemo(() => { return !!formPrefill.files[0] ? formPrefill.files.filter((file) => {
    return file.file_type === "video"
  }).slice(-1).map((media) => { return { file: media.path, data: media.source } }) : [] },[formPrefill.files] )
  
  const prefillImages = useMemo(()=>{ return !!formPrefill.files[0] ? formPrefill.files.filter((file) => {
    return file.file_type === "image"
  }).slice(-3).map((media) => { return { file: media.path, data: media.source } }) : [] },[formPrefill.files]  )
  
  // const prefillDefectVideo = useMemo(() => {
  //   return !!formPrefill.defect.files[0] ? formPrefill.defect.files.filter((file) => {
  //     return file.file_type === "video"
  //   }).slice(-1).map((media) => { return { file: media.path, data: media.source } }) : []}, [formPrefill.defect.files])
  
  // const prefillDefectImages = useMemo(()=>{return !!formPrefill.defect.files[0] ? formPrefill.defect.files.filter((file) => {
  //   return file.file_type === "image"
  // }).slice(-3).map((media)=>{return{file:media.path, data:media.source}}) : []}, [formPrefill.defect.files])
  

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
    category: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    total_quantity: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    minimum_quantity: {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    deal_price: {
      value: "",
      validation: {
        required: true,
        isNumeric: true,
      },
      valid: false,
      touched: false,
    },
    retail_price: {
      value: "",
      validation: {
        required: true,
        isNumeric: true,
      },
      valid: false,
      touched: false,
    },
    deal_end_date: {
      value: "",
      validation: {
        required: true,
      },
      valid: true,
      touched: false,
    },
    can_restart: {
      value: false,
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
    images: {
      value: prefillImages,
      validation: {
        requiredArr: true,
      },
      valid: !!prefillImages[0],
      touched: !!prefillImages[0],
    },

  
    formValidity: false,
  }},[formPrefill.name, prefillImages, prefillVideo]);
  //console.log(sellFormObj)

  // const customerInfoFormObj = {
  //   customer_name: {
  //     value: "",
  //     validation: {
  //       required: true,
  //     },
  //     valid: false,
  //     touched: false,
  //   },
  //   customer_phone: {
  //     value: "",
  //     validation: {
  //       required: true,
  //     },
  //     valid: false,
  //     touched: false,
  //   },
  //   customer_email: {
  //     value: "",
  //     validation: {
  //       required: true,
  //     },
  //     valid: false,
  //     touched: false,
  //   },
  //   formValidity: false,

  // }

  const [sellForm, setSellForm] = useState(sellFormObj);

  // const [customerInfo, setCustomerInfo] = useState(customerInfoFormObj)

  const [formTouched, setFormTouched] = useState(false);



  const [isTitleSet, setIsTitleSet] = React.useState(!!formPrefill.name);

  const [formId, setFormId] = useState(formContext.incompleteData.productId?formContext.incompleteData.productId: null)

  const [photoFiles, setPhotoFiles] = React.useState(prefillImages);

  const [photoFilesProgress, setPhotoFilesProgress] = React.useState({
    product: { progress1: prefillImages[0]? 100: 0, progress2:  prefillImages[1]? 100: 0, progress3:  prefillImages[2]? 100: 0 },
    // defect: { progress1: prefillDefectImages[0]? 100: 0, progress2:prefillDefectImages[1]? 100: 0, progress3:  prefillDefectImages[2]? 100: 0 }
  });

  const [videoFile, setVideoFile] = React.useState(prefillVideo);

  const [videoFileProgress, setVideoFileProgress] = React.useState({
    product: prefillVideo[0] ? [100] : [],
    //defect: prefillDefectVideo[0] ? [100] : []
  });

  // const [defectPhotoFiles, setDefectPhotoFiles] = React.useState(prefillDefectImages);

  // const [defectVideoFile, setDefectVideoFile] = React.useState(prefillDefectVideo);

  const [formProgress, setFormProgress] = React.useState(0);

  const [mediaDone, setMediaDone] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // const shouldValidateCustomer = (inputName) => {
  //   if (!customerInfo[inputName].touched) {
  //     return null;
  //   } else return customerInfo[inputName].valid;
  // };
  // const shouldInValidateCustomer  = (inputName) => {
  //   if (!customerInfo[inputName].touched && !formTouched) {
  //     return null;
  //   } else return !customerInfo[inputName].valid;
  // };

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

 console.log(sellForm)

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
        // if (type === "defect") {
        //   setDefectVideoFile([{ file: file, data: blobURL }])
        // }
        // else {
          setVideoFile([{ file: file, data: blobURL }])
        // };        
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

  //console.log(customerInfo)

  const overallProgressHandler = useCallback(() => {
    
    const photoPrg = Object.values(photoFilesProgress.product).filter((prg, i) => {
      return i <= photoFiles.length - 1
    });
    // const defPhotoPrg = Object.values(photoFilesProgress.defect).filter((prg, i) => {
    //   return i <= defectPhotoFiles.length - 1    
    // })
    const videoPrg = videoFileProgress.product;
  //  const defVideoPrg = videoFileProgress.defect;
  
    const allPrg = [...photoPrg,
    //  ...defPhotoPrg,
      ...videoPrg,
    //  ...defVideoPrg
    ]    
   // console.log(allPrg)
    const allPrgAvg = allPrg.reduce((acc, currVal) => acc + currVal / allPrg.length, 0)
  //  console.log(allPrgAvg)    
    setFormProgress(s => Math.round(allPrgAvg * 0.95))    
    if (allPrg.filter(x => x !== 100).length === 0) {
     return setMediaDone(true)
    }
    else{ return setMediaDone(false)}
  }, [photoFilesProgress, videoFileProgress, photoFiles.length])
  
  useEffect(() => {
  overallProgressHandler()
},[overallProgressHandler])

  
  const completeFormHandler = useCallback(() => {    
    const formData = new FormData();      
    formData.append("product_id", formId);
    formData.append("name", sellForm.product_name.value);
    formData.append("description", sellForm.description.value);
    formData.append("category_id", sellForm.category.value);
    formData.append("total_quantity", sellForm.total_quantity.value);
    formData.append("minimum_order_quantity", sellForm.minimum_quantity.value);
    formData.append("deal_price", sellForm.deal_price.value);
    formData.append("deal_end_date", sellForm.deal_end_date.value);
    formData.append("retail_price", sellForm.retail_price.value);
    formData.append("can_restart", !!sellForm.can_restart.value? 1 : 0);
    //  defectVideoFile[0] &&
    //   formData.append(
    //     "defect[description]",
    //     sellForm.defect_description.value
    //   );
    // authContext.userRole === "admin" &&  formData.append(
    //     "customer_name",
    //     customerInfo.customer_name.value
    //   );
    //   authContext.userRole === "admin" && formData.append(
    //     "customer_phone",
    //     customerInfo.customer_phone.value
    // );
    // authContext.userRole === "admin" && formData.append(
    //   "customer_email",
    //   customerInfo.customer_email.value
    // );
    
    

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
   

  }, [authContext.token, formId, sellForm.can_restart.value, sellForm.category.value, sellForm.deal_end_date.value, sellForm.deal_price.value, sellForm.description.value, sellForm.minimum_quantity.value, sellForm.product_name.value, sellForm.retail_price.value, sellForm.total_quantity.value, success])
 
  
  
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
    <div className="d-flex"> 
      <div className="sellform-bg d-none d-lg-block">

      </div>
<div className="sellform-container">
          <div className="sellform-inner">
      <h2 className="mb-4 primary-text px-lg-3">Lets help you create a bulk deal.</h2>
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
          <Row xs={1} md={2}>
            <Col>
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
                      <fieldset  disabled={!isTitleSet || isSubmitted}
            className={`${!isTitleSet && 'form-disable'}`}>
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
                        </fieldset>
            </Col>
                    <Col>
                    <fieldset  disabled={!isTitleSet || isSubmitted}
            className={`${!isTitleSet && 'form-disable'}`}>
            <div className="tooltip-group">
            <FormToolTip textArrIndex={1} />
            <Textbox
              label="Description"
              name="description"
              placeholder=""
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
                        </fieldset>
            </Col>
          
          </Row>
     
          {/* <fieldset
            disabled={!isTitleSet || isSubmitted}
            className={`${!isTitleSet && 'form-disable'}`} >     */}
     
          

          <fieldset  disabled={!isTitleSet || isSubmitted}
            className={`${!isTitleSet && 'form-disable'}`}>
          <Row xs={1} md={2} >
          <Col className="tooltip-group">
            <ReactSelect
                options={formContext.categoryOptions} 
           label="Category"
           name="category"
                required={true}
                prefix="sellSelect"
          // value={sellForm.category.value}
          // onInputChange={(v,a) =>{ console.log(v,a)}
          //    //inputChangeHandler(e, "category", sellForm, setSellForm)
          //                 }
                          onChange={(v, a) => {
                            console.log(v, a);
                            a.action==="select-option"? inputChangeHandler(v.value.toString(), "category", sellForm, setSellForm, 'select') :  console.log(a);
                          }
                          //inputChangeHandler(e, "category", sellForm, setSellForm)
                        }
          //  isValid={shouldValidate("category")}
          //       isInvalid={shouldInValidate("category")}
              />
            </Col>
            <Col className="tooltip-group">
            <FormToolTip textArrIndex={2} />
            <Input
              label="Total Quantity"
              controlId="total_quantity"
              groupClass="price-group"
              required={true}
              value={sellForm.total_quantity.value}
              inputMode="numeric"
              onChange={(e) => {
                inputChangeHandler(e, "total_quantity", sellForm, setSellForm);
                }}
                type="number"
              isValid={shouldValidate("total_quantity")}
              isInvalid={shouldInValidate("total_quantity")}
            />
            </Col>
            <Col className="tooltip-group">
            <FormToolTip textArrIndex={3} />
            <Input
              label="MOQ (Minimum order quantity)"
              controlId="minimum_quantity"
              groupClass="price-group"
              required={true}
              value={sellForm.minimum_quantity.value}
              inputMode="numeric"
              onChange={(e) => {
                inputChangeHandler(e, "minimum_quantity", sellForm, setSellForm);
                }}
                type="number"
              isValid={shouldValidate("minimum_quantity")}
              isInvalid={shouldInValidate("minimum_quantity")}
            />
            </Col>
            <Col className="tooltip-group">
            {/* <FormToolTip textArrIndex={2} /> */}
            <Input
              label="Deal Price"
              controlId="deal_price"
              groupClass="price-group"
              required={true}
              value={sellForm.deal_price.value}
              inputMode="numeric"
              onChange={(e) => {
                inputChangeHandler(e, "deal_price", sellForm, setSellForm);
                currencyDisplay(e);
              }}
              isValid={shouldValidate("deal_price")}
              isInvalid={shouldInValidate("deal_price")}
            />
            </Col>
            <Col className="tooltip-group">
            <FormToolTip textArrIndex={4} />
            <Input
              label="Retail Price in Market"
              controlId="retail_price"
              groupClass="price-group"
              required={true}
              value={sellForm.retail_price.value}
              inputMode="numeric"
              onChange={(e) => {
                inputChangeHandler(e, "retail_price", sellForm, setSellForm);
                currencyDisplay(e);
              }}
              isValid={shouldValidate("retail_price")}
              isInvalid={shouldInValidate("retail_price")}
            />
            </Col>
          <Col className="tooltip-group">
            <FormToolTip textArrIndex={5} />
            <Input
              type="date"
              label="Deal End date"
              placeholder=""
              name="deal_end_date"
              required={true}
              value={sellForm.deal_end_date.value}
              min={todayDate()}
              onChange={(e) =>{
                console.log(e.target.value);
                inputChangeHandler(e, "deal_end_date", sellForm, setSellForm)}
              }
              isValid={shouldValidate("deal_end_date")}
              isInvalid={shouldInValidate("deal_end_date")}
              onBlur={(e)=>titleSetHandler(e)}
            />
            </Col>
            

            <Col className="ml-auto">
            <div className="tooltip-group mt-3 mb-4 ml-auto">
            <FormToolTip textArrIndex={6} />
            <Checkbox
              label="Allow customers restart this deal"
              onChange={(e) => {
                inputChangeHandler(e, "can_restart", sellForm, setSellForm);
              }}
              value={sellForm.can_restart.value}
              checked={sellForm.can_restart.value}
              controlId="can_restart"
            />
            </div>
            
            {formTouched && sellForm.formValidity === false && (
            <p className="text-danger text-center error-text font-weight-bolder">
              Kindly review your inputs
            </p>
          )}
          <div className="form-submit">
            <Button
              className="submit-btn secondary-btn p-3 w-100"
              disabled={formLoading}
              type="submit"
            >
              {formLoading ? "Submitting.." : "Done"}
            </Button>
            {formLoading && <ProgressBar now={formProgress} />}
          </div>
            
            </Col>
    
        </Row>
   
        </fieldset>
       
          
      {/* { authContext.userRole==="admin" &&  <>
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
             */}

          {/* </fieldset>    */}
        </form>
      </div>
    </Collapse>
  </div>

    </div>
 
    </div>

</div>
    
);
};

export default SellForm;
