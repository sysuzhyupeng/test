import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import Ajax from '../../utils/ajax'
import TopicIframe from './topiciframe'
import TopicNav from './topicnav'
import TopicKind from './topickind'
import Header from '../component/header'
import Share from '../component/share'
import Photo from './photo'
import { tpNavAt, tpNextStatus, tpNavFixed, tpNavData } from '../../action/topic'
import { cpShareStatus } from '../../action/component'
import DowloadFoot from '../component/dowloadFoot'
import BackTop from '../component/backtop'
import seo from '../../utils/seoConfig'
import "../../resource/css/topic.less"


class topic extends Component {
	constructor() {
		super()
		this.state = {
			data: ''
		};
		this.handleScroll = this.handleScroll.bind(this);
	}
	getInfo(params) { //請求數據
		let self = this;

		Ajax.get(Api.base + '/topic/article', params).then(function(res) {
			self.props.actions.tpNavData(res.nav);
			self.setState({
				data: res
			});
		}).catch(function(rej) {
		});
	}
	componentWillMount() {
		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
	}
    componentDidMount() {
    	let self = this;

		document.domain = '8891.com.tw';
		self.getInfo(self.props.params);
		window.addEventListener('scroll', self.handleScroll);
    }
    componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		Toast.hide();
    }
	handleScroll() { //滾動事件
		let self = this,
			afterScrollTop = document.body.scrollTop,
			scrollHeight = document.body.offsetHeight - window.screen.height,
			nav = document.querySelector('.tp-nav');

		if (nav) {
			var navHeight = nav.offsetHeight,
				navTop = nav.offsetTop;
			//滾動定位導航
			if (afterScrollTop > navHeight + navTop) {
				self.props.actions.tpNavFixed(true);
			}else {
				self.props.actions.tpNavFixed(false);
			}
		}
	}
	loadNext() { //點擊加載下一篇
		var self = this,
			tp_nav_data = self.props.tp_nav_data,
			nextAt = self.props.tp_nav_at + 1;

		ReactGA.ga('send', 'event', '深度解析詳情頁', '加載更多', '點擊查看'+tp_nav_data[nextAt].name+'測評');
		self.props.actions.tpNextStatus(true);
		self.props.actions.tpNavAt(nextAt);
	}
	shareOpen() { //分享
		this.props.actions.cpShareStatus(true);
	}
	render() {
		let self = this,
			data = self.state.data,
			tp_nav_data = self.props.tp_nav_data,
			tp_nav_at = self.props.tp_nav_at,
			commentParams = {
				topicid: self.props.params.topicid,
				limit: 6
			};

		if (data != '') { //設置SEO
			seo('topic', data.info.brandName, data.info.kindName);
		}

		return (
			<div>
				<section className="tp-wrap viewTopicIndex">
					<DowloadFoot />
					<Header module="深度解析" hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" rightContent={<i onClick={() => self.shareOpen()} className="hd-icon-share"></i>} />

					{ data != '' && tp_nav_data ?
						<div className="tp-inner">
							<TopicNav />
							<TopicIframe />
						</div>
					: null }

					{ data != '' ?
					(
						tp_nav_data.length == tp_nav_at + 1 ?
						null : (
							self.props.tp_next_status ? <div className="tp-next"><Button className="btn" loading>加載中...</Button></div> : <div className="tp-next"><Button onClick={() => self.loadNext()} className="btn">{"點擊查看" + tp_nav_data[tp_nav_at+1].name + "測評"}<i className="arrow"></i></Button></div>
						)
					)
					: null }

					<TopicKind params={self.props.params} />

					{ data != '' ? <Share shareUrl={data.info.pc_link} /> : null }

					{ data != '' && data.images ?
						<Photo images={data.images} />
					: null }

					<BackTop />

				</section>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		tp_nav_data: state.topic.get('tp_nav_data'),
		tp_nav_at: state.topic.get('tp_nav_at'),
		tp_next_status: state.topic.get('tp_next_status')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			tpNavAt,
			tpNextStatus,
			tpNavFixed,
			tpNavData,
			cpShareStatus
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(topic)