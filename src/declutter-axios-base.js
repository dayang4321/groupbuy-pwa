import Axios from 'axios'

const instance = Axios.create({
    baseURL: "https://api.declutter.ng",
    headers: { 
   // 'Content-Type': 'multipart/form-data', 
     // 'X-Authorization': 'Oix1Xh0gOFreXmQlL4JPJWcDsnvo3La4LDXm9q4OCiSxV9XhYk7ziYcMIj1ctbci',
      },
});

instance.interceptors.request.use(req => {
  //   if (Axios.defaults.headers.common["Authorization"]) return req;
  //   throw ({message:"the token is not available"});
  //  },error=>{
  //   return Promise.reject(error);
  //  }
  //console.log(req)
  return req
}
);

export const setAuthToken = token => {
  if (token) {
    instance.defaults.headers['Authorization'] = 'Bearer ' + token;
  //applying token
    // console.log(instance);
    // console.log(instance.defaults);
    // console.log(instance.defaults.headers);
    // console.log(instance.defaults.headers.common);
    // console.log(instance.defaults.headers['Authorization']);
    
  } else {
  //deleting the token from header
  //delete instance.defaults.headers.common['Authorization'];
  }
 }


export default instance