import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import Button from 'antd-mobile/lib/button'
import { cpBrandOpen } from '../../action/component'
import BrandList from './brandList'
import BrandNav from './brandNav'

class Brand extends Component {
	constructor() {
		super();
		this.state = {
			brand_data: '',
			brand_loading: true
		}
	}
	getInfo(api, params){ //請求廠牌列表數據
		let self = this;

		Ajax.get(api, params).then(function(res) {
			self.setState({
				brand_data: res,
				brand_loading: false
			})
		});
	}
	back(){ //點擊返回關閉廠牌列表
		this.props.actions.cpBrandOpen(false)
	}
	componentWillMount(){
		let   self = this,
			   api = self.props.api,
			params = self.props.params || {};

		self.getInfo(api, params);
	}
	componentDidUpdate(prevProps, prevState) {
		var self = this,
			cp_kind_open = self.props.cp_kind_open,
			main = self.refs['brand-main'];

		if (cp_kind_open) { //車款頁展開時廠牌列表不允許滾動
			main.style.height = window.screen.height + 'px';
			main.style.overflow = 'hidden';
		}else {
			main.style.height = 'initial';
			main.style.overflow = 'initial';
		}
	}
	brandFilter(data){ //點擊廠牌觸發回調
		let 	self = this,
			callback = self.props.brandCallBack;

		typeof callback == 'function' ? callback(data) : null;
	}
	render() {
		let self = this,
			brand_data = self.state.brand_data;

		return (
			<section ref="brand-main" className="brand-main">

				<Header module="廠牌篩選" backClick={self.props.back=="back"?'':() => self.back()} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" />

			    { brand_data ? <BrandList data={brand_data['brand']} brandItemClick={(data) => self.brandFilter(data)} /> : null }

				{ brand_data ? <BrandNav data={brand_data.index} />  : null }

				{ self.state.brand_loading ? <Button className="btn" loading>加載中...</Button> : null }

			</section>
		)
	}
}

function mapStateToProps(state) {
	return {
		cp_kind_open: state.component.get('cp_kind_open')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpBrandOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Brand)