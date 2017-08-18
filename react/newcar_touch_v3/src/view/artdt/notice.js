import React, { Component } from 'react'
import render from 'react-dom'
import { connect } from 'react-redux'
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'

class ArtdtKind extends Component {
	constructor() {
		super()
		this.state = {
			noticeStatus: false
		};
		this.sendStatus = true;
	}
	notice() { //上線通知
		this.setState({
			noticeStatus: true
		});
	}
	noticeCancel() { //取消上線通知
		this.setState({
			noticeStatus: false
		});
	}
	noticeSend(tid) {
		var self = this,
			text = self.refs['artdt-form-text'],
		   email = text.value;

		if(self.sendStatus) {
			self.sendStatus = false;
			Ajax.post(Api.base + '/mobile/topic/subscribe/', {
				tid: tid,
				email: email
			}).then(function(res) {
				if(res.status == '200') {
					alert('訂閱成功');
					self.noticeCancel();
				}else if(res.error) {
					Toast.fail(res.error.message, 3);
				};
				self.sendStatus = true;
			}).catch(function(rej) {
				Toast.fail('提交失敗，請檢查網路狀態，再重試！', 3);
				self.sendStatus = true;
			})
		};
	}
	render() {
		let self = this,
			data = this.props.data;

		return (
			<section className="artdt-foreshow">
				<div className="artdt-foreshow-title clearfix">
					<span className="fl">下一期深度解析預告</span>
					<a href={Api.host + '/m/topic'} className="artdt-foreshow-more">查看歷史專題>></a>
				</div>
				<div className="artdt-foreshow-main clearfix">
					<i className="artdt-foreshow-icon"></i>
					<span className="artdt-foreshow-con">{data.brandName + ' ' + data.kindName} 敬請期待</span>
					<span onClick={() => self.notice()} className="artdt-foreshow-notice">
						<span>上線通知我</span>
						<span className="artdt-foreshow-btn">></span>
					</span>
				</div>
				{self.state.noticeStatus ? <div className="artdt-form-main clearfix">
					<label className="artdt-form-label">
						<i className="artdt-form-icon">* </i>請輸入郵箱：
					</label>
					<input ref="artdt-form-text" className="artdt-form-text" type="text" />
					<ul className="artdt-form-btn">
						<li onClick={() => self.noticeSend(data.id)} className="artdt-form-send">提交</li>
						<li onClick={() => self.noticeCancel()} className="artdt-form-cancel">取消</li>
					</ul>
				</div> : null}
			</section>
		);
	}
}

export default connect()(ArtdtKind)