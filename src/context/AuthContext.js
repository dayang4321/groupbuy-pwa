import React,{useState,useLayoutEffect} from 'react';
import { useHistory } from "react-router-dom";
import Axios from '../declutter-axios-base'



export const AuthContext = React.createContext({
    isAuth: false,
    authLoading: false,
    token: null,
    userRole: null,
    setUserRole: () => {},
    signin: () => {},
    logout: () => { },
    completed: false
});



const AuthContextProvider = props => {

    const authToken = localStorage.getItem('declutterAuthToken');
    const expTime = localStorage.getItem('declutterAuthExpiry')
    let isAuthValid;
    //let authTimeout; 
    
    if (!!expTime){
        isAuthValid = Date.now() < expTime ? true : false;

       // console.log(isAuthValid)

        if (isAuthValid) {
          //  authTimeout = +expTime - +Date.now()  ;
        }
    }



    const history = useHistory()

    const [isAuthenticated, setIsAuthenticated] = useState(authToken && isAuthValid);

    const [token, setToken] = useState(localStorage.getItem('declutterAuthToken'));

    const [authLoading, setAuthLoading] = useState(false);

    const [authComplete, setAuthComplete] = useState(false);

    const [role, setRole] = useState(null)
 
    const logoutHandler = () => {
        //console.log('outed')
        setToken(null);
        localStorage.removeItem('declutterAuthToken');
        localStorage.removeItem('declutterAuthExpiry')
        setIsAuthenticated(false);
       // history.push('/auth')
    }

    const sessLogoutHandler = () => {
       setTimeout(logoutHandler,[2147483647])
    }

    const userRoleHandler = (role) => {
        setRole(role);
    }

    const checkAuthHandler = () => {
     
        if (!!authToken && !!isAuthValid) {
         
        return    sessLogoutHandler();
        }
        else {
       
        return  logoutHandler()
        }
    }

     useLayoutEffect(()=> {
        checkAuthHandler();
     },);
    
    
    const loginHandler = (data) => {

        setAuthLoading(true);
        setAuthComplete(false);

        Axios.post('/auth/register', data)
            .then(
                res => {
                    setAuthLoading(false)
                    setAuthComplete(true);
                   // console.log(res.data.data)
                    const token = res.data.data.access_token;
                    const role = res.data.data.user.role;

                    localStorage.setItem('declutterAuthToken', token);
                    localStorage.setItem('declutterAuthExpiry',1640098800000);
                    setToken(token);
                    userRoleHandler(role);
                    setIsAuthenticated(true);   
                    history.push('/seller')
                }
        )
            .catch(error => {
                setAuthLoading(false)
                setAuthComplete(true);
                error.response ? alert(error.response.data.message) : alert(error.message);
            });
    
      //
    }

    console.log(role)
    

    return (<AuthContext.Provider value={{
        isAuth: isAuthenticated,
        signin: loginHandler,
        logout: logoutHandler,
        userRole: role,
        setUserRole: userRoleHandler,
        authLoading: authLoading,
        token: token,
        completed: authComplete
        } }>
        {props.children}
    </AuthContext.Provider>)
}

export default AuthContextProvider


