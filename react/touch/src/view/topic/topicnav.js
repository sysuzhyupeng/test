/*
* 深度解析頁導航
*/
import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { tpNavAt } from '../../action/topic'
import extend from 'extend'
import Toast from 'antd-mobile/lib/toast'

class TopicNav extends Component {
	componentDidMount() {
		var self = this;
		
		if (!self.props.tp_nav_at) {
			self.props.actions.tpNavAt(0);
		}
	}
	navClick(num) { //點擊導航
		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
		this.props.actions.tpNavAt(num);
	}
	render() {
		var self = this,
			data = self.props.tp_nav_data,
			tp_nav_at = self.props.tp_nav_at,
			num = tp_nav_at ? tp_nav_at : 0;

		return (
			<ul className={"tp-nav " + (self.props.tp_nav_fixed ? "fx" : "")}>
				{data ? data.map((v, i) => {
					return <li key={"nav" + i} className="tp-nav-li">
					<span onClick={() => self.navClick(i)} className={"tp-nav-link " + (i == num ? "at" : '')}>{v.name}</span>
				</li> })  : null }
			</ul>
		)
	}
}

function mapStateToProps(state) {
	return {
		tp_nav_data: state.topic.get('tp_nav_data'),
		tp_nav_fixed: state.topic.get('tp_nav_fixed'),
		tp_nav_at: state.topic.get('tp_nav_at')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			tpNavAt
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicNav)