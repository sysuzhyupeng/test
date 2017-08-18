import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import { connect } from 'react-redux'
import SumNav from './sumnav'
import FootNav from '../component/footNav'
import ArticleItem from '../component/articleItem'
import { articleData, articlePaging } from '../../action/article'
import { Link } from 'react-router'
import "../../resource/css/sum.less"

class kindarticle extends Component {
	constructor() {
		super()
		this.state = {
			data: '',
			listData:'',
			loading: true
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	getInfo(params) { //ÕˆÇó”µ“þ
		let self = this;

		Ajax.get(Api.base + '/info/', params).then(function(res) {
			self.setState({
				data: res
			});
			Toast.hide();
		});
	}
	componentDidMount() {
		let self = this;
		self.getInfo(self.props.params);
		self.getArticleInfo(self.props.params);
		window.addEventListener('scroll', this.handleScroll);

	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}
	handleScroll() { //L„ÓÊÂ¼þ
		let self = this,
			afterScrollTop = document.body.scrollTop,
			scrollHeight = document.body.offsetHeight - window.screen.height;
		//Lµ½µ×²¿¼ÓÝdÏÂÒ»ÁÐ±í
		if (afterScrollTop >= scrollHeight || document.documentElement.scrollTop >= scrollHeight) {
			self.setState({
				loading: true
			});
			self.getArticleInfo({}, self.props.article_paging);
		}
	}
	getArticleInfo(params, paging) {
		let self = this,
			article_data =  self.props.article_data || [];

		if (self.loadStatus) {
			self.loadStatus = false;
			if (typeof(paging) != 'undefined') {
				if (paging != '') {
					Ajax.get(paging).then(function(res) {
						article_data.push(res.data);
						self.props.actions.articleData(article_data); //ÐÂµÄ”µ“þ
						self.props.actions.articlePaging(res.paging); //ÏÂÒ»í“µÄæœ½Ó
							self.loadStatus = true;
							self.setState({
								loading: false
							});
					});
				}
			} else {
					Ajax.get(Api.base + '/article/', params).then(function(res) {
						article_data.push(res.data);
						self.props.actions.articleData(article_data); //ÐÂµÄ”µ“þ
						self.props.actions.articlePaging(res.paging); //ÏÂÒ»í“µÄæœ½Ó
						self.loadStatus = true;
						self.setState({
							loading: false
						});
					});
			}
		} else {
			self.setState({
				loading: false
			});
		}
	}
	render() {
		let self = this,
			data = self.state.data,
			nav_foot_data = [{'name':data.brandName,'url':'/kindarticle/'+data.kind_id}],
			list_data = self.props.article_data;
		return (
			<div>
			{ data ? <section>
				<Header nav={true} module={ data.brandName } hdClass="hd-inner hd-inner-blue" titleRight={
					<a href={Api.host + '/m/search/search'} className="hd-search">
						<i></i>
					</a>
				} backClass="hd-back hd-back-in" iconClass="hd-icon white" />

				<SumNav at="kindarticle"  kid={data.kind_id} source="kind" topic={data.topic.id || ''} />

				<section className="second-nav none">
					<div className="nav-name select-color">全部</div>
					<div className="nav-name">试车</div>
					<div className="nav-name">文章</div>
				</section>
				<section className="article-lists">
					<div id="article-list-wrap" className="article-list-wrap">
						<dl className="article-list">
						{
							list_data != ''&& list_data != undefined ? list_data.map((v,i) => {
							 return <ArticleItem key={"articleItem" + i} data={v} limit="10" />
							}) : null
						}
						{ self.state.loading ?<Button className="btn" loading>加載中..</Button> : null }
						</dl>
					</div>
				</section>

				</section>:null}
				{ data.brandName?<FootNav data={ nav_foot_data }/>:null }
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

export default connect(mapStateToProps, mapDispatchToProps)(kindarticle)