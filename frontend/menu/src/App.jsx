import React, { Component } from 'react';
import axios from "axios";
import config from "./config.js";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      order: {},
    };
  }

  componentDidMount() {
    axios.post(config.backendUrl + "/menu/get", { id: window.$launchParams.menuId || 1 }).then(data => {
      this.setState({ data: JSON.parse(data.data.content) });
    })
  }

  render() {
    return <div>
      <div className="header">
        {window.$launchParams['name'] || "餐厅点餐"}
      </div>
      <div className="wrapper">

        <div className="items">
          {this.state.data.map(item => {
            return <div className="item">
              <div className="image">
                <img src={item.image_path} alt=""/>
              </div>
              <div className="content">
                <div className="name">
                  {item.name}
                </div>
                <div className="price">
                  ￥ {item.price}
                </div>
                <div className="quantity">
                  {(this.state.order[item.item_id] > 0) &&
                  <button className="minus" onClick={() => this.adjustOrder(item.item_id, -1)}><i
                    className="fa fa-minus"/></button>}
                  <input type="text" className="quantity-input"
                         value={this.state.order[item.item_id] || "0"}/>
                  <button className="plus" onClick={() => this.adjustOrder(item.item_id, 1)}><i
                    className="fa fa-plus"/></button>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  }

  adjustOrder(item_id, number) {
    let order = { ...this.state.order };
    order[item_id] = (order[item_id] || 0) + number;
    if (order[item_id] < 0) order[item_id] = 0;
    this.setState({ order });
  }
}

export default App;