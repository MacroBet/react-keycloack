import React, { Component } from "react";
import Storage from "./Storage";
import "./App.css";
import Keycloak from "keycloak-js";

export default class App extends Component {
  state = { authenticated: false };

  initOptions = {
    url: "http://167.71.37.86/auth",
    realm: "Temera Test",
    clientId: "my-react-app",
  };

  keycloak = Keycloak(this.initOptions);

  componentDidMount = async () => {
    this.checkauthentication();
  };

  logout = () => {
    this.keycloak.logout();
    Storage.purgeAllData();
    this.setState({ authenticated: false });
  };

  checkauthentication = (login = false) => {
    this.keycloak
      .init({ onLoad: login ? "login-required" : "check-sso" })
      .success((auth) => {
        if (!auth) {
          this.setState({ authenticated: false });
        } else {
          Storage.save("react-token", this.keycloak.token);
          Storage.save("react-token-parsed", this.keycloak.tokenParsed);
          Storage.save("react-refresh-token", this.keycloak.refreshToken);
          this.setState({
            token: this.keycloak.token,
            tokenParsed: this.keycloak.tokenParsed,
            refreshToken: this.keycloak.refreshToken,
            authenticated: true,
          });
        }

        setTimeout(() => {
          this.keycloak
            .updateToken(70)
            .success((refreshed) => {
              if (refreshed) {
                console.debug("Token refreshed" + refreshed);
              } else {
                console.warn(
                  "Token not refreshed, valid for " +
                    Math.round(this.keycloak.tokenParsed.exp + this.keycloak.timeSkew - new Date().getTime() / 1000) +
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
  };

  render() {
    const { tokenParsed, authenticated } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          {authenticated && (
            <>
              <div style={{ margin: 10 }}>Benvenuto {tokenParsed && tokenParsed.name}</div>
              <div style={{ margin: 10 }}>La tua email è {tokenParsed && tokenParsed.email}</div>
              <div onClick={this.logout} style={{ margin: 10 }}>
                Logout
              </div>
            </>
          )}
          {!authenticated && (
            <>
              <div onClick={() => this.checkauthentication(true)} style={{ margin: 10 }}>
                Login
              </div>
            </>
          )}
        </header>
      </div>
    );
  }
}
