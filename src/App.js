
import React, { Component } from 'react';
import axios from 'axios'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) { 
    super(props);
    global.Server = 'https://lb7u7svcm5.execute-api.ap-southeast-1.amazonaws.com/dev/';

    this.state = {
      data_ingredient:[],
      data_checkbox:[]
    }

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  async componentDidMount(){
    this.getIngredients();
  }

  getIngredients(){
    var self = this;
    axios.get(global.Server+'ingredients', 
    { 
      params:{},
    }
    )
    .then(function (response) {
      
      var data = JSON.stringify(response.data).split("use-by").join("useby");
      console.log(data);
      data = JSON.parse(data);
      var data_checkbox = new Array(data.length).fill(false);
      self.setState({data_ingredient:data, data_checkbox:data_checkbox})
    })
    .catch(function (error) {
      self.setState({data_ingredient:[]})
    });
  }

  handleCheckboxChange(e){
    var current_checkbox = this.state.data_checkbox;
    if(e.target.checked){
      current_checkbox[e.target.id] = true;
      this.setState({data_checkbox:current_checkbox});
    }else{
      current_checkbox[e.target.id] = false;
      this.setState({data_checkbox:current_checkbox});
    }

    var keyword="";
    this.state.data_ingredient.map((ingredient,index) => {
      if(this.state.data_checkbox[index]){
        
        keyword = keyword.concat(ingredient.title.toString(),",");
        
      }
    })
    this.getRecipes(keyword);
  }

  getRecipes(ingredients){
    axios.get(global.Server+'recipes', 
    { 
      params:{ingredients:ingredients},
    }
    )
    .then(function (response) {
      
      console.log(response.data);
      
    })
    .catch(function (error) {
      
    });
  }


  render(){
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>

          <div className="container">
            <h1>Makan</h1>
            <form>
              <div className="form-group">
                <label>Date:</label>
                <input type="date" className="form-control" required/>
              </div>
              <label>Date:</label>
              <div className="form-check">

                {
                  this.state.data_ingredient.length > 0
                  ? 
                  this.state.data_ingredient.map((ingredient, index) => {
                    return (
                              <div key={index}>
                                {
                                  Date.parse(ingredient.useby) > new Date()
                                  ? <input className="form-check-input" type="checkbox" value={ingredient.title} id={index} onClick={this.handleCheckboxChange}/>
                                  : <input className="form-check-input" type="checkbox" value={ingredient.title} id={index} disabled/>
                                }
                                
                                <label className="form-check-label" htmlFor={ingredient.title}>
                                  {ingredient.title} <span className="badge badge-secondary">{ingredient.useby}</span>
                                </label>
                              </div>
                            )
                  })
                  : <p>a{this.state.data_ingredient}</p>
                }
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                <label className="form-check-label" htmlFor="defaultCheck1">
                  Default checkbox
                </label>
              </div>
            </form>
          </div>
      </div>
    );
  }
}

export default App;
