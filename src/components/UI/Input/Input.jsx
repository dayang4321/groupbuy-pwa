import React from 'react'
import { Form } from 'react-bootstrap'
import RSelect from "react-select";

import { ReactComponent as VideoIcon } from '../../../assets/img/svg/form-video.svg'
import { ReactComponent as PhotoIcon } from '../../../assets/img/svg/form-photo.svg'
import { ReactComponent as ProfileIcon } from '../../../assets/img/svg/profile-photo.svg'
import './Input.css'




function Input(props) {

    const {controlId, label, groupClass,labelProps, ...inputProps } = props;

        return (
            <Form.Group className={`my-input ${true && groupClass}`}  controlId={controlId}>
                <Form.Label {...(labelProps && { ...labelProps })} >{label}</Form.Label>
            <Form.Control {...inputProps} />
            </Form.Group>
        )
    }

export default Input



export function Checkbox(props) {

    const {controlId, label, labelProps,link,linkText, ...inputProps } = props;
    return (
        <Form.Group className="my-input" controlId={controlId}>
        <Form.Check 
        custom
        type='checkbox'
                label={<span>{label} <a rel="noreferrer" target="_blank" href={link}>{linkText }</a></span>}
        {...inputProps}
      />
        </Form.Group>
    )
}  


export function Textbox(props) {
    const {controlId, label, labelProps,rows, ...inputProps } = props;
    return (
        <Form.Group className="my-input" controlId={controlId}>
            <Form.Label  {...(labelProps && { ...labelProps })}>{label}</Form.Label>
        <Form.Control as="textarea" rows={rows||5} {...inputProps} />
      </Form.Group>
    )
}  

export function FileInput(props) {
    const { controlId, label, labelProps, type, errorStatus, ...inputProps } = props;
    
    let svg = <VideoIcon className={`img-fluid ${errorStatus && 'invalid'}`} />;

    if (type === "photo") {
        svg = <PhotoIcon className={`img-fluid ${errorStatus && 'invalid'}`}/>
    }

    if (type === "profile") {
        svg = <ProfileIcon className={`img-fluid ${errorStatus && 'invalid'}`}/>
    }
      // will hold a reference for our real input file
  let inputFile = '';

  // function to trigger our input file click
  const uploadClick = (e) => {
    e.preventDefault();
    inputFile.click();
    return false;
  };

    return (
        <Form.Group  className="my-input file-input" controlId={controlId}>
            <Form.File className="file" {...inputProps} label={label}
                ref={input => {inputFile = input}} />
            <div onClick={uploadClick} className="text-center">{svg}</div>
            <p className="text-center primary-text mt-2 mb-0">{label}</p>
        </Form.Group>
    )
} 


export function Select(props) {

    const {controlId, label, groupClass,labelProps,options, ...inputProps } = props;

    return (
        <Form.Group className={`my-input ${true && groupClass}`}   controlId={controlId}>
        <Form.Label  {...(labelProps && { ...labelProps })}>{label}</Form.Label>
            <Form.Control  {...inputProps} as="select" custom>
                <option value="" disabled>&nbsp;</option>
                {options &&
                    options.map((option, index) => {
                     return  <option value={option} key={index}>{option}</option>
                    })
            }
        </Form.Control>
      </Form.Group>
        )
}
    
export function ReactSelect(props) {

    const {controlId,label,placeholder, prefix,labelProps,options,isSearchable, ...selectProps } = props;
    return (
            
        <Form.Group>
            <Form.Label  {...(labelProps && { ...labelProps })}>
               {label}
            </Form.Label>
            <RSelect
                isSearchable={isSearchable||false}
                name={controlId}
                options={options}
                className="react-select"
                classNamePrefix={prefix}
                placeholder={placeholder || ""}
    
                {...selectProps}
            />
              
        </Form.Group>
 

    )
}


 


 
