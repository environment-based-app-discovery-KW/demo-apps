import "./lib/sys";
import "./lib/bulma.min.css"
import "./style.less"
const _ = require('lodash');
const ReactDOM = require("react-dom");
const React = require("react");
import App from "./App.jsx";

window.onload = function () {
  let root = document.createElement("div");
  document.body.appendChild(root);
  ReactDOM.render(
    React.createElement(App),
    root);
};