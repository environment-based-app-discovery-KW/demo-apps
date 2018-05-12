import React, { Component } from 'react';
import Icon from "./assets/icon.svg";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div>
      <div className="banner">
        停车场缴费
      </div>
      <div className="icon-wrapper">
        <Icon className="app-icon"/>
      </div>
      <div className="plaza-name">
        商业广场 - 停车场
      </div>
      <div className="actions">
        <input className="input" type="text" placeholder="请输入车牌号以查询.."/>
        <div className="button-bar">
          <a class="button is-primary">付车费</a>
          <a class="button is-success">寻车导航</a>
        </div>
      </div>
    </div>
  }
}

export default App;