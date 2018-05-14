import React, { Component } from 'react';
import axios from "axios";
import config from "./config.js";

class Input extends Component {
  constructor() {
    super();
    this.state = { valid: null, errorMessage: "" };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.validate(nextProps);
    }
  }

  validate(propsRef = this.props) {
    if (propsRef.validate) {
      let validationResult = propsRef.validate(propsRef.value);
      if (validationResult) {
        this.setState({ valid: false, errorMessage: validationResult });
      } else {
        this.setState({ valid: true });
      }
    } else {
      this.setState({ valid: null });
    }
  }

  render() {
    return <div className="field">
      <label className="label">{this.props.label}</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={"input " + (this.state.valid === true ? "is-success" : (this.state.valid === false ? "is-danger" : ""))}
          type="text" placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.onChange}
          onBlur={() => {
            this.validate();
          }}
        />
        <span className="icon is-small is-left">
            <i className={"fas fa-" + this.props.icon}></i>
          </span>

        {this.state.valid === true && <span className="icon is-small is-right">
            <i className="fas fa-check"></i>
          </span>}
        {this.state.valid === false && <span className="icon is-small is-right">
            <i className="fas fa-exclamation-triangle"></i>
          </span>}
      </div>
      {!this.state.valid && !!this.state.errorMessage &&
      <p className="help is-danger">{this.state.errorMessage}</p>}
    </div>
  }
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      mobile: "",
      email: "",
    };
  }


  componentDidMount() {
    sys.getUserInfo(['name', 'email', 'mobile'], data => {
      this.setState(data);
    })
  }

  render() {
    return <div>
      <div className="header">
        活动报名
      </div>
      <Input icon="user" label="姓名" placeholder="请输入姓名"
             value={this.state.name}
             onChange={e => {
               this.setState({ name: e.target.value })
             }}
             validate={value => {
               if (!value) {
                 return "姓名不能为空"
               }
             }}
      />
      <Input icon="envelope" label="邮箱" placeholder="请输入邮箱"
             value={this.state.email}
             onChange={e => {
               this.setState({ email: e.target.value })
             }}
             validate={value => {
               if (!value) {
                 return "邮箱不能为空"
               }
               if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase())) {
                 return "邮箱地址无效"
               }
             }}
      />
      <Input icon="mobile" label="手机号" placeholder="请输入手机号"
             value={this.state.mobile}
             onChange={e => {
               this.setState({ mobile: e.target.value })
             }}
             validate={value => {
               if (!value) {
                 return "手机号不能为空"
               }
               if (!/^1\d{10}$/.test(value)) {
                 return "手机号无效"
               }
             }}
      />

      <div className="field">
        <label className="label">报名附言</label>
        <div className="control">
          <textarea className="textarea" placeholder="选填项目"></textarea>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <label className="checkbox">
            <input type="checkbox"/> 我同意报名条款
          </label>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link">立刻报名</button>
        </div>
        <div className="control">
          <button className="button is-text">取消</button>
        </div>
      </div>
    </div>
  }
}

export default App;