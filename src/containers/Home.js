import React, {Component} from 'react';
import Header from './Header';
import MainBody from './MainBody';
import axios from 'axios';

export default class Home extends Component{
	constructor(props){
		super(props);
		this.state = {
			bars: [],
			city: ''
		}
		//axios.get('/results/Wilmington').then((res)=>{console.log(res.json)})

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