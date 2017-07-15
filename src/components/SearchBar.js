import React, { Component } from 'react';


export default class SearchBar extends Component{
	constructor(props){
		super(props);
		this.state ={}
	}

	render(){
		return(
			<div className='searchFormContainer'>
				<form action='/search' method='post'>
					<div className='form-group'>
						<label>Search City</label>
    					<input  type="search" className="form-control" name='location' placeholder="City, State" />
					</div>
					<button type='submit' className='btn btn-primary'>Search</button>
				</form>
			</div>
		)
	}
}