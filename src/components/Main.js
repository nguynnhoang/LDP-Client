import React, { Component } from 'react';
import {TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper} from "@mui/material"
import './style.css'
class Main extends Component {
  render() {
    return (
      <div id="content">
        
        {/* <ul>
          <li className="text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-black">ID: <span id="account">{this.props.account}</span></small>
          </li>
        </ul> */}
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.createProduct(name, price)
        }} className="form">
          <div className="form-inner">
            <h3>Add Product</h3>
            <div className="form-group mr-sm-2">
              <label>Product name:</label>
              <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              required />
            </div>
            <div className="form-group mr-sm-2">
              <label>Product price:</label>
              <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              required />
            </div>
            <button type="submit" className="btn btn-primary">Add Product</button>
          </div>
          
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    { !product.purchased
                      ? <button
                          className="buy-btn"
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.props.purchaseProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
