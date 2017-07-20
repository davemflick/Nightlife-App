import React, { Component } from 'react';


export default class SearchBar extends Component{
	constructor(props){
		super(props);
		this.state ={
			location: ''
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(location){
		this.setState({location});
	}

	render(){
		return(
			<div className='searchFormContainer'>
				<form onSubmit={()=> e.preventDefault()} action={'/search/' + this.state.location} method='post'>
					<div className='form-group'>
						<label>Search City</label>
    					<input 
    						type="search" 
    						className="form-control" 
    						name='location' 
    						value={this.state.location} 
    						onChange={(e)=> this.handleChange(e.target.value)}
    						placeholder="City, State" />
					</div>
					<button type='submit' className='btn btn-primary'>Search</button>
				</form>
			</div>
		)
	}
}