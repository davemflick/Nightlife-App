import React, {Component} from 'react';
import axios from 'axios';
import Establishment from './Establishment';


export default class SearchResults extends Component{
	constructor(props){
		super(props);
		this.state= {};
		
	}

	componentWillReceiveProps(nextProps){
		if(this.props !== nextProps){
			this.state = nextProps;
		}
	}

	createEstabs(){
		if(this.state.bars){
			return this.state.bars.map(est=>{
				return <Establishment key={est.id} about={est} />
			})
		} else {
			return <div>Loading</div>
		}
	}

	render(){
		return(
			<div className='searchResultsContainer'>
				{this.createEstabs()}
			</div>
		)
	}
}