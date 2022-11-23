import React, { useState } from "react";
import ReactDOM from 'react-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import './style.css'


function Login(props) {
    const {
        state,
        LOGIN
    } = props
    console.log(state);
    const [details, setDetails] = useState({userID: "", userPass: ""});

    const login = details => {
    
        if(details.userID === "0xd7742733c8de87B55bB5388fC1015320BEaB9ce2" && details.userPass === state.userPass) {
          
          this.setState({
            ...this.state,
            userID: details.userID,
            userPass:details.userPass,
            userEth: details.userEth || 100
          })
        }
    
        else {
          console.log("Incorrect");
          //this.setState("Incorrect");
        }
    }

    const submitHandler = e => {
        e.preventDefault();
        console.log(details, 11111)
        LOGIN(details);
    }

    

    return (
        <form className="form" onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Welcome to our market</h2>
                {/* {
                    (this.state.error !== "") ? (
                        <div className="error">{this.state.error}</div>
                    ) : ""
                } */}
                <div className="form-group">
                    <label htmlFor="userID">Your ID: </label>
                    <input type="text" name="userID" id="userID" onChange={e => setDetails({...details, userID: e.target.value})} value={details.userID}/>
                </div>
                <div className="form-group">
                    <label htmlFor="userPass">Your password: </label>
                    <input type="password" name="userPass" id="userPass" onChange={e => setDetails({...details, userPass: e.target.value})} value={details.userPass}/>
                </div>
                <input type="submit" value="LOGIN" />
            </div>
        </form>
    )
}

export default Login;