import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import { vsGetData } from '../../action/compare'
import { cpBrandOpen, cpKindOpen, cpModelOpen } from '../../action/component'
import Brand from '../component/brand'
import Kind from '../component/kind'
import Model from '../component/model'
import Toast from 'antd-mobile/lib/toast'
import "../../resource/css/vs.less"

class specDetails extends Component {
	constructor() {
		super()
		this.state = {
			state: [],
			similar: true,
			kids: [],
			hdFixed: false,
			entryStatus: false
		};
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentWillMount() {
		//初始化請求數據
		//初始化獲取kids
		this.getInfo(this.props.params.kids);
		this.setState({
			kids: this.props.params.kids.split(',')
		})
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		Toast.hide();
	}
	getInfo(kids) { //請求數據
		let self = this;

		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
		Ajax.get(Api.base + '/compare?myid=' + kids).then(function(res) {
			self.setState({
				data: res
			});
			Toast.hide();
		});
	}
	changeSimilar() { //隱藏/顯示相同項
		let self = this;

		self.setState({
			similar: !self.state.similar
		})
	}
	delete(n) { //點擊刪除列
		let self = this,
			kids = self.state.kids;

		kids.splice(n, 1);
		self.getInfo(kids.join(','));
		self.setState({
			kids: kids
		});
	}
	mainScroll() { //內容右滾動
		let  self = this,
			 main = self.refs['vssd-main'],
			hdBox = self.refs['vssd-hd-box'];

		hdBox.scrollLeft = main.scrollLeft;
		setTimeout(function() {
			hdBox.scrollLeft = main.scrollLeft;
		}, 500);
	}
	hdScroll() { //頭部右滾動
		let  self = this,
			 main = self.refs['vssd-main'],
			hdBox = self.refs['vssd-hd-box'];

		main.scrollLeft = hdBox.scrollLeft;
		setTimeout(function() {
			main.scrollLeft = hdBox.scrollLeft;
		}, 500);
	}
	handleScroll() { //上下滾動定位PK
		let 	 self = this,
			scrollTop = document.body.scrollTop,
				   hd = self.refs['vssd-hd'],
				 main = self.refs['vssd-main'],
				 back = self.refs['vssd-hd-back'],
				hdTop = hd.offsetTop,
			backHeight = back.offsetHeight;

		if (scrollTop > hdTop) {
			main.style.marginTop = backHeight + 'px';
			self.setState({
				hdFixed: true
			});
		}else {
			main.style.marginTop = 0;
			self.setState({
				hdFixed: false
			});
		}
	}
	entry() { //快捷入口
		this.setState({
			entryStatus: !this.state.entryStatus
		})
	}
	anchor(num) { //點擊錨點
		var 	  self = this,
				    hd = self.refs['vssd-hd'],
			  hdHeight = hd.offsetHeight,
				 title = self.refs['vssd-item-title' + num];

		document.body.scrollTop = title.offsetTop - hdHeight;
	}
	add() { //點擊添加車型
		let self = this;

		self.props.actions.cpBrandOpen(true)
	}
	brandCallBack(brandData) { //點擊廠牌選擇車款
		let self = this;

		self.props.actions.cpKindOpen(true);
		self.setState({
			brand_id: brandData.id
		})
	}
	kindCallBack(kindData) { //點擊車款選擇車型
		let self = this;

		self.props.actions.cpModelOpen(true);
		self.setState({
			kind_id: kindData.kind_id
		})
	}
	modelCallBack(modelData) { //點擊車型
		var self = this,
			kids = self.state.kids;

		//已选择的车型提示重复选择
		for (var i = 0; i < kids.length; i++) {
			if (kids[i] == modelData.myid) {
				Toast.fail('該車型已在比較中！', 1);
				return false;
			}
		};
		//將選擇的車型加入比較
		kids.push(modelData.myid);
		self.getInfo(kids.join(','));
		self.setState({
			kids: kids
		});
		self.props.actions.cpBrandOpen(false);
		self.props.actions.cpKindOpen(false);
		self.props.actions.cpModelOpen(false);
	}
	render() {
		let self = this,
			data = self.state.data,
			{ cp_brand_open, cp_kind_open, cp_model_open } = self.props;

		if (data) {
			return (
				<div>

					<section className={cp_brand_open ? "hide" : ""}>

						<Header titleName="規格配備比較" hdClass="hd-inner" rightContent={<span className="vs-edit" onClick={() => self.changeSimilar()}>{self.state.similar ? '隱藏相同項' : '顯示相同項'}</span>} />


						<div className="vssd-wrap">

							<div ref="vssd-hd" className={"vssd-hd " + (self.state.hdFixed ? "fx" : "pr")}>
								<div className="vssd-hd-pk">PK</div>
								<div ref="vssd-hd-box" className="vssd-hd-box" onScroll={() => self.hdScroll()}>
									<table className="vssd-hd-table">
										<tbody>
											<tr>
												{ data.model ? data.model.map((ml, n) => {
													return <td key={'model' + n}>
														<div className="vssd-hd-inner">
															<img src={ml.thumb} />
															<p>{ml.modelName}</p>
															<i onClick={() => self.delete(n)}>×</i>
														</div>
													</td> })
												: null }
												<td>
													{ self.state.hdFixed ? <div className={"vssd-hd-add " + (data.model.length < 6 ? "" : "hide")} onClick={() => self.add()}>添加車型</div>
													: <div className={"vssd-hd-add " + (data.model.length < 6 ? "" : "hide")} onClick={() => self.add()}>
														<p className="vssd-hd-add-icon">+</p>
														<p className="vssd-hd-add-name">添加車型</p>
													</div> }
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<div ref="vssd-hd-back" className="vssd-hd-back"></div>

							<div ref="vssd-main" className="vssd-main" onScroll={() => self.mainScroll()}>
								{ data.label ? data.label.map((d, i) => {
									return <div key={'label' + i} className="vssd-item">
										<h2 ref={"vssd-item-title" + i} className={"vssd-item-title " + (self.state.hdFixed ? "" : "")}>
											<span className="vssd-item-title-name">{d}</span>
											<span className="vssd-item-title-info">●標配 ○選配 -無</span>
										</h2>
										<table className="vssd-item-table vssd-item-left">
											<tbody>
												{ data.labelIndex ? data.labelIndex[i].map((lIdx, k) => {
												return <tr key={'labelIndex' + k} className={!self.state.similar && data.similar[lIdx] ? "hide" : ""}>
													<td>{data.labelItem[lIdx]}</td>
												</tr>
												}) : null }
											</tbody>
										</table>
										<table className="vssd-item-table vssd-item-right">
											<tbody>
												{ data.labelIndex ? data.labelIndex[i].map((lIdx, k) => {
												return <tr key={'lvtr' + k} className={!self.state.similar && data.similar[lIdx] ? "hide" : ""}>
													{ data.labelValue[lIdx].map((lVal, t) => {
														return <td key={'lvtd' + t} className={data.advan[lIdx] && data.advan[lIdx][0] == lVal ? "light" : ""}>
															<div className="vssd-item-right-inner">{lVal}</div>
														</td>
													}) }
													<td className={data.labelValue[lIdx].length < 6 ? "" : "hide"}>
														<div className="vssd-item-right-inner"></div>
													</td>
												</tr>
												}) : null }
											</tbody>
										</table>
									</div>
								}) : null }
							</div>

						</div>

						{ data.label ? <div className="vssd-entry">
							<div className={"vssd-entry-box " + (self.state.entryStatus ? "" : "hide")}>
								<ul className="vssd-entry-list clearfix">
									{ data.label.map((d, i) => {
										return <li key={"entry" + i} className="vssd-entry-item" onClick={() => self.anchor(i)}>{d}</li>
									})}
								</ul>
								<div className="vssd-entry-triangle clearfix">
									<span></span>
								</div>
							</div>
							<div className="vssd-entry-btn" onClick={() => self.entry()}>
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div> : null }

					</section>

					{
						cp_brand_open ? 
						<section className={cp_model_open ? "hide" : ""}>
							<Brand api={Api.base + '/brand/select?type=base'} brandCallBack={(brandData) => self.brandCallBack(brandData)} />
						</section>
						:
						null
					}

					{
						cp_kind_open ? 
						<section className={cp_model_open ? "hide" : ""}>
							<Kind api={Api.base + '/kind/select?type=base'} params={{b: self.state.brand_id, limit: 10}} kindCallBack={(kindData) => self.kindCallBack(kindData)} />
						</section>
						:
						null
					}

					{
						cp_model_open ? 
						<Model api={Api.base + '/info/'} params={{k: self.state.kind_id}} modelCallBack={(modelData) => self.modelCallBack(modelData)} />
						:
						null
					}


				</div>
			)
		}else {
			return null;
		}
	}
}

function mapStateToProps(state) {
	return {
		vs_spec_data: state.compare.get('vs_spec_data'),
		cp_brand_open: state.component.get('cp_brand_open'),
		cp_kind_open: state.component.get('cp_kind_open'),
		cp_model_open: state.component.get('cp_model_open')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			vsGetData,
			cpBrandOpen,
			cpKindOpen,
			cpModelOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(specDetails)