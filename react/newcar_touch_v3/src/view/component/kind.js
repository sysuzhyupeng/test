import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { cpKindOpen } from '../../action/component'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Button from 'antd-mobile/lib/button'
import Header from '../component/header'

class Kind extends Component {
	constructor() {
		super();
		this.state = {
			kind_data: [],
			paging: '',
			kind_loading: false,
			data_loading: true
		}
		this.kindScroll = this.kindScroll.bind(this);
		this.loadStatus = true;
	}
	getInfo(api, params, paging) { //請求數據
		let self = this,
			kind_data = self.state.kind_data || [];

		if (self.loadStatus) { //防止多次加載
			self.loadStatus = false;

			if (typeof(paging) != 'undefined') { //滾動加載數據
				if (paging != '') { //有下一頁
					Ajax.get(paging).then(function(res) {
						kind_data.push(res);
						self.setState({
							kind_data: kind_data,
							paging: res.paging //下一頁的鏈接
						});
						self.loadStatus = true;
						self.setContentHeight();
					}).catch(function() {
						self.loadStatus = true;
					})
				}else { //滾到底部了
					self.setState({
						kind_loading: false
					})
				}
			} else { //非滾動加載的要先清空數據
				Ajax.get(api, params).then(function(res) {
					if(!res) {
						self.setState({
							data_loading: false
						})
					}
					kind_data = [];
					kind_data.push(res);
					self.setState({
						kind_data: kind_data,
						paging: res.paging //下一頁的鏈接
					});
					if(res.paging){
						self.setState({
							kind_loading: true
						})
						var content = self.refs['kind-type-content'];
						content.addEventListener('scroll', self.kindScroll);
					}else {
						self.setState({
							kind_loading: false
						})
					}
					self.loadStatus = true;
					self.setContentHeight();
				}).catch(function() {
					self.loadStatus = true;
				})
			}

		}
	}
	back() { //點擊返回關閉車款列表
		this.props.actions.cpKindOpen(false)
	}
	hideWrap(){ //關閉車款
		let self = this;

		self.props.actions.cpKindOpen(false);
	}
	setContentHeight() { //設置車款列表內容高度
		let 	self = this,
			wd = window.screen.height,
			hdHeight = document.getElementById('hd-inner').offsetHeight,
			kindHead = self.refs['kind-header'],
			khHeight = kindHead.offsetHeight,
			 content = self.refs['kind-type-content'];

		content.style.height = wd - hdHeight - khHeight + 'px';
	}
	componentWillMount(){
		let self = this,
			api = self.props.api,
			params = self.props.params || {};

		self.getInfo(api, params); //初始化請求數據
	}
	kindFilter(data){ //點擊車款觸發回調
		let self = this,
			callback = self.props.kindCallBack;

		typeof callback == 'function' ? callback(data) : '';
	}
	componentWillUnmount() {
		let self = this;

		self.removekindScroll();
	}
	removekindScroll(){
		let self = this,
			content = self.refs['kind-type-content'];

		content.removeEventListener('scroll', this.kindScroll);
	}
	kindScroll() { //滾動事件
		let 	 self = this,
			  content = self.refs['kind-type-content'],
			 conInner = self.refs['kind-type-content-inner'],
			scrollTop = content.scrollTop,
			 inHeight = conInner.offsetHeight,
			conHeight = content.offsetHeight;

		//滾到底部加載下一列表
		if (scrollTop >= inHeight - conHeight) {
			self.getInfo('', {}, self.state.paging);
		}
	}
	render() {
		let self = this,
			kind_data = self.state.kind_data,
			link = self.props.link;

		return <section className="kind-wrap">

			<Header module="車款篩選" backClick={() => self.back()} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" />

			<div className="kind-shadow" onClick={() => self.hideWrap()}>
				<div className= "kind-shadow-hide">>></div>
			</div>

			<div className="kind-main">
		    	{
		    		kind_data[0] ?
			    	    <div ref="kind-header" className="kind-header">
				    		<div className="kind-header-photo"><img src={kind_data[0].brand_image}/></div>
							<div className="kind-header-param">
								<div className="kind-header-brand">{kind_data[0].brand_name}</div>
								<div className="kind-header-price">共{kind_data[0]['total']}個車款，{kind_data[0]['modelNum']}個車型</div>
							</div>
						</div>
				    : null
				}
				<div className="kind-type-content" ref="kind-type-content">
					<div ref="kind-type-content-inner">
					{
						kind_data && kind_data != '' ? kind_data.map((v, i) =>{
							return <ul key={'kind-type' + i}>
								{
									v ? v.data.map((l, t) => {
								return  <Link to={self.props.link=="link"?'/kindpic/'+l.kind_id+'/all':''} key={'kind-type-filter-'+ t}>
											<li className="kind-type-detail"  onClick={self.props.link=="link"?'':()=>self.kindFilter(l)}>
									            <div className="kind-type-photo"><img src={l['thumb']} /></div>
									            <div className="kind-type-param">
										            <div className="kind-type-info">{l['kindName']}</div>
										            <div className="kind-type-price">{l['price']}</div>
										        </div>
									        </li>
								        </Link>
									}): null
								}
							</ul>
						}) :  self.state.data_loading ?
						    <div className="kind-loading"></div>
						:  <div className="kind-no-data">暫無數據</div>
					}
					</div>
					{ self.state.kind_loading ? <Button className="btn" loading>加載中...</Button> : null }
				</div>
			</div>

	  	</section>
	}
}

function mapStateToProps(state) {
	return {
		kind_data: state.component.get('kind_data')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpKindOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Kind)