import React, { Component } from 'react';
import axios from "axios";
import config from "./config.js";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { loading: true, activeRoomIndex: 0, expanded: [] };
  }

  componentDidMount() {
    axios.get(config.backendUrl + "/schedule").then(data => {
      this.setState({ data: data.data, loading: false });
    })
  }

  getTimeDesc(i) {
    if (!i) {
      return "待定"
    }
    return Math.floor(i / 2 + 7) + ":" + (i % 2 === 0 ? "00" : "30");
  }

  render() {
    return <div>
      <div className="header">
        会议室安排 ({new Date().toLocaleDateString()})
      </div>

      {this.state.loading && <div className="wrapper">
        载入中，请稍等
      </div>}
      {!this.state.loading && <div className="wrapper">
        <div className="tabs">
          {Object.keys(this.state.data).map((key, index) => {
            return <div key={key}
                        className={"tab " + (this.state.activeRoomIndex === index ? "active" : "")}
                        onClick={() => {
                          this.setActiveRoom(index);
                        }}>
              会议室{key}
            </div>
          })}
        </div>
        <div className="schedules">
          {this.state.data[Object.keys(this.state.data)[this.state.activeRoomIndex]].map((item, index) => {
            return <div
              className={"schedule-item " + (this.state.expanded[index] ? "expanded" : "")}>
              <div className="title">{item.title}</div>
              <div>
                <i className="fas fa-user"/> {item.speaker}
              </div>
              <div>
                <i
                  className="fas fa-clock"/> {this.getTimeDesc(item.start)} 至 {this.getTimeDesc(item.end)}
              </div>
              {this.state.expanded[index] && <i className="fas expand-shrink fa-angle-up"
                                                onClick={() => this.toggleExpand(index)}/>}
              {!this.state.expanded[index] && <i className="fas expand-shrink fa-angle-down"
                                                 onClick={() => this.toggleExpand(index)}/>}
              {!!this.state.expanded[index] && <div className="description">
                {item.description}
              </div>}
            </div>
          })}
        </div>
      </div>}
    </div>
  }

  setActiveRoom(index) {
    this.setState({ activeRoomIndex: index, expanded: [] });
  }

  toggleExpand(index) {
    let expanded = [...this.state.expanded];
    expanded[index] = !expanded[index];
    this.setState({ expanded });
  }
}

export default App;