import React, {Component} from 'react';

export default class Header extends Component{
	render(){
		return(
			<div className='headerContainer'>
				<h1 className='mainHeader'> My Nightlife </h1>
				<a href='/twitter/login'>Login With Twitter! </a>
			</div>
		)
	}
}