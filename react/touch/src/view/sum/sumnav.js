import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'


class sumnav extends Component {
	render() {
		var self = this,
			at = self.props.at,
			kid = self.props.kid,
			source = self.props.source,
			myid = self.props.myid,
			topic = self.props.topic;
		return (
			<div>
			{ source == 'kind'?
				<div className={"sum-nav clearfix " + (topic ? "six" : "")}>
				    <Link className={self.props.at == 'kindsum' ? 'at' : ''} to={"/kindsum/" + kid}>綜述</Link>
				    <Link className={self.props.at == 'kindpic' ? 'at' : ''} to={"/kindpic/" + kid +"/all"}>圖片</Link>
		             <a className={self.props.at == 'kindbalance' ? 'at' : ''} href={Api.host + '/m/kindbalance/' + kid}>配備</a>
				    { topic ? <Link className="width25" to={'/show/topic/' + topic}>深度解析</Link> : null }
				    <a className={self.props.at == 'kindcomment' ? 'at' : ''} href={Api.host + '/m/kindcomment/' + kid}>評價</a>
				    <Link className={self.props.at == 'kindarticle' ? 'at' : ''} to={ '/kindarticle/' + kid}>資訊</Link>
				</div>
				:
				<div className={"sum-nav clearfix " + (topic ? "six" : "")}>
		            <a className={self.props.at == 'kindsum' ? 'at' : ''} href={Api.host + '/m/auto/' + kid }>綜述</a>
				    <Link className={self.props.at == 'autopic' ? 'at' : ''} to={"/autopic/" + kid +"/"+ myid }>圖片</Link>
		            <a className={self.props.at == 'kindbalance' ? 'at' : ''} href={Api.host + '/m/autobalance/' + kid}>配備</a>
				    <a className={self.props.at == 'kindcomment' ? 'at' : ''} href={Api.host + '/m/kindcomment/' + kid}>評價</a>
				    <a className={self.props.at == 'kindarticle' ? 'at' : ''} href={Api.host + '/m/autoarticle/' + kid}>資訊</a>
				</div>
			}
			</div>
		)
	}
}

export default connect()(sumnav)