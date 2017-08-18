import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'
import Header from '../component/header'
import { BigTitle, SmTitle, Content } from './ratingCommon'
import "../../resource/css/vs.less"

class ratingDetails extends Component {
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

		document.domain = '8891.com.tw';
		self.getInfo(self.props.params);
	}
	componentDidUpdate(prevProps, prevState) {
		window.scroll(0, 0); //防止IOS上返回到該頁面頂部出現空白
	}
	getInfo(params) { //請求數據
		let self = this;

		Ajax.get(Api.base + '/evalCompare?kids=' + params.kids).then(function(res) {
			self.setState({
				data: res
			});
			Toast.hide();
		});
	}
	componentWillUnmount() {
		Toast.hide();
	}
	iframeOnload() { //iframe加載后重置雷達圖大小
		let self = this,
			iframe = self.refs['vsrt-main-iframe'],
			wrap = self.refs['vsrt-iframe-wrap'],
			ifWidth = iframe.offsetWidth,
			ifHeight = iframe.contentWindow.document.body.offsetHeight,
			conWidth = document.getElementById('container').offsetWidth,
			count = conWidth/ifWidth;

		iframe.height = ifHeight;
		wrap.style.height = ifHeight * count + 'px';
		iframe.style.transform = 'scale(' + count + ')';
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

					{ data.radar || data.summary ? <BigTitle title="誰更值" /> : null }

					{ data.radar ? <section>
						<SmTitle title={data.radar.name} />
						<div className="vsrt-main">
							<div ref="vsrt-iframe-wrap" className="vsrt-iframe-wrap">
								<iframe ref="vsrt-main-iframe" src={data.radar.link} className="vsrt-main-iframe" onLoad={() => self.iframeOnload()}></iframe>
							</div>
						</div>
					</section> : null }

					{ data.summary ? <section>
						{ data.summary.map((sm, s) => {
							return <div key={'summary' + s}>
								<SmTitle title={sm.name} />
								{ sm.type == 'oil' ? <ul className="vsrt-oil clearfix">
									{ sm.data.map((d, t) => {
										return <li key={'oil' + t}>
											<i></i>
										</li>
									})}
								</ul> : null }
								<Content data={sm.data} />
							</div>
						})}
					</section> : null }

					{ data.scores ? <section>
						<BigTitle title="分項比較" />
						{ data.scores.map((sm, s) => {
							return <div key={'scores' + s}>
								<SmTitle title={sm.name} link={'/vs/rating/' + self.props.params.kids + '/' + sm.id} />
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

export default connect()(ratingDetails)