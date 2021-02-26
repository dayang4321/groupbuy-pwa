import React,{useContext} from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { ToastContainer, Slide } from "react-toastify";


import './Layout.css'
import { AuthContext } from '../../context/AuthContext';


function Layout(props) {

    const authContext = useContext(AuthContext)
    return (
        <>
            <Header />
            <ToastContainer
               className="my-toast"
        position="top-right"
        transition={Slide}
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
            <main className={authContext.isAuth? '' : 'start-bg'}>
                {props.children}
                </main>
        <Footer/>
    </>
    )
}

export default Layout;