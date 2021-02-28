export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) {
        return true;
    }

    if (rules.mustCheck) {
        isValid = value && isValid;
    }

    
    if (rules.requiredArr) {
        isValid = value[0] && isValid;
    }


    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }
    if (rules.isAlphabet) {
        const pattern = /^[A-Za-z ]+$/;
        isValid = pattern.test(value) && isValid
    }
    if (rules.isAlphaNumeric) {
        const pattern = /^[A-Z0-9a-z ,'-]*$/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isPhone) {
        const pattern = /^[0]\d{10}$/;
        isValid = pattern.test(value) && isValid
    }
    return isValid;

};


export const inputChangeHandler = (event, inputIdentifier, Form, setForm, type) => {
   
    const updatedForm = { ...Form };
    const updatedFormElement = { ...Form[inputIdentifier] };

    type==="select"? updatedFormElement.value = event:
    updatedFormElement.value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    updatedFormElement.touched = true;
 
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation)
    
    updatedForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let elem in updatedForm) {
        if (updatedForm[elem].validation) { formIsValid = updatedForm[elem].valid && formIsValid }
    
        setForm({ ...updatedForm, formValidity: formIsValid });
    
    };

}

export const timeConvert = (time) => {
    
    const options1 = { weekday: 'long', year: "numeric", month: "long", day: "numeric" }
    const options2 =  {hour: "numeric", minute: "numeric"}
 
        return new Date(time).toLocaleDateString('en-US', options1) + ' at ' + new Date(time).toLocaleTimeString('en-US', options2)
}


export const currencyDisplay = (e) => {
    var currencyInput = e.target
var currency = 'NGN' // https://www.currency-iso.org/dam/downloads/lists/list_one.xml

 // format inital value
onBlur({target:currencyInput})

// bind event listeners
currencyInput.addEventListener('focus', onFocus)
currencyInput.addEventListener('blur', onBlur)


function localStringToNumber( s ){
  return Number(String(s).replace(/[^0-9.-]+/g,""))
}

function onFocus(e){
  var value = e.target.value;
  e.target.value = value ? localStringToNumber(value) : ''
}

function onBlur(e){
  var value = e.target.value

  var options = {
      maximumFractionDigits : 2,
      currency              : currency,
      style                 : "currency",
      currencyDisplay       : "symbol"
  }
  
  e.target.value = (value || value === 0) 
    ? localStringToNumber(value).toLocaleString("en-NG", options)
    : ''
}
}    

export const todayDate = () => {
    var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

    today = yyyy + '-' + mm + '-' + dd;
return today    

} 

