import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getTouchOs } from '../../utils'
import '../../resource/css/component/footNav.less'
class FootNav extends Component {
	render() {
		let self = this,
			browserSystem = getTouchOs(),
			data = self.props.data;
		return (
			<div>
				<nav className="footNav" >
					<Link to="/" className="nav_page nav_home" >首页 > </Link>
					{ data ? data.map((v, i) => {
						return <Link key={i} to={v.url} className="nav_page" >{ v.name } > </Link>
					}) : null }
				</nav>
				<section className="foot-wrap">

					<div className="foot-list clearfix">
						<a href={Api.host + "?f=mobile"} className="foot-item">
							<div className="foot-name">電腦版</div>
						</a>
						<a href={browserSystem == 'ios' ? 'https://itunes.apple.com/app/id958450485' : 'market://details?id=com.addcn.newcar8891'} className="foot-item" target="_blank">
							<div className="foot-name">APP下載</div>
						</a>
						<a href={Api.index + "at/info/fb"} className="foot-item">
							<div className="foot-name">提建議</div>
						</a>
					</div>

					<div className="foot-info">
						<p>Copyright © 2009-2017 by Addcn Technology Co., Ltd.</p>
						<p>All Rights reserved.</p>
						<p>客服電話：02-5572-2088</p>
					</div>
					
				</section>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootNav)