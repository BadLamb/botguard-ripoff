import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Kernel } from './jsos/kernel.js'

class BoxThingie extends React.Component{
	constructor(props) {
		super(props);
		this.state = {content :'Are you a cat?'};
		this.ayyLmao = this.ayyLmao.bind(this);
	}

	ayyLmao(){
		// TODO Check VM
		var token = 0;
		this.setState({content: 'Analyzing...'})
		new Kernel().newTask('http://localhost:3000/task.js')
		setTimeout(() => {this.setState({
			content: true ? '✅ Your token is: 0':'❌ You aren\'t a cat.' 
		})}, 2000);
	}

	render() {
		return (
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<a href='#' onClick={this.ayyLmao}><h1>{this.state.content}</h1></a>
			</div>
			)
	}
}

const element = <BoxThingie />;
ReactDOM.render(
	element, 
	document.getElementById('root')
);