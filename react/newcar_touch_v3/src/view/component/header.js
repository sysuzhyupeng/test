/*
* 頭部
*/

import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import NavTop from './navtop'
import { cpHeaderNav } from '../../action/component'
import { browserHistory } from 'react-router'
class Header extends Component {
	defaultBackClick(home) {
		console.log( home )
		if(home) {
			// location.href = '/'
			browserHistory.push('/')
		} else {
			history.back();
		}
	}
	navClick() { //顯示/隱藏導航
		var self = this,
			status = self.props.cp_header_nav;

		self.props.actions.cpHeaderNav(!status);
	}
	componentDidUpdate(prevProps, prevState) {
		var self = this,
			status = self.props.cp_header_nav,
			hd = self.refs['hd-wrap'];

		if (status) {
			var hei = document.body.offsetHeight - hd.offsetHeight;
			document.querySelector('.navtop-back').style.height = hei + 'px';
		}
	}
	componentWillMount() {
		this.props.actions.cpHeaderNav(false);
	}
	render() {
		var 	   self = this,
				hdClass = self.props.hdClass ? self.props.hdClass : "hd-inner",
			  iconClass = self.props.iconClass ? self.props.iconClass : "hd-icon",
			  backClass = self.props.backClass ? self.props.backClass : "hd-back";
		var    backName = self.props.backName ? self.props.backName : "",
			  titleName = self.props.titleName,
			  backClick = self.props.backClick ? self.props.backClick : self.defaultBackClick;

		var atClass = self.props.cp_header_login ? ' at' : ' at-login';
		return (
			<section ref="hd-wrap" className="hd-wrap">
				<div id="hd-inner" className={hdClass}>
				    {
				    	!self.props.reWriteBack ?
				    	<a href="javascript:;" onClick={() => backClick(self.props.home)} className={backClass}>{backName}</a>
				    	:
				    	<a href="javascript:;" onClick={self.props.reWriteBack} className={backClass}>{backName}</a>
				    }
					{
						self.props.module ?
						<div className="hd-main-left">
							<span>{'8891新車 • ' + self.props.module}</span>
							{ self.props.titleRight ?
								self.props.titleRight : null
							}
						</div>
						:
						<div className="hd-main">{titleName}{self.props.titleRight ?
								self.props.titleRight : null
							}</div>
					}
					{
						self.props.nav ?
						<div className="hd-right">
							<span className="hd-nav" onClick={() => self.navClick()}>
								導航
								<i className={iconClass + (self.props.cp_header_nav ? atClass : "")}></i>
							</span>
						</div>
						: null
					}
					{ self.props.rightContent ? self.props.rightContent : null }
				</div>
				{ self.props.nav ? <NavTop /> : null }
			</section>
		);
	}
}

function mapStateToProps(state) {
	return {
		cp_header_nav: state.component.get('cp_header_nav'),
		cp_header_login: state.component.get('cp_header_login')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpHeaderNav
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)