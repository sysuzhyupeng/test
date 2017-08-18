import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import Button from 'antd-mobile/lib/button'
import { cpModelOpen } from '../../action/component'
import extend from 'extend'

class Model extends Component {
	constructor() {
		super();
		this.state = {
			model_data: [],
			model_loading: true,
			at: 0
		}
	}
	getInfo(api, params){ //請求廠牌列表數據
		let self = this;

		Ajax.get(api, params).then(function(res) {
			self.setState({
				model_data: res,
				model_loading: false
			})
		});
	}
	back(){ //點擊返回關閉車型列表
		this.props.actions.cpModelOpen(false)
	}
	componentWillMount(){
		let   self = this,
			   api = self.props.api,
			params = self.props.params || {};

		self.getInfo(api, params);
	}
	modelFilter(list, brandName, kindName){ //點擊車型觸發回調
		let 	self = this,
			callback = self.props.modelCallBack,
				data = extend(true, list, {
					brandName: brandName,
					kindName: kindName
				});
		
		typeof callback == 'function' ? callback(data) : null;
	}
	tab(num) { //點擊年份切換
		let self = this;
		self.setState({
			at: num
		});
	}
	render() {
		let self = this,
			model_data = self.state.model_data,
			at = self.state.at || 0;

		return (
			<section className={"model-wrap"}>

				<Header module="車型篩選" backClick={() => self.back()} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" />

				<ul className="model-tab">
			    {
					model_data && model_data != '' ? model_data['data'].map((v, i)=>{
						return <li key={'tab-' + i} className={"model-tab-item clearfix " + (at == i ? "at" : "")} onClick={() => self.tab(i)}>{v.label}</li>
					}) : null
				}
				</ul>

				<ul className="model-main">
				{
					model_data && model_data != '' ? model_data['data'][at].list.map((l, n) => {
						return <li key={'main-' + n} className="model-main-item" onClick={() => self.modelFilter(l, model_data.brandName, model_data.kindName)}>
							<div href="">
								<h3 className="model-main-full">{l.year + '款 ' + l.modelName} </h3>
								<p className="model-main-info">
									<span>{l.gas}</span>
									<span>{l.tab}</span>
									<span>{l.power}</span>
								</p>
							</div>
							<div className="model-main-price">{l.price}</div>
						</li>
					}) : null
				}
				</ul>

				{ self.state.model_loading ? <Button className="btn" loading>加載中...</Button> : null }
				
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
			cpModelOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Model)