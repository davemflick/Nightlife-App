import React, {Component} from 'react';

export default class Header extends Component{
	constructor(props){
		super(props);
		this.state = {}
	}

	componentWillReceiveProps(nextProps){
		if(this.props !== nextProps){
			this.setState({user: nextProps.user});
		}
	}

	renderLoginOption(){
		let user = this.state.user;
		if(user && user !== 'noUser'){
			return (
				<div>
					<h5>{'Hello @' + user}</h5>
					<a href='/logout'> Log Out </a>
				</div>
			)
		} else {
			return (<a href='/twitter/login'>Login With Twitter! </a>)
		}
	}

	render(){
		return(
			<div className='headerContainer'>
				<h1 className='mainHeader'> My Nightlife </h1>
				{this.renderLoginOption()}
			</div>
		)
	}
}