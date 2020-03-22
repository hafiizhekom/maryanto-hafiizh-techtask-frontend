
import React, { Component } from 'react';
import axios from 'axios'

class App extends Component {
  constructor(props) { 
    super(props);
    global.Server = 'https://lb7u7svcm5.execute-api.ap-southeast-1.amazonaws.com/dev/';

    this.state = {
      data_ingredient:[],
      data_checkbox:[],
      data_recipes:[],
      date:""
    }

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
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
      data = JSON.parse(data);
      var data_checkbox = new Array(data.length).fill(false);
      self.setState({data_ingredient:data, data_checkbox:data_checkbox})
    })
    .catch(function (error) {
      self.setState({data_ingredient:[]})
    });
  }

  handleCheckboxChange(e){
    if(this.state.date===""){
      this.setDefaultDate();
    }

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
      return null
    })

    keyword = keyword.substr(0,keyword.length-1);

    this.getRecipes(keyword);
  }

  setDefaultDate(){
      var default_date = new Date();
      default_date = default_date.getFullYear()+'-'+("0" + (default_date.getMonth() + 1)).slice(-2)+'-'+("0" + default_date.getDate()).slice(-2);
      this.setState({date:default_date});
  }

  handleDateChange(e){
    this.setState({date:e.target.value});
  }

  getRecipes(ingredients){
    var self = this;
    axios.get(global.Server+'recipes', 
    { 
      params:{ingredients:ingredients},
    }
    )
    .then(function (response) {
      
      self.setState({data_recipes:response.data});
      
    })
    .catch(function (error) {
      self.setState({data_recipes:[]});
    });
  }


  render(){
    return (
      <div>

          <div className="container">
            <h2>Lunch Recipes Suggestion</h2>
            <form>
              <div className="form-group">
                <label>Date:</label>
                <input type="date" className="form-control" required onChange={this.handleDateChange} value={this.state.date}/>
              </div>
              <label>Ingredients:</label>
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
                  : null
                }
              </div>
            </form>
            
            
              
                  {
                    this.state.data_recipes.length>0
                    ?
                    <div className="result" style={{marginTop:20}}>
                      <h3>Recipes</h3>
                      <div className="row" >
                        {
                          this.state.data_recipes.map((recipe,index) => {
                              return (
                                <div className="col-4" key={index}>
                                  <div className="card">
                                    <div className="card-body">
                                      <h4 className="card-title">{recipe.title}</h4>
                                      <ul className="list-group">
                                        {
                                          recipe.ingredients.map((ingredient, index) =>{
                                            return (
                                              <li className="list-group-item" key={index}>{ingredient}</li>
                                            )
                                          })
                                        }
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              );
                          })
                        }
                      </div>
                    </div>
                    :
                    null
                  }
              
            
          </div>
      </div>
    );
  }
}

export default App;
