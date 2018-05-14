import React, { Component } from 'react';
import axios from "axios";
import config from "./config.js";

const loading = <div style={{ textAlign: "center" }}>载入中，请稍等…</div>;

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

class FillInfo extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    sys.getUserInfo(['name'], (data) => {
      this.setState({ name: data.name });
    })
  }

  submit() {
    sys.getUserIdentity(userIdentity => {
      axios.post(config.backendUrl + "/exam/set-user-info", {
        ...userIdentity,
        name: this.state.name,
        student_no: this.state.student_no,
      }).then(data => {
        this.props.onSubmitted();
      });
    });
  }

  render() {
    return <div>
      <div className="info">
        欢迎参加在线测试。<br/><br/>您第一次参加在线考试，<br/>请补充姓名和学号信息。
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
      <Input icon="file" label="学号" placeholder="请输入学号"
             value={this.state.student_no}
             onChange={e => {
               this.setState({ student_no: e.target.value })
             }}
             validate={value => {
               if (!value) {
                 return "学号不能为空"
               }
             }}
      />
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" onClick={() => this.submit()}>提交</button>
        </div>
      </div>
    </div>
  }
}

class Paper extends Component {
  constructor() {
    super();
    this.state = {
      paper: null,
    };
  }

  getPaper() {
    return new Promise(resolve => sys.getUserIdentity(userIdentity => {
      axios.get(config.backendUrl + "/exam/get-paper", {
        ...userIdentity,
      }).then(data => {
        resolve(data.data);
      });
    }));
  }

  componentDidMount() {
    this.getPaper().then(paper => {
      if (paper.waiting) {
        this.setState({ paper: "waiting" });
        setTimeout(() => this.componentDidMount(), 5000);
      }
    })
  }

  submit() {
    sys.getUserIdentity(userIdentity => {
      axios.post(config.backendUrl + "/exam/set-user-info", {
        ...userIdentity,
        name: this.state.name,
        student_no: this.state.student_no,
      }).then(data => {
        this.props.onSubmitted();
      });
    });
  }

  render() {
    return <div>
      {!this.state.paper && loading}
      {this.state.paper==="waiting" && <div>
        <div className="info">
          正在等待考试开始…
        </div>
      </div>}
    </div>
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      view: "",
    };
  }


  componentDidMount() {
    sys.getUserIdentity(userIdentity => {
      axios.post(config.backendUrl + "/exam/get-user-info", userIdentity).then(data => {
        this.setState({ view: "paper" });
      }).catch(() => {
        this.setState({ view: "fill-info" });
      });
    });
  }

  render() {
    return <div>
      <div className="header">
        在线考试
      </div>

      {this.state.view === "" && loading}

      {this.state.view === "fill-info" && <FillInfo onSubmitted={() => {
        this.setState({ view: "paper" });
      }}/>}

      {this.state.view === "paper" && <Paper/>}
    </div>
  }
}

export default App;