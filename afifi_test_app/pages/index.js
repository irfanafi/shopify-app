import React from 'react';
import store from 'store-js';
import ExportMainPage from './Sub-pages/ExportMainPage';
import ExportPage from './Sub-pages/ExportPage';
import ImportMainPage from './Sub-pages/ImportMainPage';
import ImportPage from './Sub-pages/ImportPage';
import IntroPage from './Sub-pages/IntroPage';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
  state = {
    introPageChose: false, 
    exportPageChosen: false,
    importMainPageChosen: true,
    exportMainPageChosen: false,
    importPageChosen: false
  };

  renderNewPageState = (valuesOfPage) => {
    console.log(valuesOfPage)
    this.setState({
      introPageChose: valuesOfPage[0],
      exportPageChosen: valuesOfPage[1],
      importMainPageChosen: valuesOfPage[2],
      exportMainPageChosen: valuesOfPage[3],
      importPageChosen: valuesOfPage[4]
    });
  }

  render() {
    // A constant that defines your app's empty state
    const emptyState = !store.get('ids');
    return (
        <div>
          {this.state.introPageChose ? <IntroPage onPageChange={this.renderNewPageState}/> : <></>}
          {this.state.exportPageChosen ? <ExportPage onPageChange={this.renderNewPageState}/> : <></>}
          {this.state.exportMainPageChosen ? <ExportMainPage onPageChange={this.renderNewPageState}/> : <></>}
          {this.state.importMainPageChosen ? <ImportMainPage onPageChange={this.renderNewPageState}/> : <></>}
          {this.state.importPageChosen ? <ImportPage onPageChange={this.renderNewPageState}/> : <></>}
          
        </div>
      
      
        // <ExportPage />
      )
  }
}
export default Index;
