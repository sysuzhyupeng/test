/*
* 中部彈窗提示
* 傳入info屬性和callbackFn回調屬性
* 將回調函數直接綁定this傳進來
*/

import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getTouchOs } from '../../utils'
import logo from '../../resource/img/logo.png'

class ConfirmTip extends Component {
	constructor() {
		super();
	}
	componentWillMount() {

	}
	serveOther(){
	}
	componentDidMount() {
		var self = this;
	}
	render() {
		var self = this;
		return (
            <div>
            	<section id="confirmtip-wrap" className="confirmtip-wrap">
				    <div className="confirmtip-back"></div>
				    <div className="confirmtip-inner">
						<div className="confirmtip-content">{self.props.info}</div>
						<div className="confirmtip-select clearfix">
						    <div className="confirmtip-cancel" onClick={()=>self.props.callbackFn(false)}>取消</div>
						    <div className="confirmtip-confirm" onClick={()=>self.props.callbackFn(true)}>確認</div>
						</div>
				    </div>
				</section> 
            </div>
		);
	}
}

function mapStateToProps(state) {
	return {
		cp_header_nav: state.component.get('cp_header_nav')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmTip)