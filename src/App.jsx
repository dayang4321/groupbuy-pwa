import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router";
import { AuthContext } from "./context/AuthContext";

import Layout from "./hoc/Layout/Layout";
import Start from "./pages/Start/Start";
import Seller from "./pages/Seller/Seller";
import Logo from "./assets/img/declutter512x133.png";

import "./App.css";

function App() {
  const authContext = useContext(AuthContext);

  let routes = (
    <Switch>
      <Route path="/" exact component={Start} />
      <Route path="/start" exact component={Start} />
      <Redirect to="/" />
    </Switch>
  );

  if (authContext.isAuth) {
    routes = (
      <Switch>
        <Route path="/" exact component={Seller} />
        <Route path="/seller" exact component={Seller} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <>
      <div className="unsupported">
        <img className="w-100 img-fluid mx-auto" src={Logo} alt="Logo" />
        <p className="mt-4">
          Unfortunately Declutter.ng's web app is currently only available on
          mobile phones, please open this page on a mobile phone's browser.
        </p>
      </div>
      <div className="App">
        <Layout>{routes}</Layout>
      </div>
    </>
  );
}

export default App;
