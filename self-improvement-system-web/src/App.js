import React from 'react';
import request from 'request';
import { Flex, Card, WingBlank, WhiteSpace, Slider, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'
import './App.css';

// const host = 'http://localhost:4000';
const host = 'http://39.98.59.86:31117';
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
      info: {},
    }
  }

  componentWillMount() {
    request.get(infoUrl, (err, res) => {
      console.log('=========');
      console.log(res.body);

      this.setState({info:JSON.parse(res.body)});
    });
  }

  updateInfo(info) {
    request.post(updateInfoUrl, { body: info || this.state.info, json: true}, (err, res, body) => {
      console.log(body);
      this.setState({info:body});
    });
  }

  createBookCards() {
    const { books } = this.state.info || {};
    if (!books || !books.length) {
      return;
    }
    let bookCards = [];
    books.forEach((book, index) =>{
      bookCards.push((
        <React.Fragment key={index}>
        <Card>
          <Card.Header title={`《${book.name}》`}/>
          <Card.Body>
            <Flex style={{textAlign:"center", height:30}}>
              <Flex.Item style={{fontSize:15, marginLeft:0}}>0</Flex.Item>
              <Flex.Item style={{flex:15}}>
                <Slider
                  style={{ marginRight: 8 }}
                  defaultValue={0}
                  value={book.current}
                  min={0}
                  max={book.pages}
                  onChange={(value) => {
                    const { info } = this.state;
                    const currentBook = {
                      ...info.books[index],
                      current: value
                    };
                    info.books[index] = currentBook;
                    this.setState({info : info});
                  }}
                  onAfterChange={(value) => {
                    const { info } = this.state;
                    info.books[index].current = value;
                    this.updateInfo(info);
                  }}
                />
            </Flex.Item>
            <Flex.Item style={{fontSize:15, marginLeft:0}}>{book.pages}</Flex.Item>
            </Flex>
          </Card.Body>
          <Card.Footer extra={this.state.info.books[index].current} />
        </Card>
        <WhiteSpace size="lg"/>
        </React.Fragment>
      ));
    })
    return bookCards;
  }

  render() {
    const { blogs, generalStudy, gain, commits } = this.state.info || {};
    return (
      <div className="App">
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
              let newInfo = {
                ...info,
                blogs: info.blogs + 1
              }
              this.setState({
                info: newInfo
              });
              this.updateInfo(newInfo);
            }}>{blogs || 0}</Button>

            <WhiteSpace size="lg"/>
            <div className="sub-title">commit输出</div>
            <Button className="round-button" onClick={()=>{
              let info = this.state.info;
              if (!info) {
                return;
              }
              let newInfo = {
                ...info,
                commits: info.commits + 1
              }
              this.setState({
                info: newInfo
              });
              this.updateInfo(newInfo);
            }}>{commits || 0}</Button>

            <WhiteSpace size="lg"/>
            <div className="sub-title">general study</div>
            <Button className="round-button" onClick={()=>{
              let info = this.state.info;
              if (!info) {
                return;
              }
              let newInfo = {
                ...info,
                generalStudy: info.generalStudy + 5
              }
              this.setState({
                info: newInfo
              });
              this.updateInfo(newInfo);
            }}>{generalStudy || 0}</Button>
            <WhiteSpace size="lg"/>
            <div className="sub-title">gain</div>
            <Button className="round-button" disabled style={{fontSize:20}}>￥{gain || 0}</Button>
            
          </WingBlank>
      </div>
    );
  }
}

export default App;
