import React, { Component } from 'react';
import axios from "axios";
import config from "./config.js";

const loading = <div style={{ textAlign: "center", paddingTop: 60 }}>载入中，请稍等…</div>;
const loadingPaper = <div style={{ textAlign: "center", paddingTop: 60 }}>正在加载试卷…</div>;

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
    return <div className="fill-info">
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
      currentNo: 0,
      timeStarted: 0,
      remainingTime: "",
      answers: [],
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
      } else {
        this.setState({ paper: paper, timeStarted: +new Date(), answers: [] });
        if (this.remainingTimeCalcInterval) {
          clearInterval(this.remainingTimeCalcInterval);
        }
        this.remainingTimeCalcInterval = setInterval(() => {
          let elapsed = (+new Date() - this.state.timeStarted) / 1000;
          let remaining = this.state.paper.allowed_time_seconds - elapsed;
          let minutes = Math.floor(remaining / 60);
          let seconds = Math.floor(remaining % 60);
          if (remaining <= 0) {
            clearInterval(this.remainingTimeCalcInterval);
            this.remainingTimeCalcInterval = 0;
            this.doSubmit();
          }
          this.setState({ remainingTime: minutes + ":" + seconds });
        }, 1000);
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

  choose(value) {
    let answers = [...this.state.answers];
    answers[this.state.currentNo] = value;
    this.setState({ answers });
  }

  previous() {
    this.setState({ currentNo: this.state.currentNo - 1 })
  }

  doSubmit() {
    sys.getUserIdentity(userIdentity => {
      axios.post(config.backendUrl + "/exam/submit", {
        ...userIdentity,
        answers: this.state.answers,
      }).then(data => {
        this.props.onResult(data.data);
      });
    });
  }

  next() {
    if (this.state.currentNo < this.state.paper.content.length - 1) {
      this.setState({ currentNo: this.state.currentNo + 1 })
    } else {
      if (confirm("确定交卷吗?")) {
        //交卷
        this.doSubmit();
      }
    }
  }

  render() {
    return <div className="paper">
      {!this.state.paper && loadingPaper}
      {this.state.paper === "waiting" && <div>
        <div className="info">
          正在等待考试开始…
        </div>
      </div>}
      {this.state.paper && this.state.paper !== "waiting" && <div>
        <h1>
          第 {this.state.currentNo + 1}/{this.state.paper.content.length} 题
        </h1>
        <div className="text">
          {this.state.paper.content[this.state.currentNo].text}
        </div>
        <div className="options">
          {this.state.paper.content[this.state.currentNo].options.map((item, index) => (
            <div
              key={index}
              className={"option " + (this.state.answers[this.state.currentNo] === index + 1 ? "active" : "")}
              onClick={() => this.choose(index + 1)}>
              {String.fromCharCode('A'.charCodeAt(0) + index)}. {item}

              {this.state.answers[this.state.currentNo] === index + 1 &&
              <i className={"fas fa-check"}/>}
            </div>))}
        </div>
        <div className="exam-footer">
          {!!this.state.remainingTime && <div className="countdown">
            剩余时间 {this.state.remainingTime}
          </div>}
          <div className="buttons has-addons">
            {this.state.currentNo > 0 &&
            <button className="button is-link is-outlined"
                    onClick={() => this.previous()}>上一题</button>}
            <button className="button is-link" onClick={() => this.next()}>
              {this.state.currentNo < this.state.paper.content.length - 1 ? "下一题" : "交卷"}
            </button>
          </div>
        </div>
        <i className="far fa-clock"/>
      </div>}
    </div>
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      view: "",
      testResult: null,
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

      {this.state.view === "paper" && <Paper onResult={(testResult) => {
        this.setState({ view: "test-result", testResult });
      }}/>}

      {this.state.view === "test-result" && <div className="test-result">
        <b>交卷成功，您的分数为：</b>
        <div className="score">
          {this.state.testResult.score * 100 / this.state.testResult.fullScore}%
          <div
            className="small">({this.state.testResult.score}/{this.state.testResult.fullScore})</div>
        </div>
      </div>}
    </div>
  }
}

export default App;