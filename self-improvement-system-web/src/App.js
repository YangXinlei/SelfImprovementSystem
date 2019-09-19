import React from 'react';
import request from 'request';
import { Flex, Card, WingBlank, WhiteSpace, Slider, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'
import './App.css';

const host = 'http://localhost:4000';
const infoUrl = `${host}/info`;
const updateInfoUrl = `${host}/updateinfo`;

/*
{
  books:[
    {
      name:'xxx'
      pages:499
      current:200
      type:'tech' -> 'tech'/'novel'/'language'/'other'
    },
  ]
  blogs:3,
  commits:1,
  generalStudy:65 (min),
  gain: 45.2 (￥)
}
 */

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      info: null,
    }
  }

  componentWillMount() {
    request.get(infoUrl, (err, res) => {
      console.log('=========');
      console.log(res.body);

      this.setState({info:JSON.parse(res.body)});
    });
  }

  updateInfo() {
    request.post(updateInfoUrl, {form: this.state.info, json:true}, (err, res, body) => {
      console.log(body);
    });
  }

  createBookCards(books) {
    if (!books || !books.length) {
      return;
    }
    let bookCards = [];
    books.forEach((book, index) =>{
      bookCards.push((
        <div>
        <Card>
          <Card.Header title={`《${book.name}》`}/>
          <Card.Body>
            <div>
            <Slider
              style={{ marginLeft: 30, marginRight: 30 }}
              defaultValue={0}
              value={book.current}
              min={0}
              max={book.pages}
              onChange={(value) => {
                let info = this.state.info;
                info.books[index].current = value;
                this.setState({info : info});
              }}
              onAfterChange={(value) => {
                this.info.books[index].current = value;
                this.updateInfo();
              }}
            />
            </div>
          </Card.Body>
          <Card.Footer extra={this.state.info.books[index].current} />
        </Card>
        <WhiteSpace size="lg"/>
        </div>
      ));
    })
    return bookCards;
  }

  render() {
    return (
      <div className="App">
        <body>
          <WingBlank>
            <div className="sub-title">进行中</div>
            <WhiteSpace size="lg"/>
            {this.createBookCards()}
            <WhiteSpace size="lg"/>
            <div className="sub-title">博客阅读统计</div>
            <Button className="round-button" onClick={()=>{
              let info = this.state.info;
              if (!info) {
                return;
              }
              info.blogs += 1;
              this.setState({info:info});
            }}>{`abc${this.state.info ? this.state.info.blogs : 0}`}</Button>

            <WhiteSpace size="lg"/>
            <div className="sub-title">commit输出</div>
            <Button className="round-button" disabled>{`abc${this.state.info ? this.state.info.commits : "0"}`}</Button>

            <WhiteSpace size="lg"/>
            <div className="sub-title">general study</div>
            <Button className="round-button" onClick={()=>{
              let info = this.state.info;
              if (!info) {
                return;
              }
              info.generalStudy += 5;
              this.setState({info:info});
            }}>{`abc${this.state.info ? this.state.info.generalStudy : "0"}`}</Button>
            <WhiteSpace size="lg"/>
            <div className="sub-title">gain</div>
            <Button className="round-button" disabled>￥{`abc${this.state.info ? this.state.info.gain : "0"}`}</Button>
            
          </WingBlank>
        </body>
      </div>
    );
  }
}

export default App;