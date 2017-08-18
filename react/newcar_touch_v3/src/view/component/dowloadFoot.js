/*
* 熱門廠牌
*/

import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getTouchOs } from '../../utils'
import "../../resource/css/dowloadFoot.less"

class DowloadFoot extends Component {
	constructor() {
		super()
		this.state = {
			showAppDownload: true
		};
	}
	fnAppSection() {
		let self = this;
		self.setState({
			showAppDownload: false
		});
	}
	componentDidMount() {
		setTimeout(function(){
			if(document.getElementById('app_section_footer')) {
				
			    document.getElementById('app_section_footer').style.display="block";
			}
		},7000)
	}
	//点击下载
	fnDownloadApp() {
		ReactGA.ga('send', 'event', '觸屏版首頁', '底部下载APP', '立即查看');
	}
	render() {
		let self = this,
			browserSystem = getTouchOs();
		return (
		<div>
		{ self.state.showAppDownload?
			<div id="app_section_footer" className='download-app-section-footer download-none'>
				<div className="app-icon"></div>
				<div className="message-section">
					<div className="app-name">8891新車</div>
					<div className="app-desc">新車資訊應有盡有</div>
				</div>
				<a href={browserSystem == 'ios' ? 'https://itunes.apple.com/app/id958450485' : 'market://details?id=com.addcn.newcar8891'}>
					<div className="open-app" onClick={ ()=>self.fnDownloadApp() }>立即查看</div>
				</a>
				<div className="close-icon" onClick={ () => self.fnAppSection() } ></div>
			</div>
		:null
		}
		</div>
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
			
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DowloadFoot)