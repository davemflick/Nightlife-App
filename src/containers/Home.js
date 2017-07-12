import React, {Component} from 'react';
import Header from './Header';
import MainBody from './MainBody';

export default class Home extends Component{
	render(){
		return(
		<div className='mainContainer'>
			<Header />
			<MainBody />
		</div>
		)
	}
}