import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class SuccessTip extends Component {
	constructor() {
		super()
		this.state = {
			
		}
	}
	componentWillMount(){
		var self = this;
	}
	clickHandle(){
		var self = this;
		var callback = self.props.callBackFn;
		typeof callback == 'function' ? callback() : '';
	}
	render() {
		let self = this;
		return <section className="order-success-wrap"> 
			<div className="order-success-inner">
				<div className="order-success-photo"></div>
			    <div className="order-success-info">提交成功，會有工作人員聯絡您試車哦</div>
			    <div className="order-success-btn" onClick={()=>self.clickHandle()}>我知道了</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SuccessTip)