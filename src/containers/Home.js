import React, {Component} from 'react';
import Header from './Header';
import MainBody from './MainBody';
import axios from 'axios';

export default class Home extends Component{
	constructor(props){
		super(props);
		this.state = {
			bars: []
		}

		axios.get('/results/:id').then((res)=>{console.log(res)})

	}


	render(){
		return(
		<div className='mainContainer'>
			<Header />
			<MainBody />
		</div>
		)
	}
}