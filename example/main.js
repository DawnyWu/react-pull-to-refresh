import React from 'react';
import ReactDOM from 'react-dom';
import ReactPullToRefresh from '../src';

class App extends React.Component {

  render() {
    return (
      <ReactPullToRefresh />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));