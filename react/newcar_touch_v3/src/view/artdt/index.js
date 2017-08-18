import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import Ajax from '../../utils/ajax'
import { isNullObj } from '../../utils'
import Notice from './notice'
import Like from './like'
import ArticleItem from '../component/articleItem'
import ArtdtKind from './artdtkind'
import Comment from './comment'
import { cpShareStatus } from '../../action/component'
import DowloadFoot from '../component/dowloadFoot'
import Header from '../component/header'
import BackTop from '../component/backtop'
import FootNav from '../component/footNav'
import Share from '../component/share'
import seo from '../../utils/seoConfig'
import extend from 'extend'
import "../../resource/css/artdt.less"

class artdt extends Component {
	constructor() {
		super()
		this.state = {
			loadingStatus: true, //loading圖是否顯示
			type: '',
			id: '',
			nextType: '',
			nextId: '',
			info: [],
			nextArticle: {},
			nowData: '',
			follow:0
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true; //api請求狀態
		this.getInfoStataus = false; //第一頁是否請求成功
		this.nowNum = 0; //初始當前化頁數
		this.allArticle = 0; //共翻了多少頁
		this.firstTitle = ''; //第一篇文章標題
	}
	getInfo(params) { //請求數據
		var self = this,
			params = extend(true, params, {ver: 'v3'});

		if(self.loadStatus) {
			self.loadStatus = false;
			self.state.type = self.state.nextType;
			self.state.id = self.state.nextId;
			Ajax.get(Api.base + '/mobile/article/info/', params).then(function(res) {
				let data = res.data;

				if (typeof(data.article) == 'undefined') {
					alert('很抱歉，您查找的資訊不存在或已刪除！');
					location.replace(Api.host + '/m/article/newest');
					return false;
				};
				//文章統計
				if(data.topic_article == 0) {
					dataLayer.push({'event': 'pageChange', 'virtualPageUrl': '/m/show/articledetails/'+data.article.type+'/'+data.article.id + global.location.search});
				}else { //深度解析相關的文章另外統計
					dataLayer.push({'event': 'pageChange', 'virtualPageUrl': '/m/show/articledetails/'+data.article.type+'/'+data.article.id + global.location.search + '?f=topic'});
				};
				if(self.allArticle == 0) { //記錄第一篇文章的標題
					self.firstTitle = data.article.title;
				};
				self.getInfoStataus = true;
				self.state.info.push(data);
				self.state.nextArticle = data.nextArticle;
				self.state.nextType = data.nextArticle.type;
				self.state.nextId = data.nextArticle.id;
				self.setState(self);
				self.loadStatus = true;
				self.allArticle++; //加載的文章次數

				Ajax.get(Api.base + '/u/favorCheck', params).then(function(res) {
					if(res.status == 200) {
						self.setState({
							follow: 1
						});
					} else {
						self.setState({
							follow: 0
						});

					}
				})


			})
			.catch(function(rej) {
				self.loadStatus = true;
			})
		}
	}
	componentWillMount() {
		let self = this;

		// Toast.loading('加載中...', 20);
		self.setState({
			nextType: self.props.params.type,
			nextId: self.props.params.id
		});
	}
	componentWillReceiveProps() {

	}
    componentDidMount() {
    	let self = this;

		document.domain = '8891.com.tw';
		self.getInfo(self.props.params);
		window.addEventListener('scroll', self.handleScroll);
    }
    componentWillUnmount() {
		let self = this,
			type = '';
		switch(self.props.params.type) {
			case '1':
				type = '新聞';
				break;
			case '2':
				type = '試車文章';
				break;
		}
		ReactGA.ga('send', 'event', '觸屏版文章翻頁統計', type, '用戶在'+ type + '翻了' + self.allArticle + '頁');
		ReactGA.ga('send', 'event', '觸屏版文章翻頁統計', type, '用戶在'+ type +'「' + self.firstTitle + '」翻了' + self.allArticle + '頁');

    	window.removeEventListener('scroll', this.handleScroll);
    }
	loadPage() { //加載下一頁
		let self = this;

		if (isNullObj(self.state.nextArticle)) {
			self.setState({
				loadingStatus: false
			});
		}else {
			self.getInfo(self.state.nextArticle);
		}
	}
	handleScroll() { //滾動事件
		let self = this,
			scrollTop = document.body.scrollTop,
			windowHeight = window.screen.height,
			scrollHeight = document.querySelector('#container').offsetHeight,
			num;

		if(self.getInfoStataus) { //第一頁數據請求后再執行，防止一開始document.querySelector('#container').offsetHeight為屏幕高度提前加載下一頁出現undefined
			let wrap = document.querySelectorAll('.info-wrap');
			wrap.forEach(function(val, i) {
				if(val.offsetTop <= scrollTop + windowHeight/2) {
					num = i;
				}
			});
			if (self.nowNum != num) { //頁數改變
				let nowData = self.state.info[num],
					nowType = nowData.article.type,
					nowId = nowData.article.id;

				self.nowNum = num;
				//重置鏈接地址
				history.replaceState(null, '', '/m/show/articledetails/'+ nowType +'/'+ nowId);

				//頁數改變同步、設置當前頁
				self.setState({
					nowData: nowData
				});
			}
			//滾到底部加載下一頁
			if (scrollTop + windowHeight >= scrollHeight - 100) {
				self.loadPage();
			}
		}
	}
	iFrameHeight() { //iframe加載完成后自適應高度
		let self = this,
			iframe = self.refs['master-iframe'];

		iframe.height = iframe.contentWindow.document.body.offsetHeight;
	}
	shareFn() { //點擊分享
		this.props.actions.cpShareStatus(true);
	}
	fnFollow() {
		var self = this;
		if( self.state.follow == 0 )  {
				let params = '[{"type": "'+self.state.type+'","id":"'+ self.state.id +'"}]';
				Ajax.post(Api.base + '/u/favorAdd',{ "data": params,token: localStorage.getItem('accesstoken') || ''}).then(function(res) {
					if(res.status == 200) {
						Toast.info('收藏成功', 2);
							self.setState({
								follow: 1
							});
					} else {
						 Toast.info(res.error.message, 2);
					}
				})
				.catch(function(rej) {
				})
		} else {
			Toast.info('你已收藏', 2);
		}
	}
	render() {
		let self = this,
			data = self.state.info,
			nav_foot_data = [{'name':'文章','url':'/article/hot'},{'name':'文章詳情','url':'/article/hot'}],
			replyParams = {
				type: self.state.type,
				id: self.state.id
			},
			commentParams = {
				type: self.state.type,
				id: self.state.id,
				limit: 6
			};
		if(data && data.length != 0) { //滾動到哪個頁面對應哪個頁面的內容
			var nowData = self.state.nowData || self.state.info[0],
				nowType = nowData.article.type,
				nowId = nowData.article.id,
				onlyId = 't'+ nowType +'id'+ nowId,
				nowCommentNum = nowData.comment_num > 99 ? 99 : nowData.comment_num,
				shareUrl = nowData.article.fb_url,
				typeName = nowData.article.type_name,
				tag = nowData.article.tag ? nowData.article.tag.join(',') : '';

			seo('articledetails', nowData.article.title, nowData.kind_info.full_name, nowData.article.des, typeName, tag);
		}

		return (
			<section className="artdt-wrap viewartdtIndex">

				<Header nav={true} module="文章" titleRight={
					<a href={Api.host + '/m/search/search'} className="hd-search">
						<i></i>
					</a>
				} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" iconClass="hd-icon white" />
				<div>

					{data ? data.map((v, i) => {
					return <section key={i} className="info-wrap" data-type={v.article.type} data-id={v.article.id}>

						<iframe ref="master-iframe" width="100%" scrolling="no" className="info-iframe" src={v.article.webview_url + '&touch=1'} onLoad={() => self.iFrameHeight()}></iframe>

                          <Like data={v.article}  getInfo={() => self.getInfo()} type={ replyParams.type }/>
                          <div className={v.relationship_article != ''?'news-title':'none'} >相關新聞</div>
                          {v.relationship_article != '' ?
                              <ArticleItem type="ArticleDetails" data={v.relationship_article} limit="5" imgBefore={self.imgBefore} />
                          : null }

						<div className={v.kind_info != ''?'news-title':'none'} >相關車款</div>
						{v.kind_info != '' ? <ArtdtKind data={v.kind_info} /> : null }

						{v.notify != '' ? <Notice data={v.notify} /> : null}

						<Comment params={commentParams} more={true} limit="6" />



					</section> }) : null}

					{self.state.loadingStatus ? <Button ref="loadingImg" className="btn" loading></Button> : null}
				</div>
				{data && data.length != 0 ? <div ref="write" className="write-box">
					<div className="write-input-article">
						<label htmlFor={onlyId} className="write-input-text">說點什麼吧</label>
						<div className="write-input-icon">
							<Link to={"/show/articleComment/" + nowType + "/" + nowId} className="write-input-number">
								{nowCommentNum != 0 ? <i>{nowCommentNum}</i> : null}
							</Link>
							<i className={self.state.follow == 0?'follow-icon':'follow-press-icon'} onClick={() => self.fnFollow()}></i>
							<span ref="write-share" className="write-input-share" onClick={() => self.shareFn()} data-url={self.props.url}></span>
						</div>
					</div>
				</div> : null}

				{ data != '' ? <Share shareUrl={shareUrl} /> :null }

				<FootNav data={ nav_foot_data }/>

				<BackTop />

			</section>
		)
	}
}

function mapStateToProps(state) {
	return {

	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpShareStatus
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(artdt)