import React, { Component } from 'react'
import render from 'react-dom'
import { connect } from 'react-redux'
import { hasLogin } from '../../utils/auth'
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'

class commentItem extends Component {
	constructor() {
		super()
		this.likeStatus = true; //防止連續多次點擊
	}
	like(id) { //點讚
		var self = this;

		if (self.likeStatus) {
			self.likeStatus = false;
			hasLogin(function() {
				self.getLike(id);
			});
		}
	}
	getLike(id) {
		var self = this,
			token = localStorage.getItem('accesstoken');

		Ajax.get(Api.base + '/mobile/article/like', {
			token: token,
			id: id
		})
		.then(function(res) {
			if (res.status == 'ok') {
				self.props.getCommentData();
			}else if (res.error) {
				Toast.info(res.error.message, 3);
			}
			self.likeStatus = true;
		})
		.catch(function(rej) {
			Toast.fail('發送失敗，請檢查網路狀態，再重試！', 3);
			self.likeStatus = true;
		});

	}
	respond(re_id, re_mid, m_name) { //點擊回應
		var self = this;

		hasLogin(function() {
			self.props.changeRespondTrue();
			self.props.textShow(re_id, re_mid, m_name);
		});
	}
	render() {
		var self = this,
			data = self.props.commentItemData;

		return <section className="cm-wrap">
			<div className="cm-inner">
				<dl className="cm-header">
					<dt>
						<img src={data.member.m_headpic_new}  />
					</dt>
					<dd>
					 	<h2>
						 	<span className="m-name">{data.member.m_name}  <b>{ data.member.cert_kind}</b></span>
					 	</h2>
					</dd>
				</dl>
				<div>
					<div className="cm-content">
						<p>{data.content}</p>
					</div>
				</div>
				<div className="cm-respond-main">
					{data.reply ? <div className="cm-respond">
						<div className="cm-respond-header">
							<span>原評論 : {data.reply.m_name}</span>
						</div>
						<div className="cm-respond-content">{data.reply.content}</div>
					</div> : null }
					<div className="cm-comment">
						<span>{data.add_time}</span>
						<span onClick={() => self.respond(data.id, data.member.m_id, data.member.m_name)} className="cm-comment-respond"><i className="cm-zan-comment-icon"></i>回復</span>
						<span onClick={() => self.like(data.id)} className="cm-zan">
							<i className="cm-zan-icon"></i>
							<span className="cm-zan-number">{data.like_num}</span>
						</span>
					</div>
				</div>
			</div>
		</section>
	}
}

export default connect()(commentItem)