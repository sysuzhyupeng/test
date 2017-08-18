/*
* 頂部導航
*/

import React, { Component } from 'react'
import render from 'react-dom'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hasLogin } from '../../utils/auth'
import { getTouchOs } from '../../utils'
import { cpHeaderLogin } from '../../action/component'
import logo from '../../resource/img/logo.png'

class NavTop extends Component {
	constructor() {
		super()
		this.state = {
			downUrl: '',
			horizontal: false
		};
	}
	componentWillMount() {
		var self = this,
			isAndroid = getTouchOs() == 'android' ? true : false,
            downUrl = isAndroid ? 'market://details?id=com.addcn.newcar8891' : 'https://itunes.apple.com/app/id958450485';
        
        self.setState({
        	downUrl: downUrl
        });

        //橫屏隱藏
        window.addEventListener('orientationchange', function() {
        	var or = window.orientation;

        	if (or == 0) { //豎屏
        		self.setState({
        			horizontal: false
        		});
        	}else { //橫屏
        		self.setState({
        			horizontal: true
        		});
        	}
        });
	}
	componentDidMount() {
		var self = this;

		hasLogin(function() { //是否登錄
			self.props.actions.cpHeaderLogin(true);
		}, function() {
			self.props.actions.cpHeaderLogin(false);
		})
	}
	launchByIframe() {
		var self = this,
			schemaUrl = 'tcnewcar://newcar/',
			tcevent = document.createElement('iframe');

		tcevent.style.display = 'none';
		tcevent.setAttribute('src', schemaUrl);
		document.body.appendChild(tcevent);
        setTimeout(function() {
        	if(tcevent) {
	            document.body.removeChild(tcevent);
        	}
        }, 200);
	}
	render() {
		var self = this;

		return (
            <div>
            	{self.props.cp_header_nav ? <section id="navtop-wrap" className="navtop-wrap">
				    <div className="navtop-back"></div>
				    <div className="navtop-inner">

				        { !self.props.cp_header_login ? <div className="navtop-login clearfix">
				            <a href="javascript:;" className="navtop-login-label"></a>
				            <a href={Api.host + "/m/at/user/login"} className="navtop-login-btn">
				                <i></i>
				                <span>登入/註冊</span>
				            </a>
				        </div> : null }

				        <ul id="navtop-list" className="navtop-list clearfix">
				            <li className="navtop-link">
				                <i className="navtop-link-icon"></i>
				                <Link to="/" className="navtop-link-name">首頁</Link>
				            </li>
				            <li className="navtop-link">
				                <i className="navtop-link-icon"></i>
				                <Link to="/brand" className="navtop-link-name">找車</Link>
				            </li>
				            <li className="navtop-link">
				                <i className="navtop-link-icon"></i>
				                <Link to="/article/newest" className="navtop-link-name">文章</Link>
				            </li>
				            <li className="navtop-link">
				                <i className="navtop-link-icon"></i>
				                <Link to="/topic" className="navtop-link-name">深度解析</Link>
				            </li>
				            <li className="navtop-link">
				                <i className="navtop-link-icon"></i>
				                <Link to="/compare" className="navtop-link-name">比較</Link>
				            </li>
				            <li className="navtop-link">
				                <i className="navtop-link-icon"></i>
				                <a href={Api.host + "/m/comment"} className="navtop-link-name">評價</a>
				            </li>
				            <li className="navtop-link">
				                <i className="navtop-link-icon"></i>
				                <a href={Api.host + "/m/search/movie"} className="navtop-link-name">影片</a>
				            </li>
				            <li className="navtop-link">
				                <i className="navtop-link-icon"></i>
				                <a href={Api.host + "/m/at/member/index"} className="navtop-link-name">會員中心</a>
				            </li>
				        </ul>
				        <div className="navtop-dl clearfix">
				            <img src={logo} className="navtop-dl-pic" />
				            <div className="navtop-dl-con">
				                <h3>8891新車App</h3>
				                <p>專業的試車文章、豐富的車款資訊</p>
				            </div>
				            <a onClick={() => self.launchByIframe()} href={self.state.downUrl} target="_blank"  className="navtop-dl-btn" title="立即打開">立即打開</a>
				        </div>

				    </div>
				</section> : null}
            </div>
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
			cpHeaderLogin
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NavTop)