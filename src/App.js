import React, { Component } from "react";
import Storage from "./Storage";
import "./App.css";

export default class App extends Component {
  state = {};
  componentDidMount = async () => {
    const token = await Storage.load("react-token");
    const tokenParsed = await Storage.load("react-token-parsed");
    const refreshToken = await Storage.load("react-refresh-token");
    this.setState({ token, tokenParsed, refreshToken });
    JSON.stringify(console.log(tokenParsed));
  };

  logout = () => {
    this.props.keycloak.logout();
  };

  render() {
    const { tokenParsed } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ margin: 10 }}>Benvenuto {tokenParsed && tokenParsed.name}</div>
          <div style={{ margin: 10 }}>La tua email è {tokenParsed && tokenParsed.email}</div>
          <div onClick={this.logout} style={{ margin: 10 }}>
            Logout
          </div>
        </header>
      </div>
    );
  }
}
