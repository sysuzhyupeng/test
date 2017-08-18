import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class OrderTip extends Component {
	constructor() {
		super()
		this.state = {
			
		}
	}
	componentWillMount(){
		var self = this;
	}
	cancel(name){
		var self = this;
		var callback = self.props.callBackFn;
		typeof callback == 'function' ? callback() : '';
		if (name) {
			ReactGA.ga('send', 'event', '預約試駕', '撥打電話', name);
		}
	}
	render() {
		let self = this;
		let data = self.props.data;
			return <section className="order-tip-wrap"> 
				<div className="order-tip-inner">
				    <div className="order-tip-header">提示</div>
				    {
				    	data['ivr_active'] ?
					    <div className="order-tip-anonymity">
					    	<div className="order-tip-text">匿名撥打後，雙方號碼均會由8891生成一組0986開頭號碼</div>
					    	<a href={'tel:' + data['ivr_phone']} className="order-tip-content" onClick={()=>self.cancel('匿名撥打')}>匿名撥打({data['ivr_phone']})</a>
					    </div> : null
					}
				    <a href={'tel:' + data['tel']} className="order-tip-content" onClick={()=>self.cancel('直接撥打')}>直接撥打({data['tel']})</a>
				    <div className="order-tip-content" onClick={()=>self.cancel()}>取消</div>
				</div>
		  	</section> 
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderTip)