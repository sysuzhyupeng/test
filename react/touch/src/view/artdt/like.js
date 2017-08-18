import React, { Component } from 'react'
import render from 'react-dom'
import { connect } from 'react-redux'
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'
import "../../resource/css/artdt.less"

class ArtdtLike extends Component {
	constructor() {
		super()
		this.state = {
			like_count:'',
			unlike_count:''
		};
	}
	fnLike(id,or,count,type) {
		let url    = '/like',
			model = 'article',
			UUID = localStorage.getItem('UUID'),
			like_count = Number(count) + 1;
			if(type == 2) {
				model = 'trialart';
			}
		let	params = {
				'model': model,
				'action': or,
				'id':id,
				'drivice_id':UUID
			};
		Ajax.get(Api.base + url, params)
		.then(function(res) {
			if(res.status == 200) {
				document.getElementById(or+id).innerHTML = like_count
				// Toast.success('点赞成功', 1);
			} else {
				Toast.info(res.error.message, 1);
			}
		});



	}
	render() {
		let self = this,
			data = self.props.data,
			type = self.props.type;
			self.state.like_count = data.likes;
			self.state.unlike_count = data.unlike;
		return (
			<section className="like-section">
				<div className="like">
					<div className="like-center-icon">
						<i className="like-icon"  onClick={() => self.fnLike(data.id,'like',data.likes,type)}></i>
					</div>
					<span>支持 <b className="like-count" id={"like"+data.id}>{ self.state.like_count }</b></span>
				</div>
				<div className="unlike">
					<div className="unlike-center-icon">
						<i className="unlike-icon" onClick={() => self.fnLike(data.id,'unlike',data.unlike,type)}></i>
					</div>
					<span>不支持 <b className="unlike-count" id={"unlike"+data.id}>{ self.state.unlike_count }</b></span>
				</div>
			</section>
		);
	}
}

export default connect()(ArtdtLike)