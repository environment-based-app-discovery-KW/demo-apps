import React, { Component } from 'react';
import axios from "axios";
import config from "./config.js";

let Quantity = function (item) {
  return <div className="quantity">
    {(this.state.order[item.item_id] > 0) &&
    <button className="minus"
            onClick={(e) => this.setOrderNumber(e, item.item_id, (this.state.order[item.item_id] || 0) - 1)}>
      <i
        className="fa fa-minus"/></button>}
    <input type="text" className="quantity-input"
           onClick={e => e.stopPropagation()}
           value={this.state.order[item.item_id] || "0"}
           onChange={e => this.setOrderNumber(e, item.item_id, +e.target.value)}
    />
    <button className="plus"
            onClick={(e) => this.setOrderNumber(e, item.item_id, (this.state.order[item.item_id] || 0) + 1)}>
      <i
        className="fa fa-plus"/></button>
  </div>;
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      order: {},
      modalItem: null,
    };
  }

  componentDidMount() {
    axios.post(config.backendUrl + "/menu/get", { id: window.$launchParams.menuId || 1 }).then(data => {
      this.setState({ data: JSON.parse(data.data.content) });
    })
  }

  render() {
    return <div>
      {!!this.state.modalItem && <div className="modal">
        <div className="shade" onClick={() => {
          this.setState({ modalItem: null });
        }}/>
        <div className="content">
          <i className="fa fa-times close" onClick={() => {
            this.setState({ modalItem: null });
          }}/>
          <div className="img"
               style={{ backgroundImage: `url("${this.state.modalItem.image_path}")` }}/>

          <div className="inner-content">
            <div className="name">
              {this.state.modalItem.name}
            </div>
            <div className="description">
              {this.state.modalItem.description}
            </div>
            {Quantity.call(this, this.state.modalItem)}
            <div className="rating-and-month-sales">
              <span className="price">
                ￥{this.state.modalItem.price}
              </span>
              <span>
                月销{this.state.modalItem.month_sales}笔
              </span>
              <span>
                <i
                  className="far fa-star"/> {this.state.modalItem.rating}/5
              </span>
            </div>
          </div>
        </div>
      </div>}
      <div className="header">
        {window.$launchParams['name'] || "餐厅点餐"}
      </div>
      <div className="wrapper">

        <div className="items">
          {this.state.data.map(item => {
            return <div className="item" onClick={() => {
              this.setState({ modalItem: item });
            }}>
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
                {Quantity.call(this, item)}
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  }

  setOrderNumber(e, item_id, number) {
    e.stopPropagation();
    let order = { ...this.state.order };
    order[item_id] = number;
    if (order[item_id] < 0) order[item_id] = 0;
    if (!+order[item_id]) order[item_id] = 0;
    this.setState({ order });
  }
}

export default App;