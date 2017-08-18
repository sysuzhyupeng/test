import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'

class OrderItem extends Component {
	constructor() {
		super()
		this.state = {
			
		}
	}
	call(tel, ivr_mobile){
		var self = this;
		var ivr_active = self.props.ivr;
		var callback = self.props.callBackFn;
		typeof callback == 'function' ? callback(ivr_active, tel, ivr_mobile) : '';
	}
	render() {
		let self = this;
		let data = self.props.data;
		let module = self.props.module;
			return <section>
			    {
					module != '業務聯繫我' ?
					<div className="orderitem-wrap clearfix">
						<div className="orderitem-left">
							<div className="orderitem-photo"><img src={data['shop_brand']} /></div>
							<div className="orderitem-brand">{data['shop_name']}</div>
							<div className="orderitem-address">{data['shop_address']}<a href={"https://www.google.com/maps?q=" + data['shop_address']} target="_blank" className="orderitem-btn"><i></i></a></div>
							<div className="orderitem-tel">{data['tel']}{ Number(data['call_num']) > 0 ? <span>(有{data['call_num']}次通話)</span>: null }</div>
						</div>
						<div className="orderitem-right">
							<div className="orderitem-call"></div>
							<div className="orderitem-dial" onClick={()=>self.call(data['tel'], data['ivr_mobile'])}>預約試駕</div>
						</div>
					</div>
					:
					<div className="order-contact-content">
						<input type="checkbox" className="order-contact-content-input" defaultValue={data['id']} />
						<div className="order-contact-content-right">
							<div className="order-contact-content-top"><img src={data['shop_brand']} /><span>{data['shop_name']}</span></div>
							{
							   data['tel'] ?
							   <div className="order-contact-content-tel"><span>{data['tel']}</span><i></i></div>
							   : null
							}
							<div className="order-contact-content-addr">{data['shop_address']}<a href={"https://www.google.com/maps?q=" + data['shop_address']} className="order-contact-content-check" target="_blank">查看地圖</a></div>
						</div>
					</div>
			    }
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem)