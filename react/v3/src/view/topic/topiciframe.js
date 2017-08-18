/*
* 深度解析頁iframe
*/
import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import Like from '../artdt/like'
import { connect } from 'react-redux'
import Toast from 'antd-mobile/lib/toast'
import { tpNextStatus } from '../../action/topic'

let iframeFirst = true;
class TopicIframe extends Component {
	constructor() {
		super()
		this.scrollStatus = false;
	}
	componentDidMount() {
		var self = this,
			tp_nav_data = self.props.tp_nav_data;

		document.domain = '8891.com.tw';
		if (tp_nav_data) {
			if (iframeFirst) { //第一次進入頁面會觸發DidUpdate事件，所以不需要，防止影響後面組件的DidMount不執行
				iframeFirst = false;
			}else {
				self.changeIframeUrl();
			}
		}
	}
	changeIframeUrl() {
		var self = this,
			tp_nav_data = self.props.tp_nav_data,
			tp_nav_at = self.props.tp_nav_at,
			iframe = self.refs['tp-iframe'],
			data = [];

		data = tp_nav_data[tp_nav_at];
		
		//iframe鏈接改為替換的方式，防止頁面歷史記錄有多個該頁面
		if (_env.NODE_ENV == 'dev') { //本地環境
			iframe.contentWindow.location.replace(data.link.replace('https', 'http'));
		}else { //線上環境
			iframe.contentWindow.location.replace(data.link);
		}
		//添加ga統計
		dataLayer.push({'event': 'pageChange', 'virtualPageUrl': global.location.pathname + '?tid=' + data.id});
	}
	componentDidUpdate() {
		var self = this,
			tp_nav_data = self.props.tp_nav_data;

		document.domain = '8891.com.tw';
		if (tp_nav_data) {
			self.changeIframeUrl();
		}
	}
    iframeOnload() { //iframe加載后設置高度
    	var self = this,
			iframe = self.refs['tp-iframe'],
			nav = document.querySelector('.tp-nav'),
			navHeight = nav.offsetHeight;

		if (self.scrollStatus) { //初始進入頁面不跳到導航位置
			window.scrollTo(0, navHeight);
		}
		self.scrollStatus = true;
		// iframe.height = iframe.contentWindow.document.body.offsetHeight;
		// window.scrollTo(0, 45);
		Toast.hide();
		self.props.actions.tpNextStatus(false); //重置加載下一頁狀態
    }
	render() {
		let like = '',
			self = this,
			tp_nav_data = self.props.tp_nav_data,
			tp_nav_at = self.props.tp_nav_at;

		for(var k in tp_nav_data) {
			if(k == tp_nav_at) {
				like = tp_nav_data[k];
				like.id = like.article_id;
			}
		}

		return (
			<div>
				<section className="info-wrap" data-id={ like.id } data-type="2">	
					<iframe ref="tp-iframe" className="tp-iframe" onLoad={() => this.iframeOnload()}></iframe>
					<Like data={like} type="2" />
				</section>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		tp_nav_data: state.topic.get('tp_nav_data'),
		tp_nav_at: state.topic.get('tp_nav_at')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			tpNextStatus
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicIframe)