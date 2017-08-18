import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'
import Header from '../component/header'
import { SmTitle, Content } from './ratingCommon'

class ratingDetailsSingle extends Component {
	constructor() {
		super()
		this.state = {
			data: ''
		};
	}
	componentWillMount() {
		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
	}
	componentDidMount() {
		let self = this;

		self.getInfo(self.props.params);
	}
	getInfo(params) { //請求數據
		let self = this;

		Ajax.get(Api.base + '/compare/evalSingle', {
			kids: params.kids,
			cid: params.cid
		}).then(function(res) {
			self.setState({
				data: res
			});
			Toast.hide();
		});
	}
	componentWillUnmount() {
		Toast.hide();
	}
	render() {
		let self = this,
			data = self.state.data;

		if (data) {
			return (
				<div>

					<Header titleName="編輯測評比較" hdClass="hd-inner" />

					{ data.models ? <ul className="vsrt-hd clearfix">
						{ data.models.map((md, a) => {
							return <li key={'models' + a} className="vsrt-hd-li">
								<img src={md.thumb} />
								<p>{md.full_name}</p>
							</li>
						})}
						<span className="vsrt-hd-pk">PK</span>
					</ul> : null }

					{ data.scores ? <section>
						{ data.scores.map((sm, s) => {
							return <div key={'scores' + s}>
								{ s == 0 ? <div className="vsrt-total">{sm.name}</div> : <SmTitle title={sm.name} /> }
								<Content data={sm.data} />
							</div>
						})}
					</section> : null }

				</div>
			)
		}else {
			return null;
		}
	}
}

export default connect()(ratingDetailsSingle)