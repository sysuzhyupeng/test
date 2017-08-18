import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Button from 'antd-mobile/lib/button'
import Toast from 'antd-mobile/lib/toast'
import { articleData, articlePaging } from '../../action/article'
import Header from '../component/header'
import ArticleItem from '../component/articleItem'
import "../../resource/css/article.less"
import BackTop from '../component/backtop'

class article extends Component {
	constructor() {
		super()
		this.state = {
			loading: true
		};
		this.nav = {
			data:[
				{
					"nav_name":'最新',
					"value":"newest",
					"t":0
				},
				{
					"nav_name":'試車文章',
					"value":"try",
					"t":1
				},
				{
					"nav_name":'熱門新聞',
					"value":"hot",
					"t":4
				},
				{
					"nav_name":'趣味',
					"value":"interest",
					"t":18
				},
				{
					"nav_name":'銷售排行',
					"value":"salesreport",
					"t":7
				},
			],
		}
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	navGetData(t) { //請求數據
		this.getInfo({t: t});
	}
	//页面加载触发
	componentWillMount() {
		let  self = this,
			  str = self.props.params.nav,
				t = 0;
		switch(str)
		{
			case "newest":
			  t = 0;
			  break;
			case "try":
			  t = 1;
			  break;
			case "hot":
			  t = 4;
			  break;
			case "interest":
			  t = 18;
			  break;
			case "salesreport":
			  t = 7;
			  break;
			default:
			  t = 0;
		}
		if (!self.props.article_data) {
			self.getInfo({t: t}); //初始化請求數據
		}
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
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
			self.getInfo({}, self.props.article_paging);
		}
	}
	getInfo(params, paging) { //請求數據
		let self = this,
			article_data =  self.props.article_data || [];


		if (self.loadStatus) {
			self.loadStatus = false;
			if (typeof(paging) != 'undefined') { //滾動加載數據
				if (paging != '') { //有下一頁
					Ajax.get(paging)
					.then(function(res) {
						article_data.push(res.data);
						self.props.actions.articleData(article_data); //新的數據
						self.props.actions.articlePaging(res.paging); //下一頁的鏈接
						self.loadStatus = true;
						if (res.paging) {
							self.setState({
								loading: true
							});
						}else {
							self.setState({
								loading: false
							});
						}
					}).catch(function() {
						self.loadStatus = true;
					})
				}else {
					self.loadStatus = true;
				}
			} else {
				Toast.loading('加載中...', 20, function() {
					Toast.fail('頁面加載失敗，請刷新重試！');
				});
				Ajax.get(Api.base + '/article', params).then(function(res) {
					article_data = [];
					article_data.push(res.data);
					self.props.actions.articleData(article_data); //新的數據
					self.props.actions.articlePaging(res.paging); //下一頁的鏈接
					self.loadStatus = true;
					if (res.paging) {
						self.setState({
							loading: true
						});
					}else {
						self.setState({
							loading: false
						});
					}
					Toast.hide();
				}).catch(function(rej) {
					self.loadStatus = true;
				});
			}
		}
	}
	//浏览人数超过3位数增加逗号.
	addCommas(nStr) {
		nStr += '';
		let  x = nStr.split('.'),
		 	x1 = nStr,
		 	x2 = '',
		   rgx = /(\d+)(\d{3})/;

		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
	render() {
		let self = this,
			nav_value = self.props.params.nav,
			nav_data = self.nav.data,
			list_data = self.props.article_data;

		return (
			<div>
				<Header nav={true} module="文章" home="home" hdClass="hd-inner hd-inner-blue" titleRight={
					<a href={Api.host + '/m/search/search'} className="hd-search">
						<i></i>
					</a>
				} backClass="hd-back hd-back-in" iconClass="hd-icon white" />
				<div className="article-header">
					<nav className="article-nav clearfix">
						{ nav_data.map((v, i) => {
							return <Link key={"nav" + i} to={"/article/"+v.value}  onClick={() => self.navGetData(v.t)} className={v.value == nav_value ? "at" : ""} >{ v.nav_name }</Link>
						})}
		             </nav>
				</div>
				<section className="article-lists">
					<div id="article-list-wrap" className="article-list-wrap">
						<dl className="article-list">
						{
							list_data != ''&& list_data != undefined ? list_data.map((v,i) => {
							 return <ArticleItem key={"articleItem" + i} data={v} limit="10" />
							}) : null
						}
						{ self.state.loading ?<Button className="btn" loading>加載中...</Button> : null }
						</dl>
					</div>
				</section>
				<BackTop />
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		article_data: state.article.get('article_data'),
		article_data_length: state.article.get('article_data_length'),
		article_paging: state.article.get('article_paging')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			articleData,
			articlePaging
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(article)
