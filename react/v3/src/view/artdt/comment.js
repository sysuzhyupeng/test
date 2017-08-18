import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import CommentItem from './commentItem'
import extend from 'extend'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import Ajax from '../../utils/ajax'
import { hasLogin } from '../../utils/auth'

class comment extends Component {
	constructor() {
		super()
		this.state = {
			commentData: '',
			comment_num: '',
			id: '',
			type: '',
			reAttr: {},
			respond: false
		};
		this.sendStatus = true; //發送狀態
	}
	componentWillMount() {
		var self = this;

		self.setState({
			type: self.props.params.type,
			id: self.props.params.id
		});
	}
	componentDidMount() {
		this.getCommentData();
	}
	getCommentData(type, id) { //請求評論數據
		var self = this,
			params = {
				type: type || self.state.type,
				id: id || self.state.id
			};

		if (self.props.limit) {
			params = extend(true, params, {limit: self.props.limit});
		}

		Ajax.get(Api.base + '/mobile/article/getComment', params)
		.then(function(res) {
			self.setState({
				commentData: res.data
			});
			if (res.comment_num) {
				self.setState({
					comment_num: res.comment_num
				});
			}
		});
	}
	changeRespondTrue() { //回應
		var 	self = this,
			textarea = self.refs['textarea'];

		textarea.focus();
		self.setState({
			respond: true
		});
	}
	changeRespondFalse() { //取消回應
		var 	self = this,
			textarea = self.refs['textarea'];

		textarea.setAttribute('placeholder', '在這裡說點什麼吧');
		textarea.blur();
		self.setState({
			respond: false
		});
	}
	textShow(re_id, re_mid, m_name) { //聚焦輸入框
		var 	self = this,
			textarea = self.refs['textarea'],
			replyName = self.refs['reply-name'];

		if (self.state.respond) { //回應
			if (re_id) {
				var name = "@" + m_name + "：";
				replyName.innerHTML = m_name;
				textarea.setAttribute('placeholder', name);
				textarea.value = '';
				textarea.focus();
				self.setState({
					reAttr: {
						re_id: re_id,
						re_mid: re_mid,
						m_name: m_name
					}
				});
			}
		}else { //評論
			hasLogin(function(){
				if (textarea.getAttribute('placeholder').indexOf('@') != -1) {
					textarea.setAttribute('placeholder', '在這裡說點什麼吧');
					textarea.value = '';
				}
			});
			self.setState({
				reAttr: {}
			});
		}
	}
	keyup() { //限制150個字
		var 	self = this,
			textarea = self.refs['textarea'],
				send = self.refs['send'];

		if (textarea.value.length >= 150) {
			textarea.value = textarea.value.substring(0, 150);
		}
	}
	send(type, id) { //發送
		var self = this;

		if (self.sendStatus) {
			self.sendStatus = false;
			var textarea = self.refs['textarea'],
					send = self.refs['send'],
				   token = localStorage.getItem('accesstoken'),
				   re_id = self.state.reAttr.re_id || null,
				  re_mid = self.state.reAttr.re_mid || null;

			Ajax.get(Api.base + '/mobile/article/addComment/', {
				token: token,
				id: id,
				type: type,
				re_id: re_id,
				re_mid: re_mid,
				content: textarea.value
			})
			.then(function(res) {
				if (res.status == 'ok') {
					self.getCommentData(type, id);
					textarea.value = '';
				}else if (res.error) {
					Toast.fail(res.error.message, 3);
				}
				self.sendStatus = true;
			})
			.catch(function(rej) {
				Toast.fail('發送失敗，請檢查網路狀態，再重試！', 3);
				self.sendStatus = true;
			})
		}
	}
	render() {
		var self = this,
			data = self.state.commentData,
			comment_num = self.state.comment_num,
			onlyId = 't'+ self.state.type +'id'+ self.state.id;

		return <section>

			<TopicTitle title="發佈留言" />
			<div className="reply">
				<textarea ref="textarea" id={onlyId} onClick={() => self.textShow()} onKeyUp={() => self.keyup()} className="reply-textarea" placeholder="在這裡說點什麼吧"></textarea>
				<div className="reply-bar clearfix">
					{self.state.respond ? <span className="fl">
						<span ref="reply-name" className="reply-name"></span>
						<span className="reply-cancel" onClick={() => self.changeRespondFalse()}>取消回應</span>
					</span> : null }
					<span ref="send" onClick={() => self.send(self.state.type, self.state.id)} className="reply-send fr">發送</span>
				</div>
			</div>
			{self.state.commentData.length != 0 ?
			<div className="reply-common-title">
				<span className="new-common-title-name">最新評論</span>
			</div>
			:null}
			<div>
				{self.state.commentData.length != 0 ? self.state.commentData.map(function(v, i){
					return <CommentItem key={"discuss" + i} commentItemData={v} textShow={(re_id, re_mid, m_name) => self.textShow(re_id, re_mid, m_name)} getCommentData={() => self.getCommentData()} changeRespondTrue={() => self.changeRespondTrue()} />
				}):null}
			</div>

			{self.props.more && comment_num > 6 ? <div className="clearfix">
				<Link to={"/show/articleComment/" + self.state.type + "/" + self.state.id} className="write-number">
					<i></i>
					<span>查看更多留言</span>
				</Link>
			</div> : null}


		</section>
	}
}

/*
* 本頁面公用標題
*/
class TopicTitle extends Component {
	render() {
		return <div className="reply-common-title">
			<i className="reply-common-title-btn"></i>
			<span className="reply-common-title-name">{this.props.title}</span>
		</div>
	}
}

export default connect()(comment)