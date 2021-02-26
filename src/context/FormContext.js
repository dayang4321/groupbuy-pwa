import React, { useState, useCallback, useEffect, useContext } from "react";
import Axios, { setAuthToken } from "../declutter-axios-base";
import { AuthContext } from "./AuthContext";

//Initialize Form Context
export const FormContext = React.createContext({
  needsCompleting: false,
  incompleteData: {},
  resetPrefill: () => {},
  setNeedsComplete: () => {},
  isInCompleteLoading: true,
});

const FormContextProvider = (props) => {
  //Does the product need completing?
  const [needsCompleting, setNeedsCompleting] = useState(false);
  //Product data
  const [incompleteData, setIncompleteData] = useState({
    productId: "",
    name: "",
    description: "",
    price: "",
    files: [],
    defect: {
      files: [],
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  const authContext = useContext(AuthContext);

  //Check if incomplete product exists
    const getProductInit = useCallback(() => {
        if (!!authContext.token) {
            setAuthToken(authContext.token);
            Axios.get("/products/incomplete")
              .then((res) => {
                  //set user role
                const role = res.data.user_role;

                authContext.setUserRole(role)
                    //Product data is null, do nothing
                    if (res.data.data === null) {
                        setIsLoading((s) => false);
                        return;
                    }
                    //Product data exist, set the data and the needsCompleting state
                    else {
                        const formDetails = res.data.data;
                        setIncompleteData((s) => {
                            return {
                                productId: formDetails.id,
                                name: formDetails.name,
                                description: formDetails.description,
                                price: formDetails.selling_price,
                                files: [...formDetails.files],
                                defect: formDetails.defect
                                    ? {
                                        files: [...formDetails.defect.files],
                                    }
                                    : {
                                        files: [],
                                    },
                            };
                        });
                        setNeedsCompleting((s) => {
                            return true;
                        });
                        setIsLoading((s) => false);
                    }
                })
                .catch((err) => {
                    alert(err.message)
                })
        }
  }, [authContext ]);

    useEffect(() => {
   
    getProductInit()
  },[getProductInit]);

 // console.log(incompleteData);

  const resetPrefillHandler = () => {
    setIncompleteData({
        productId: "",
        name: "",
        description: "",
        price: "",
        files: [],
        defect: {
          files: [],
        },
      });
  };

  const setNeedsCompleteHandler = (bool) => {
    setNeedsCompleting(bool);
  };

  return (
    <FormContext.Provider
      value={{
        needsCompleting: needsCompleting,
        incompleteData: incompleteData,
        resetPrefill: resetPrefillHandler,
        setNeedsComplete: setNeedsCompleteHandler,
        isInCompleteLoading: isLoading,
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
};

export default FormContextProvider;
