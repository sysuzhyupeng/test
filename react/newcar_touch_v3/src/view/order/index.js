import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Button from 'antd-mobile/lib/button'
import { cpBrandOpen, cpCityOpen } from '../../action/component'
import { orderData, orderPaging } from '../../action/order'
import Header from '../component/header'
import OrderItem from './orderitem'
import Brand from '../component/brand'
import CityFilter from '../component/cityfilter'
import OrderTip from './ordertip'
import seo from '../../utils/seoConfig'
import BackTop from '../component/backtop'
import "../../resource/css/order.less"

class Order extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			show_city_filter: false,
			show_call_tip: false
		}
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	getInfo(params, paging) { //請求數據
		let self = this,
		order_data = self.props.order_data || [];
		if (self.loadStatus) { //防止多次加載
			self.loadStatus = false;

			if (typeof(paging) != 'undefined') { //滾動加載數據
				if (paging != '') { //有下一頁
					Ajax.get(paging)
					.then(function(res) {
						order_data.push(res);
						self.props.actions.orderData(order_data); //新的數據
						self.props.actions.orderPaging(res.paging); //下一頁的鏈接
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
				var api =  Api.base + '/dealers/';
				Ajax.get(api, params)
				.then(function(res) {
					order_data = [];
					order_data.push(res);
					self.props.actions.orderData(order_data); //新的數據
					self.props.actions.orderPaging(res.paging); //下一頁的鏈接
					if(res.paging){
						self.setState({
							loading: true
						})
					}else {
						self.setState({
							loading: false
						})
					}
					self.loadStatus = true;
				}).catch(function() {
					self.loadStatus = true;
				})
			}

		}
	}
	//顯示撥打電話提示
	showCallTip(ivr_active, tel, ivr_phone){
		var self = this;
		var data = {};
		if(ivr_active){
			data.ivr_active = true;
			data.ivr_phone = ivr_phone;
		} else {
			data.ivr_active = false;
		}
		data.tel = tel;
		self.setState({
			show_call_tip: true,
			call__tip_data: data
		})
	}
	//隱藏撥打電話提示
	hideCallTip(){
		var self = this;
		self.setState({
			show_call_tip: false
		})
	}
	//顯示篩選
	showFilter(){
		var self = this;
		window.removeEventListener('scroll', this.handleScroll);
		self.props.actions.cpBrandOpen(true);
	}
	//隱藏城市篩選
	hideCityFilter(cityData){
		var self = this;
		self.setState({
			city_id: cityData.city_id,
			city_name: cityData.city_name
		})
		self.props.actions.cpCityOpen(false);
	}
	//顯示城市篩選
	showCityFilter(brandData){
		var self = this;
		self.setState({
			brand_id: brandData.id
		})
		self.props.actions.cpCityOpen(true);
		self.props.actions.cpBrandOpen(false);
	}
	componentDidMount() {
		var self = this;
		if (!self.props.order_data) {
			self.getInfo(); //初始化請求數據
		}
		window.addEventListener('scroll', self.handleScroll);
	}
	componentDidUpdate() {
		var self = this;
		//如果沒有顯示篩選且有了篩選值，那麼重新請求數據
		if(!(self.props.cp_city_open || self.props.cp_brand_open)){
			var order_brand_id = self.state.brand_id,
				order_city_id = self.state.city_id;
			if(order_brand_id || order_city_id){
				var params = 'r=' + order_city_id + '&b=' + order_brand_id;
				self.getInfo(params);
			}
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
			self.getInfo({}, self.props.order_paging);
		}
	}
	render() {
		let self = this,
			data = self.props.order_data;
	   	let cp_city_open =  self.props.cp_city_open;
	    let cp_brand_open =  self.props.cp_brand_open;
	
		return <div>
			<section className="order-wrap">
				{
					!(cp_city_open || cp_brand_open) ?
					<Header module="預約試駕" rightContent={
						<Link to="order/contact" className="hd-icon-order" >業務聯繫我</Link>
		 		} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" iconClass="hd-icon white" />
				    : null
				}
				{
					self.state.show_call_tip ? <OrderTip data={self.state.call__tip_data} callBackFn={self.hideCallTip.bind(self)} /> : null
				}
				{ 
					!(cp_city_open || cp_brand_open) ?
					<div className="order-nav"><span className="order-show">展示廳</span><span className="order-choose" onClick={()=>self.showFilter()}>篩選</span></div> 
					: null
			    }
				{
					data ? data.map((v, i) => {
						return <div key={i}>
							{
								v.data && !(cp_city_open || cp_brand_open) ? v.data.map((l, t)=>{
									return <OrderItem key={'OrderItem' + t} ivr={v['ivr_active']} data={l} callBackFn={self.showCallTip.bind(self)} />
								}) : null
							}
						</div>
					}) : null
				}
				{ cp_brand_open ? <Brand api={Api.base + '/dealers/brand'} brandCallBack={(brandData)=>self.showCityFilter(brandData)} /> : null } 
				{ cp_city_open ?<CityFilter api={Api.base + '/dealers/region'} cityCallBack={(cityData)=>self.hideCityFilter(cityData)} brand_filter={self.state.brand_id} /> : null }
				{ self.state.loading && !(cp_city_open || cp_brand_open) ? <Button className="btn" loading>加載中...</Button> : null}
				<BackTop />
			</section>
		</div>
	}
}

function mapStateToProps(state) {
	return {
		order_data: state.order.get('order_data'),
		order_data_length: state.order.get('order_data_length'),
		order_paging: state.order.get('order_paging'),
		order_show_filter: state.order.get('order_show_filter'),
		cp_brand_open: state.component.get('cp_brand_open'),
		cp_city_open: state.component.get('cp_city_open')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			orderPaging,
			orderData,
			cpBrandOpen,
			cpCityOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)