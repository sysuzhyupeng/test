import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Toast from 'antd-mobile/lib/toast'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import LazyLoadImg from 'react-lazyload-img'
import noPic from '../../resource/img/nopic-86-57.png'
import "../../resource/css/kind.less"

class kindsum extends Component {
	constructor() {
		super()
		this.state = {
			data: [],
			fixed: false
		};
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentWillMount() {
		let self = this;

		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
		this.getInfo(self.props.params);
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
    componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		Toast.hide();
    }
	getInfo(params) { //請求數據
		let self = this;

		Ajax.get(Api.base + '/kinds/', params).then(function(res) {
			self.setState({
				data: res
			});
			Toast.hide();
		});
	}
	handleScroll() { //滾動事件
		let self = this,
			afterScrollTop = document.body.scrollTop,
			hd = self.refs['kid-hd'];

		if (hd) {
			let hdHeight = hd.offsetHeight,
				hdTop = hd.offsetTop;
			//滾動定位導航
			if (afterScrollTop > hdHeight + hdTop) {
				self.setState({
					fixed: true
				})
			}else {
				self.setState({
					fixed: false
				})
			}
		}
	}
	render() {
		let self = this,
			data = self.state.data;
		return (
			<div>


				<Header
					nav={true}
					module="找車"
					titleRight={
						<a href={Api.host + '/m/search/autos'} className="hd-search">
							<i></i>
						</a>
					}
					hdClass="hd-inner hd-inner-blue"
					backClass="hd-back hd-back-in"
					iconClass="hd-icon white"
				/>


				{ data != '' ? <div>

					<div ref="kid-hd" className={"kid-hd clearfix " + (self.state.fixed ? "kid-hd-fixed" : "")}>
						<img src={ data.icon } alt="" className="kid-hd-logo" />
						<span className="kid-hd-name">{ data.brand_name }</span>
						<span className="kid-hd-all">(共{ data.kind_num }個車款)</span>
					</div>

					{ data.data.map((l, t) => (
						<div key={"list" + t} className="kid-list">
							<div className="kid-list-title">
								<span>{l.name}</span>
								<span className="kid-list-all">{"(共" + l.count + "個車款)"}</span>
							</div>
							<div className="kid-list-main">
								{ l.list.map((v, i) => (
									<Link key={"item" + i} to={"/kindsum/" + v.kind_id} className="kid-item">
										<LazyLoadImg className="kid-item-img" src={v.thumb} placeholder={noPic} />
										<div className="kid-item-main">
											<div className="kid-item-name">{v.kind_name}</div>
											<div className="kid-item-price">{v.price}</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					))}

				</div> : null }


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

export default connect(mapStateToProps, mapDispatchToProps)(kindsum)