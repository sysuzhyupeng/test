import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Brand extends Component {
	constructor() {
		super();
	}
	render() {
		let self = this,
			data = self.props.data || [];

		return (
			<ul className="brand-link">
				{
					data ? data.map((v, i) => {
					return <a href={'#letter' + v} key={'brand-link' + i}><li>{v}</li></a>
					}) : null
				}
			</ul>
		)
	}
}

function mapStateToProps(state) {
	return {
		
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Brand)