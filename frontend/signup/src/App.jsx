import React, { Component } from 'react';
import axios from "axios";
import config from "./config.js";

class Input extends Component {
  constructor() {
    super();
    this.state = { valid: null, errorMessage: "" };
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
            if (this.props.validate) {
              let validationResult = this.props.validate(this.props.value);
              if (validationResult) {
                this.setState({ valid: false, errorMessage: validationResult });
              } else {
                this.setState({ valid: true });
              }
            }
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
    };
  }

  render() {
    return <div>
      <Input icon="user" label="姓名" placeholder="请输入姓名" value={this.state.name}
             onChange={e => {
               this.setState({ name: e.target.value })
             }} validate={value => value}/>
      <Input icon="user" label="姓名" placeholder="请输入姓名" validate={x => ""}/>
      <Input icon="user" label="姓名" placeholder="请输入姓名"/>
      <Input icon="user" label="姓名" valid={false} errorMessage={"xxx"}/>

      <div className="field">
        <label className="label">Email</label>
        <div className="control has-icons-left has-icons-right">
          <input className="input is-danger" type="email" placeholder="Email input"/>
          <span className="icon is-small is-left">
      <i className="fas fa-envelope"></i>
    </span>
          <span className="icon is-small is-right">
      <i className="fas fa-exclamation-triangle"></i>
    </span>
        </div>
        <p className="help is-danger">This email is invalid</p>
      </div>

      <div className="field">
        <label className="label">Subject</label>
        <div className="control">
          <div className="select">
            <select>
              <option>Select dropdown</option>
              <option>With options</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Message</label>
        <div className="control">
          <textarea className="textarea" placeholder="Textarea"></textarea>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <label className="checkbox">
            <input type="checkbox"/>
            I agree to the <a href="#">terms and conditions</a>
          </label>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="question"/>
            Yes.
          </label>
          <label className="radio">
            <input type="radio" name="question"/>
            No.
          </label>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link">Submit</button>
        </div>
        <div className="control">
          <button className="button is-text">Cancel</button>
        </div>
      </div>
    </div>
  }
}

export default App;