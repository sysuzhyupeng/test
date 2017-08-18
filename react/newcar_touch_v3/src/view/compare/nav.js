import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class compareNav extends Component {
	render() {
		let self = this;

		return (
			<ul className="clearfix">
				<li className={'vs-nav-li ' + (self.props.nav == 'spec' ? 'at' : '')}>
					<Link to="/compare/spec"  className="vs-nav-link">規格配備</Link>
				</li>
				<li className={'vs-nav-li ' + (self.props.nav == 'rating' ? 'at' : '')}>
					<Link to="/compare/rating"  className="vs-nav-link">編輯測評</Link>
				</li>
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

export default connect(mapStateToProps, mapDispatchToProps)(compareNav)