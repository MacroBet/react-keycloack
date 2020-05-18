import React from "react";
import ReactDOM from "react-dom";
import Keycloak from "keycloak-js";

import "./index.css";
import App from "./App";
import Storage from "./Storage";

import * as serviceWorker from "./serviceWorker";

//keycloak init options
let initOptions = {
  url: "http://167.71.37.86/auth",
  realm: "Temera Test",
  clientId: "my-react-app",
  onLoad: "login-required",
};

let keycloak = Keycloak(initOptions);

keycloak
  .init({ onLoad: initOptions.onLoad })
  .success((auth) => {
    if (!auth) {
      window.location.reload();
    } else {
      console.info("Authenticated");
    }

    Storage.save("react-token", keycloak.token);
    Storage.save("react-token-parsed", keycloak.tokenParsed);
    Storage.save("react-refresh-token", keycloak.refreshToken);
    ReactDOM.render(<App keycloak={keycloak} />, document.getElementById("root"));

    setTimeout(() => {
      keycloak
        .updateToken(70)
        .success((refreshed) => {
          if (refreshed) {
            console.debug("Token refreshed" + refreshed);
          } else {
            console.warn(
              "Token not refreshed, valid for " +
                Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) +
                " seconds"
            );
          }
        })
        .error(() => {
          console.error("Failed to refresh token");
        });
    }, 60000);
  })
  .error(() => {
    console.error("Authenticated Failed");
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
