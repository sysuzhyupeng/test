import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { cpShareStatus } from '../../action/component'

let shareType = ['Facebook','Line'];

class Share extends Component {
	shareFn(v) { //點擊分享
		var self = this,
			name = v,
			 url = location.href;

		if (self.props.shareUrl) { //分享文章詳情頁
			url = self.props.shareUrl;
		}
		switch(name){
            case 'Facebook':
                window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(url),'_blank');
            break;
            case 'Line':
                window.open("http://line.me/R/msg/text/?" + encodeURIComponent(url),'_blank');
            break;
            default:
                return false;
            break;
        }
	}
	shareDel() {
		this.props.actions.cpShareStatus(false);
	}
	render() {
		var self = this;
		return <div>
			{ self.props.cp_share_status ?
				<section ref="share-wrap" className="share-wrap">
					<div className="share-main">
						<header className="header">分享到</header>
						<ul className="share-ul clearfix">
							{shareType.map(function(v, i){
								return <li key={i} className="share-kind">
									<a href="javascript:;" name={v} className={"share-icon share-" + v} onClick={() => self.shareFn(v)}></a>
								</li>
							})}
						</ul>
						<a href="javascript:;" ref="share-delete" className="share-delete" onClick={() => self.shareDel()}>取消分享</a>
					</div>
				</section>
				: null
			}
		</div>
	}
}

function mapStateToProps(state) {
	return {
		cp_share_status: state.component.get('cp_share_status')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpShareStatus
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Share)