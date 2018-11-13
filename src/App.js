import React, { Component } from 'react';

import Layout from './components/Layout/Layout.module';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder.module';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <BurgerBuilder />
        </Layout>
      </div>
    );
  }
}

export default App;
