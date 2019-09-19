import React from 'react';
import { Flex, Card, WingBlank, WhiteSpace, Slider, Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <body>
        <WingBlank>
          <div className="sub-title">进行中</div>
          <WhiteSpace size="lg"/>
          <Card>
            <Card.Header title="《BOOK NAME》"/>
            <Card.Body>
              <div>
              <Slider
                style={{ marginLeft: 30, marginRight: 30 }}
                defaultValue={26}
                min={0}
                max={499}
                // onChange={this.log('change')}
                // onAfterChange={this.log('afterChange')}
              />
              </div>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg"/>
          <Card>
            <Card.Body>
              <div>ADD</div>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg"/>
          <div className="sub-title">博客阅读统计</div>
          <Button className="round-button">0</Button>

          <WhiteSpace size="lg"/>
          <div className="sub-title">commit输出</div>
          <Button className="round-button" disabled>0</Button>
          
        </WingBlank>
      </body>
    </div>
  );
}

export default App;
