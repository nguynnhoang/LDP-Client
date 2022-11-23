import React, { Component } from 'react';

import Web3 from 'web3'
import './style.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'
import Login from './Login'
//import GeneralContext from '../context/generalProvider';
import io from "socket.io-client";

const socket = io.connect(`http://127.0.0.1:3001`);

console.log(socket)

class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const consoleweb3 = await web3.eth
    console.log(consoleweb3)
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if(networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      this.setState({ productCount })
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true,
      userID: "null",
      userPass: "buyer",
      userEth: "",
      error: "!!!",
      isLogin: false
    }
    
    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    // this.Login = this.Login.bind(this)
    // this.Logout = this.Logout.bind(this)
  }
  

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }


 



  Logout() {
    this.setState({
      userID:"",
      userPass: "",
      isLogin: false
    });
  }

  render() {
    // const isLoginfunc = data => {
    //   // this.setState({
    //   //   isLogin: true
    //   // })
    //   console.log(data);
    // }
    
    const LOGIN = async details => {
      console.log(this.state);
      
      //console.log(details)
      if(details.userID === "0xd7742733c8de87B55bB5388fC1015320BEaB9ce2" && details.userPass === this.state.userPass) {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const ethRemaining = await web3.eth.getBalance(accounts[0]);
        

        details.ethRemaining = Math.round(ethRemaining/1000000000000000000);
      
  
        socket.emit("data-register", details)
        this.setState({
          ...this.state,
          userID: details.userID,
          userPass:details.userPass,
          userEth: details.ethRemaining
        })
      }
  
      else {
        
        //this.setState("Incorrect");
      }
    }

    return (
      <div>
        <Navbar/>
        <div className="container-fluid mt-5">
          <div className="row">

            <div className="login-wrapper col-lg-5">
              {
                (this.state.userID !== "null") ? (
                  <div className='welcome'>
                    <h2>Welcome, <span>{this.state.userID}</span></h2>
                    <h4>Role: {this.state.userPass}</h4>
                    <h4>Budget: {this.state.userEth}</h4>
                    {this.state.isLogin && <button onClick={this.Logout}>Logout</button>}
                  </div>
                ): (
                  <Login state={this.state} LOGIN={LOGIN} />
                )
              }
            </div>

            <main role="main" className="col-lg-7">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  account={this.state.account}
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct} />
              }
            </main>

          </div>
        </div>
      </div>
      
    );
  }
}

export default App;
