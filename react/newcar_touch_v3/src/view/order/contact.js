import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import { cpBrandOpen, cpKindOpen, cpCityOpen} from '../../action/component'
import { orderContactData, orderContactName, orderContactTel, orderContactSex} from '../../action/order'
import Header from '../component/header'
import OrderItem from './orderitem'
import Brand from '../component/brand'
import Kind from '../component/kind'
import CityFilter from '../component/cityfilter'
import SuccessTip from './successtip'
import seo from '../../utils/seoConfig'
import BackTop from '../component/backtop'
import { browserHistory } from 'react-router'
import "../../resource/css/order.less"

class Contact extends Component {
	constructor() {
		super();
		this.state = {
			brand_id: '',
			kind_id: '',
			show_success_tip: false
		}
		this.loadStatus = true;
	}
	getInfo(params) { //請求數據
		let self = this,
			order_contact_data = [];
		var api =  Api.base + '/dealers/';
		if (self.loadStatus) {
			self.loadStatus = false;
			Ajax.get(api, params)
			.then(function(res) {
				order_contact_data = [];
				order_contact_data.push(res);
				self.props.actions.orderContactData(order_contact_data); //新的數據
			}).catch(function() {
				self.loadStatus = true;
			})
		}
	}
	//顯示篩選
	showFilter(){
		var self = this;
		window.removeEventListener('scroll', this.handleScroll);
		self.props.actions.orderShowFilter(true);
	}
	//隱藏車款篩選
	hideKindFilter(kindData){
		var self = this;
		self.setState({
			order_kind_name: kindData.kindName,
			order_kind_price: kindData.price,
			order_kind_image: kindData.thumb,
			kind_id: kindData.kind_id
		})
		self.props.actions.cpBrandOpen(false);
		self.props.actions.cpKindOpen(false);
		//將加載數據設為true
		self.loadStatus = true;
	}
	//顯示城市篩選
	showCityFilter(){
		var self = this;
		self.props.actions.cpCityOpen(true);
	}
	//隱藏城市篩選
	hideCityFilter(cityData){
		var self = this;
		self.setState({
			city_id: cityData.city_id,
			city_name: cityData.city_name
		})
		self.props.actions.cpCityOpen(false);
		//將加載數據設為true
		self.loadStatus = true;
	}
	//顯示廠牌篩選
	showBrandFilter(){
		var self = this;
		self.props.actions.cpBrandOpen(true);
	}
	//隱藏廠牌篩選
	hideBrandFilter(){
		var self = this;
		self.setState({
			show_brand_filter: false
		})
	}
	//顯示車款篩選
	showKindFilter(brandData){
		var self = this;
		self.setState({
			brand_id: brandData.id
		})
		self.props.actions.cpKindOpen(true);
	}
	hideSuccessTip(){
		var self = this;
		browserHistory.push('/order');
	}
	cityInput(e){
		e.preventDefault();
	}
	//輸入名字
	nameInput(e){
		var self = this;
		var value = e.target.value;
		self.props.actions.orderContactName(value);
	}
	//輸入電話
	telInput(e){
		var self = this;
		var value = e.target.value;
		self.props.actions.orderContactTel(value);
	}
	//輸入性別
	sexInput(e){
		var self = this;
		var value = e.target.value;
		self.props.actions.orderContactSex(value);
	}
	confirmSubmit(){
		var self = this;
		var order_brand_id = self.state.brand_id;
		var order_kind_id = self.state.kind_id;
		var order_city_id = self.state.city_id;

		var dealer_input = self.refs['dealer'].getElementsByTagName('input');
		var dealer_value = '';
		var dealer_num = 0;
		var order_contact_sex = self.props.order_contact_sex;
		var order_contact_tel = self.props.order_contact_tel;
		var order_contact_name = self.props.order_contact_name;
		if(!order_contact_name){
			Toast.info('請輸入稱呼', 1);
			return false;
		}
		if(!order_contact_tel){
			Toast.info('請輸入行動電話', 1);
			return false;
		}
		if(!order_contact_tel.match(/^09[1-8][0-9]{7}$/)){
			Toast.info('請輸入正確電話格式', 1);
			return false;
		}
		if(!order_contact_sex){
			Toast.info('請選擇性別', 1);
			return false;
		}
		if(!order_brand_id || !order_kind_id){
			Toast.info('請選擇廠牌車款', 1);
			return false;
		}
		if(!order_city_id){
			Toast.info('請選擇所在城市', 1);
			return false;
		}
		for(var i = 0, len = dealer_input.length; i < len; i++){
			if(dealer_input[i].checked){
				dealer_value += (dealer_num > 0 ? ',' + dealer_input[i].value :
							  dealer_input[i].value);
				dealer_num++;
			}
		}
		if(!dealer_value){
			Toast.info('您未選擇試駕的車行', 1);
			return false;
		}
		var params = {
			b: order_brand_id,
			k: order_kind_id,
			name: order_contact_name,
			phone: order_contact_tel,
			sex: order_contact_sex,
			dealer: dealer_value
		};
		
		var api =  Api.base + '/testrun/post';
		Ajax.post(api, params)
		.then(function(res) {
			if(res.error){
				ReactGA.ga('send', 'event', '預約試駕', '提交', '提交成功');
				Toast.info(res.error.message, 1);
			}
			if(res.status == '200'){
				ReactGA.ga('send', 'event', '預約試駕', '提交', '提交失敗');
				self.setState({
					show_success_tip: true
				})
			}
		}).catch(function(e) {
			ReactGA.ga('send', 'event', '預約試駕', '提交', '提交失敗');
			//ajax failed
		})
	}
	componentDidMount() {
		var self = this;
		if (!self.props.order_contact_data) {
			self.getInfo({}); //初始化請求數據
		}
	}
	componentDidUpdate() {
		var self = this;
		//如果沒有顯示篩選且有了篩選值，那麼重新請求數據
		if(!(self.props.cp_brand_open || self.props.cp_city_open)){
			var order_brand_id = self.state.brand_id,
				order_city_id = self.state.city_id;
			if(order_brand_id || order_city_id){
				var params = 'r=' + order_city_id + '&b=' + order_brand_id;
				self.getInfo(params);
			}
		}
	}
	render() {
		let self = this,
			data = self.props.order_contact_data;
	    let order_contact_show_filter = self.props.order_contact_show_filter;
	    let order_contact_tel = self.props.order_contact_tel;
	    let order_contact_sex = self.props.order_contact_sex;
	    let order_contact_name = self.props.order_contact_name;
	    let show_success_tip = self.state.show_success_tip;
	    let order_city_name = self.state.city_name;

	    let cp_kind_open = self.props.cp_kind_open;
	    let cp_brand_open = self.props.cp_brand_open;
	    let cp_city_open = self.props.cp_city_open;


		return <div>
			<section className="order-wrap">
				{ 
					!(self.props.cp_brand_open || self.props.cp_city_open) ?
					<Header nav={true} module="預約試駕"  hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" iconClass="hd-icon white" />
				    : null
				}
				{
					show_success_tip ? <SuccessTip callBackFn={self.hideSuccessTip.bind(self)} /> : null
				}
				{   !(self.props.cp_brand_open || self.props.cp_city_open) ?
					<div>
						<div className="order-contact-main">
							<div className="order-contact-header">選擇車款後，還請到店後自行與工作人員商議試駕車型哦</div>
							{
								self.state.order_kind_name ? 
								<div className="order-contact-data" onClick={()=>self.showBrandFilter()}>
									<div className="order-contact-data-left">
										<img src={self.state.order_kind_image} />
										<div className="order-contact-data-name">{self.state.order_kind_name}</div>
										<div className="order-contact-data-price">{self.state.order_kind_price}</div>
									</div>
									<div className="order-contact-data-right">></div>
								</div> 
								:
								<div className="order-contact-type" onClick={()=>self.showBrandFilter()}>
									<div className="order-contact-type-left">請選擇廠牌車款</div>
									<div className="order-contact-type-right">></div>
								</div>
							}
							<div className="order-contact-name">
								<div className="order-contact-name-left"><span>用戶姓名：</span><input type="text" placeholder="請輸入稱呼" ref="name" defaultValue={order_contact_name}  onChange={self.nameInput.bind(self)}/></div>
							    <div className="order-contact-name-right" ref="sex">
							    	<input id="man" type="radio" name="sex" defaultValue="B" checked={order_contact_sex=='B'? 'checked': ''} onChange={self.sexInput.bind(self)}/>
		                            <label htmlFor="man">先生</label>
		                            <input id="woman" type="radio" name="sex" defaultValue="G" checked={order_contact_sex=='G'? 'checked': ''} onChange={self.sexInput.bind(self)}/>
		                            <label htmlFor="woman">小姐</label>
							    </div>
							</div>
							<div className="order-contact-tel">
								<div className="order-contact-name-left">
							    	<span>行動電話：</span><input type="text" placeholder="請輸入行動電話" ref="tel"  defaultValue={order_contact_tel}  onChange={self.telInput.bind(self)}/>
							    </div>
							</div>
							<div className="order-contact-city" onClick={()=>self.showCityFilter()}>
								<div className="order-contact-name-left">
									<span>所在城市：</span><input type="text" value={order_city_name} ref="city" placeholder="請選擇所在城市" onChange={self.cityInput.bind(self)} />
								</div>
								<div className="order-contact-city-right" >選擇城市></div>
							</div>
						</div>
						<div className="order-contact-show">展示廳</div>
						{
							data ? data.map((v, i) => {
								return <div className="order-contact-content-wrap" ref="dealer" key={i}>
									{
										v.data && !order_contact_show_filter ? v.data.map((l, t)=>{
											return <OrderItem  module="業務聯繫我" key={'OrderItem' + t} data={l} />
										}) : null
									}
								</div>
							}) : null
						}
						<div className="order-contact-submit" onClick={()=>self.confirmSubmit()}>確認提交</div>
				    </div> : null
				}
				{ cp_brand_open ? <Brand api={Api.base + '/dealers/brand'} brandCallBack={(brandData)=>self.showKindFilter(brandData)} /> : null } 
				{ cp_kind_open ? <Kind api={Api.base + '/kind/'} params={{b: self.state.brand_id}} kindCallBack={(kindData)=>self.hideKindFilter(kindData)} /> : null }
				{ cp_city_open ? <CityFilter api={Api.base + '/dealers/region'} cityCallBack={(cityData)=>self.hideCityFilter(cityData)} brand_filter={self.state.brand_id} /> : null }
				{ self.state.loading && !(self.props.cp_brand_open || self.props.cp_city_open) ? <Button className="btn" loading>加載中...</Button> : null}
				<BackTop />
			</section>
		</div>
	}
}

function mapStateToProps(state) {
	return {
		order_contact_data: state.order.get('order_contact_data'),
		order_contact_show_filter: state.order.get('order_contact_show_filter'),
		order_contact_sex: state.order.get('order_contact_sex'),
		order_contact_name: state.order.get('order_contact_name'),
		order_contact_tel: state.order.get('order_contact_tel'),
		cp_city_open: state.component.get('cp_city_open'),
		cp_brand_open: state.component.get('cp_brand_open'),
		cp_kind_open: state.component.get('cp_kind_open')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			orderContactData,
			orderContactName, 
			orderContactTel, 
			orderContactSex,
			cpCityOpen,
			cpBrandOpen,
			cpKindOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact)