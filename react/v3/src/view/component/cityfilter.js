import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { cpCityOpen } from '../../action/component'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'

class CityFilter extends Component {
	constructor() {
		super()
		this.state = {
			city_loading: true
		}
	}
	getInfo(api, param){
		let self = this;
		if(arguments.length >= 2){
			Ajax.get(api, param)
			.then(function(res) {
				self.setState({
					city_data : res
				})
				self.setState({
					city_loading: false
				})
			}).catch(function() {
			})
		}
	}
	back(){
		this.props.actions.cpCityOpen(false);
	}
	cityFilter(city_id, city_name){
		var self = this;
		var callback = self.props.cityCallBack;
		if(city_id) {
			var city_data = {};
			city_data['city_id'] = city_id;
			city_data['city_name'] = city_name;
			typeof callback == 'function' ? callback(city_data) : '';
		}  
	}
	componentWillMount(){
		let self = this;
		let brand_filter = self.props.brand_filter;
		let param = 'b=' + brand_filter;
		let api = self.props.api;
		self.getInfo(api, param);
	}
	render() {
		let self = this;
		let city_data = self.state.city_data;
			return <div>
				<Header module="城市篩選" backClick={() => self.back()} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" iconClass="hd-icon white" />
				<div className="order-city-wrap clearfix">
				    <ul className="order-city-content">
				    	{
				    		city_data ? city_data.data.map((v, i) =>{
				    			return <li key={'city-filter-'+ i } onClick={()=>self.cityFilter(v['id'],v['name'])}>{v['name']}</li>
				    		}): null
				    	}
				    </ul>
				</div>
				{ self.state.city_loading ? <Button className="btn" loading>加載中...</Button> : null}
			</div>
	}
}

function mapStateToProps(state) {
	return {
		
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpCityOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CityFilter)