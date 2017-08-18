import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

export class BigTitle extends Component {
	render() {
		return (
			<div className="vsrt-title-big">{this.props.title}</div>
		)
	}
}

export class SmTitle extends Component {
	render() {
		return (
			<div className="vsrt-title-sm">
				<span>{this.props.title}</span>
				{ this.props.link ? <Link to={this.props.link} className="more">更多 ></Link> : null }
			</div>
		)
	}
}

export class Content extends Component {
	render() {
		var data = this.props.data || [];

		return (
			<div className="vsrt-main clearfix">
			{ data.map((d, t) => {
				return <dl key={'content' + t} className="vsrt-content">
					<dt className={d.advan == 1 ? "at" : ""}>{d.value + "分"}</dt>
					{ d.content ? <dd>{d.content}</dd> : null }
				</dl>
			}) }
			</div>
		)
	}
}