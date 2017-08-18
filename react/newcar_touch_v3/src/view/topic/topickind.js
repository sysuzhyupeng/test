import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Ajax from '../../utils/ajax'

class TopicKind extends Component {
	constructor() {
		super()
		this.state = {
			data: ''
		}
	}
	componentWillMount() {
		let self = this,
			params = self.props.params;

		Ajax.get(Api.base + '/topic/relevant', params).then(function(res) {
			self.setState({
				data: res.kind
			});
		});
	}
	ga(name) {
		ReactGA.ga('send', 'event', '深度解析詳情頁', '跳轉', '跳轉到'+name+'頁');
	}
	render() {
		let self = this,
			data = this.state.data;

		return <div className="tp-kind">
			<span className="tp-kind-title">相關車款</span>
			<a className="tp-kind-link" href={Api.host + '/m/kindsum/' + data.kind_id} onClick={() => self.ga('綜述')}>
				<img className="tp-kind-pic" src={data.thumb} />
				<dl className="tp-kind-dl clearfix">
					<dt>{data.full_name}</dt>
					<dd>{data.call_price}</dd>
				</dl>
				<div className="detial-btn">立即試駕</div>
			</a>
			<div className="tp-kind-item clearfix">
				<a href={Api.host + '/m/kindsum/' + data.kind_id} onClick={() => self.ga('綜述')}>綜述</a>
				<a href={Api.host + '/m/kindpic/' + data.kind_id} onClick={() => self.ga('圖片')}>圖片</a>
				<a href={Api.host + '/m/kindbalance/' + data.kind_id} onClick={() => self.ga('規格配備')}>規格配備</a>
			</div>
		</div>
	}
}

export default connect()(TopicKind)