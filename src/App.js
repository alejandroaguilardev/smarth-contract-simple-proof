import React, { Component } from "react";
import TaskContract from "./contracts/TaskContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    value :'',
    web3: null,
    accounts: null, 
    contract: null,
    name: null,
    description: null,
    idTask:0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TaskContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TaskContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
 
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      this.readTask();
    } catch (error) { 
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChangeIdTask = (e) => {
    this.setState({
      idTask: e.target.value
    })

  }

  handleChangeName = (e) => {
    this.setState({
      name: e.target.value
    })

  }

  handleChangeDescription = (e) => {
    this.setState({
      description: e.target.value
    })
  }

  createTask = async (e) => {
    e.preventDefault();
    const { accounts, contract } = this.state;

    try {
      await contract.methods.createTask(this.state.name,this.state.description).send({ from: accounts[0] });

      this.readTask();
  
    } catch (error) {
      console.log(error);
    }
   
  };


  readTask = async () =>{
    // let id = document.getElementById("idTask").value;
    const response = await this.state.contract.methods.readTask(this.state.idTask).call();
    this.setState({
        value:response[2]
    });
  }

 
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Escribir en la Blockchain</h1>
        <input type="number" name="idTask" id="idTask" value={this.state.idTask} onChange={this.handleChangeIdTask} placeholder="id"/>
        <button type="button" onClick={this.readTask} >El Valor Actual de la Blockchain</button>
        <br></br>

        El Valor Actual de la Blockchain
        <br></br>
        
        {this.state.value}
        <br></br>

        <form>
            <input name="name" value={this.state.name} placeholder="Nombre" onChange={this.handleChangeName} />
              <br />
            <input name="description" value={this.state.description}  onChange={this.handleChangeDescription} placeholder="Descripción"/>
            <br />
            <input type="submit" value="Enviar" onClick={this.createTask} />
        </form>
      </div>
    );
  }
}

export default App;
