import "./lib/sys";
import "./lib/bulma.min.css"
import "./style.less"

const _ = require('lodash');
const ReactDOM = require("react-dom");
const React = require("react");
import App from "./App.jsx";

window.$appName = "car-park";

window.onload = function () {
  let root = document.createElement("div");
  document.body.appendChild(root);
  ReactDOM.render(
    React.createElement(App),
    root);



  // font-awesome
  let head  = document.getElementsByTagName('head')[0];
  let link  = document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://use.fontawesome.com/releases/v5.0.13/css/all.css';
  head.appendChild(link);
};