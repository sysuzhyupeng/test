import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import { tpListData, tpListPaging } from '../../action/topiclist'
import Header from '../component/header'
import Overview from './verview'
import FootNav from '../component/footNav'
import ListItem from './listItem'
import seo from '../../utils/seoConfig'
import BackTop from '../component/backtop'
import "../../resource/css/topicList.less"

class TopicList extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		}
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	getInfo(params, paging) { //請求數據
		let self = this,
			tplist_data = self.props.tplist_data || [];

		if (self.loadStatus) { //防止多次加載
			self.loadStatus = false;

			if (typeof(paging) != 'undefined') { //滾動加載數據
				if (paging != '') { //有下一頁
					Ajax.get(paging)
					.then(function(res) {
						tplist_data.push(res);
						self.props.actions.tpListData(tplist_data); //新的數據
						self.props.actions.tpListPaging(res.paging); //下一頁的鏈接
						self.loadStatus = true;
					}).catch(function() {
						self.loadStatus = true;
					})
				}else { //滾到底部了
					self.setState({
						loading: false
					})
				}
			}else { //非滾動加載的要先清空數據
				var api =  Api.base + '/topic/search/';
				Ajax.get(api, params)
				.then(function(res) {
					tplist_data = [];
					tplist_data.push(res);
					self.props.actions.tpListData(tplist_data); //新的數據
					self.props.actions.tpListPaging(res.paging); //下一頁的鏈接
					self.loadStatus = true;
				}).catch(function() {
					self.loadStatus = true;
				})
			}

		}
	}
	componentDidMount() {
		var self = this;
		if (!self.props.tplist_data) {
			self.getInfo(); //初始化請求數據
		}
		window.addEventListener('scroll', self.handleScroll);
	}
	componentDidUpdate() {
		var self = this,
			status = self.props.cp_filter_status,
			hd = self.refs['tplist-wrap'];
		//設置遮罩層
		if (status) {
			// var hei = document.body.offsetHeight - hd.offsetHeight;
			var hei = document.body.offsetHeight;
			document.querySelector('.navtop-back').style.height = hei + 'px';
		}
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}
	handleScroll() { //滾動事件
		let self = this,
			afterScrollTop = document.body.scrollTop,
			scrollHeight = document.body.offsetHeight - window.screen.height;

		//滾到底部加載下一列表
		if (afterScrollTop >= scrollHeight || document.documentElement.scrollTop >= scrollHeight) {
			self.getInfo({}, self.props.tplist_paging);
		}
	}
	render() {
		let self = this,
			nav_foot_data = [{'name':'深度解析','url':'/topic'}],
			data = self.props.tplist_data;
		if (data != '') { //設置SEO
			seo('topicList');
		}
		return <div>
			<section className="tplist-wrap" ref="tplist-wrap">
				<Header nav={true} module="深度解析"  titleRight={
					<section className="hd-icon-group"><Link to="topic/search" className="hd-icon-search" ></Link></section>
	 		} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" iconClass="hd-icon white" />

				{
					data ? data.map((v, i) => {
						return <div key={i}>

							{ i == 0   ? <Overview data={v.latest} />  : null}

							{
								v ? v.old.map((l, t) => {
									return <ListItem key={'listItem' + t} data={l} />
								}) : null
							}

						</div>
					}) : null
				}
				{ self.props.nav ? <NavTop /> : null }
				{ self.state.loading ? <Button className="btn" loading>加載中...</Button> : null}

				<BackTop />
			</section>
			<FootNav data={ nav_foot_data }/>
		</div>
	}
}

function mapStateToProps(state) {
	return {
		tplist_data: state.topic_list.get('tplist_data'),
		tplist_data_length: state.topic_list.get('tplist_data_length'),
		tplist_paging: state.topic_list.get('tplist_paging'),
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			tpListData,
			tpListPaging
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicList)