import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'

class notFound extends Component {
	componentDidMount() {
		setTimeout(function() {
			browserHistory.push('/');
		}, 5000);
	}
	render() {
		return (
			<div className="not-wrap">
				<div className="not-inner">
					<div className="not-logo"></div>
					<div className="not-title">哎呀，頁面找不到了！</div>
					<Link to="/" className="not-link">返回首頁</Link>
				</div>
			</div>
		)
	}
}

export default notFound;