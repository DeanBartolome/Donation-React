import React, { Component } from 'react';
import './App.css';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';



/*var QRCode = require('qrcode.react');*/
var BlockIo = require('block_io');
var version = 2; // API version
var block_io = new BlockIo('ccea-6240-0ff1-077b', '03111995', version);

let data = require('./charities.json');


var selectedOption = {};
var savedAddress = '';
var savedName = '';
var btc = [];
var bitcoinPrice = 0;

  function collapse() {

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
      }
  }


class BP extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedOption: null,
      transactions: null,
      btcPrice: null
    };
    
  }
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    savedName = selectedOption.label;
    savedAddress = selectedOption.value;
    this.bit();
    this.updateAmount();
  }
  
 componentWillMount() {
    block_io.get_current_price({'price_base': 'USD'}, function (error, price) {
      if (error) return console.log("Error occured:", error.message);
      console.log(price);
      bitcoinPrice = price.data.prices[1].price;
    });

    this.setState({
      btcPrice: bitcoinPrice
    })

  }

  bit() {
    block_io.get_transactions({'type': 'received', 'addresses': savedAddress}, function (error, bitcoin) {
      if (error) return console.log("Error occured:", error.message);
      //console.log(data.data.txs.map(txs => <p>{txs.amounts_received[0]}</p>));
      
      console.log(bitcoin);
      console.log(bitcoin.data.txs);
      btc = bitcoin.data.txs;
      console.log(btc);
    })
  }

  updateAmount() {
    setTimeout(() => {
      this.setState({
        transactions: btc,
        btcPrice: bitcoinPrice
      })
    }, 1000);
  }

  ifDonationsEmpty() {
    if(savedAddress === '') {
      return (
        <div>
          <h3>Select a charity!</h3>
          <p>Please select a charity from the dropdown list above.</p>
        </div>
      );
    }
    else {
      return (
        <div>
          <div>
          <img src={this.state.selectedOption.logo} className="charityLogo" alt="charitylogo"/>
          <h3>{savedName}</h3><br/>
          <p>{this.state.selectedOption.description}</p>
          <p>Help make a difference by donating</p>
          <p>For more information, vist: {<a href={this.state.selectedOption.website}>{savedName}'s website</a>}</p>

        </div>
        </div>
      );
    }
  }

  ifReportingsEmpty() {
    if(savedAddress === '') {

    }
    else {
      if(this.state.transactions === null)
      {
        return (<div>
          <p>No records present</p>
          </div>)
            
      }
      else{
      return (
        <div>
          <br/>
          <p><b>BTC: </b>{this.state.transactions[0].amounts_received[0].amount}</p>
          <p><b>BTC to USD: </b>${this.state.transactions[0].amounts_received[0].amount * this.state.btcPrice}</p>
          <p><b>From: </b>{this.state.transactions[0].senders}</p>
          <a href={'https://www.blockchain.com/btc/tx/' + this.state.transactions[0].txid}
          target="_blank">
            View more transaction information
          </a>
          <br/>
        </div>
        
      );
    }
  }
  }

  render() {
    const { selectedOption } = this.state;

    return (
      <div>
        <div className="price">
        <p>BTC @ Coinbase: ${this.state.btcPrice}(USD)</p>
        </div>
        <div>
          <Select
            className="dropdown"
            value={selectedOption}
            onChange={this.handleChange}
            options={data.charities}
            placeholder='Select Charity'
          />
        </div>
        <div className="collapsible">
          <button className="accordion" onClick={collapse}>Donate</button>
          <div className="panel">
            {this.ifDonationsEmpty()}
          </div>

          <button className="accordion" onClick={collapse}>Reports</button>
          <div className="panel">
            {this.ifReportingsEmpty()}
          </div>
        </div>
      </div>
    );
  }
}


class App extends Component {
  render() {
    return (
        <div className="App">
          <div id="banner">
            <h1 className="BP-heading">Charity donations</h1>
            <h4>Donate to a charity your way</h4>
            <BP/>
          </div>
          <div id="container">
              
          </div>
        </div>
    );
  }
}

export default App;
