/*
* 頁面延迟加载
*/

import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import Button from 'antd-mobile/lib/button'
import { cpBrandOpen } from '../../action/component'

class Brand extends Component {
	constructor() {
		super();
		this.handleScroll = this.handleScroll.bind(this);
		this.first = true; //防止重複執行回調
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
		this.handleScroll(); //一進入頁面就先觸發一次
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}
	handleScroll() {
		var self = this,
			lazy = self.refs['lazy'],
			bodyScroll = document.body.scrollTop + window.screen.height,
			lazyTop = lazy.offsetTop;

		if (bodyScroll >= lazyTop && self.first) { //滾到底部請求回調
			self.first = false;
			self.props.lazyCallBack();
		}
	}
	render() {
		return <section ref="lazy">{this.props.children}</section>
	}
}

export default connect()(Brand)