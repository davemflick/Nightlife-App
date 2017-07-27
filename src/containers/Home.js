import React, {Component} from 'react';
import Header from './Header';
import MainBody from './MainBody';
import axios from 'axios';

export default class Home extends Component{
	constructor(props){
		super(props);
		this.state = {
			user: ''
		}

	}

	componentDidMount(){
		axios.get('/api/user').then((res)=>{
			this.setState({user: res.data.user})
		}).catch((err)=>{
			console.log(err)
		});
	}


	render(){
		return(
		<div className='mainContainer'>
			<Header user={this.state.user} />
			<MainBody user={this.state.user} />
		</div>
		)
	}
}