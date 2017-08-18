import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import LazyLoadImg from 'react-lazyload-img'
import noPic from '../../resource/img/nopic-86-57.png'
import BackTop from '../component/backtop'
import "../../resource/css/filter.less"

class kindsum extends Component {
	constructor() {
		super()
		this.state = {
			data: [],
			paging: '',
			loading: true
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	componentWillMount() {
		var self = this,
			condition = self.props.location.query ? self.props.location.query : {}; //獲取搜索條件

		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
		Ajax.get(Api.base + '/kind/?sort=default', condition).then(function(res) {
			let gaData = res.filter;
			gaData.event = 'SearchResultEvent';
			dataLayer.push(gaData);
		})
		self.getInfo(condition);
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}
	getInfo(params, paging) {
		var self = this,
			dData = self.state.data || [];

		if (self.loadStatus) { //防止多次加載
			self.loadStatus = false;

			if (typeof(paging) != 'undefined') { //滾動加載數據
				if (paging != '') { //有下一頁
					Ajax.get(paging).then(function(res) {
						dData.push(res);
						self.setState({
							data: dData,
							paging: res.paging
						});
						if (res.paging == '') {
							self.setState({
								loading: false
							})
						};
						self.loadStatus = true;
					}).catch(function() {
						self.loadStatus = true;
					})
				}
			}else { //非滾動加載的要先清空數據
				Ajax.get(Api.base + '/kind/?sort=default', params).then(function(res) {
					dData.push(res);
					gaData = res.filter;
					gaData.event = 'SearchResultEvent';
					dataLayer.push(gaData);
					self.setState({
						data: dData,
						paging: res.paging
					});
					if (res.paging == '') {
						self.setState({
							loading: false
						})
					};
					Toast.hide();
					self.loadStatus = true;
				}).catch(function() {
					self.loadStatus = true;
				});
			}
		}
	}
	handleScroll() { //滾動事件
		let self = this,
			afterScrollTop = document.body.scrollTop,
			scrollHeight = document.body.offsetHeight - window.screen.height;
	
		//滾到底部加載下一列表
		if (afterScrollTop >= scrollHeight || document.documentElement.scrollTop >= scrollHeight) {
			self.getInfo({}, self.state.paging);
		}
	}
	render() {
		let self = this,
			data = self.state.data;

		if (data != '') {
			return (
				<div>

					<Header 
						nav={true} 
						module="選車結果"
						hdClass="hd-inner hd-inner-blue"
						backClass="hd-back hd-back-in"
						iconClass="hd-icon white" 
					/>


					{ data[0].selected != '' ? <div className="flt-autos-cd">{data[0].selected.join('，')}</div> : null }


					{ data.map((l, t) => {
						return <section key={"box" + t}>
							{ l.data != '' ? <div className="flt-autos-list clearfix">
								{ l.data.map((v, i) => {
									return <Link key={"item" + i} to={"/kindsum/" + v.kind_id} className="flt-autos-item">
										<LazyLoadImg className="flt-autos-img" src={v.thumb} placeholder={noPic} />
										<div className="flt-autos-title">{v.brandName + " " + v.kindName}</div>
										<div className="flt-autos-price">{v.price}</div>
									</Link>
								}) } 
							</div> : <div className="flt-autos-none">很抱歉！沒有您要找的車輛<br />您可以更改搜尋條件再試試看哦！</div> }
						</section>
					})}


					{ self.state.loading ? <Button className="btn" loading>加載中...</Button> : null}


					<BackTop />


				</div>
			)
		}else {
			return null;
		}
	}
}

function mapStateToProps(state) {
	return {
		
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(kindsum)