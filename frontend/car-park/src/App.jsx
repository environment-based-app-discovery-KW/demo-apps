import React, { Component } from 'react';
import Icon from "./assets/icon.svg";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      licensePlateNumber: "",
      userName: "",
      parkingTime: "",
      price: "",
    };
  }

  showModal() {
    if (this.state.licensePlateNumber) {
      let hours = Math.floor(Math.random() * 10);
      let minutes = Math.floor(Math.random() * 60);
      this.setState({
        showModal: true,
        parkingTime: (`${hours}小时 ${minutes}分钟`),
        price: ((hours + 1) * 8).toFixed(2),
      });
    } else {
      alert("请先输入车牌号");
    }
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  componentDidMount() {
    this.setState({ licensePlateNumber: localStorage['licensePlateNumber'] || "" });
    sys.getUserInfo(["name"], (data) => {
      this.setState({ userName: data.name });
    })
  }

  pay() {
    window.sys.requestPayment({
        amountToPay: this.state.price * 100,
        orderId: "ID_" + (+new Date()) + "_" + (Math.random() + "").substring(3),
        orderTitle: "停车费支付",
        orderDescription: "车牌号：" + this.state.licensePlateNumber + "，停车时间：" + this.state.parkingTime,
      },
      data => {
        alert("支付成功，谢谢");
        console.log(data);
        window.location.reload();
      },
      data => {
        alert("已经拒绝支付")
      })
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

      <div className={"modal " + (this.state.showModal ? "is-active" : "")}>
        <div className="modal-background"/>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">确认缴费</p>
            <button className="delete" aria-label="close" onClick={() => this.hideModal()}/>
          </header>
          <section className="modal-card-body">
            <div className="license-plate-number-wrapper">
              <div
                className="license-plate-number has-background-primary">{this.state.licensePlateNumber}</div>
            </div>

            <div>
              停车时间：<span className="has-text-primary">{this.state.parkingTime}</span>
            </div>

            <div>
              应缴费用：<span className="has-text-primary">￥{this.state.price}</span>
            </div>

          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={() => this.pay()}>立刻支付</button>
            <button className="button" onClick={() => this.hideModal()}>取消</button>
          </footer>
        </div>
      </div>

      <div className="actions">
        <div className="greetings">
          您好 {this.state.userName}，请输入车牌号以查询:
        </div>
        <input className="input" type="text"
               value={this.state.licensePlateNumber} placeholder="车牌号"
               onChange={e => {
                 localStorage['licensePlateNumber'] = e.target.value;
                 this.setState({ licensePlateNumber: e.target.value });
               }}
        />
        <div className="button-bar">
          <a className="button is-primary" onClick={() => this.showModal()}>付车费</a>
          <a className="button is-success">寻车导航</a>
        </div>
      </div>
    </div>
  }
}

export default App;