import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import Toast from 'antd-mobile/lib/toast'
import extend from 'extend'
import { param } from '../../utils'
import Tooltip from 'rc-tooltip'
import Slider from 'rc-slider'
import Brand from '../component/brand'
import { cpBrandOpen } from '../../action/component'
import "../../resource/css/filter.less"
import 'rc-slider/assets/index.css'



const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class kindsum extends Component {
	constructor() {
		super()
		this.state = {
			listData: [],	//列表數據
			resultData: '',	//篩選結果
			condition: {}	//篩選條件
		};
	}
	componentWillMount() {
		let self = this,
			condition = self.props.location.query ? self.props.location.query : {}; //獲取搜索條件

		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
		self.getInfoList();
		self.setState({
			condition: condition
		});
	}
	componentDidMount() {
		this.getInfoResult();
	}
	//請求列表數據
	getInfoList() {
		let self = this;

		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
		Ajax.get(Api.base + '/filter/').then(function(res) {
			self.setState({
				listData: res.data
			});
			Toast.hide();
		});
	}
	//請求選車結果
	getInfoResult() {
		let self = this,
			condition = self.state.condition;

		Ajax.get(Api.base + '/kind/', condition).then(function(res) {
			self.setState({
				resultData: res
			});
			Toast.hide();
		});
	}
	//重置url
	changeUrl() {
		let self = this,
			condition = self.state.condition;

		history.replaceState(null, '', '/m/filter?' + param(condition));
	}
	//公用條件選擇
	pubSlt(field, value, name) {
		let self = this,
			condition = self.state.condition;

		if (field == 'cf') { //配備
			let dVal = condition[field] ? condition[field].split(',') : [],
				sel = 0;

			for (var i = 0; i < dVal.length; i++) {
				if (value == dVal[i]) { //已選的取消選中
					dVal.splice(i, 1);
					sel++;
				}
			};
			if (sel == 0) { //不是取消選中的情況
				//選中添加事件統計
				ReactGA.ga('send', 'event', '條件選車頁', '選車條件', name);
				dVal.push(value);
			};
			if (dVal == '') { //為空時刪除
				delete condition[field];
			}else {
				//配備存儲數據為字符串而不是數組
				condition[field] = dVal.join();
			}
		}else { //其它
			if (condition[field] == value) { //已選的取消選中
				delete condition[field];
			}else {
				//選中添加事件統計
				ReactGA.ga('send', 'event', '條件選車頁', '選車條件', name);
				condition[field] = value;
			};
		}

		self.setState({
			condition: condition
		})
		
		//重新請求選車結果
		self.getInfoResult();
		self.changeUrl();
	}
	//重置
	reset() {
		let self = this;

		location.replace(Api.host + '/m/filter');
	}
	//價格
	fltAfterChange(num) {
		let self = this,
			condition = self.state.condition;

		condition['min_price'] = num[0];
		if (num[1] <= 200) {
			condition['max_price'] = num[1];
		}else {
			condition['max_price'] = 10000;
		}

		//重新請求選車結果
		self.getInfoResult();
		self.changeUrl();
	}
	//點擊廠牌選車
	brandFilter() {
		this.props.actions.cpBrandOpen(true);
	}
	//點擊廠牌選擇車款
	brandCallBack(brandData) {
		let self = this,
			condition = self.state.condition;

		condition['b'] = brandData.id;
		self.props.actions.cpBrandOpen(false);
		//重新請求選車結果
		self.getInfoResult();
		self.changeUrl();
	}
	render() {
		let self = this,
			listData = self.state.listData,
			resultData = self.state.resultData,
			condition = self.state.condition;

		if (listData != '') {
			return (
				<div>
				{
					self.props.cp_brand_open ? 
					<section>
						<Brand api={Api.base + '/brand/select?type=base'} brandCallBack={(brandData) => self.brandCallBack(brandData)} />
					</section>
					:
					<div className="flt-wrap">


						<Header 
							nav={true} 
							module="條件選車"
							titleRight={
								<a href={Api.host + '/m/search/autos'} className="hd-search">
									<i></i>
								</a>
							}
							hdClass="hd-inner hd-inner-blue"
							backClass="hd-back hd-back-in"
							iconClass="hd-icon white" 
						/>


						<div className="flt-cd">{resultData && resultData.selected != '' ? resultData.selected.join('，') : "您選擇的條件將會在這裡"}</div>


						<section className="flt-box">
							<Title title="價格" />
							<div className="flt-price">
								<Range
									min={0}
									max={205}
									defaultValue={condition.min_price && condition.max_price ? [Number(condition.min_price), Number(condition.max_price)] : [0, 205]}
									tipFormatter={value => `${value <= 200 ? (value + '萬') : '200萬以上'}`}
									onAfterChange={(num) => self.fltAfterChange(num)}
									marks={{
										0: '0萬',
										205: '200萬以上'
									}}
								/>
							</div>
							<Link className="flt-brand-more" onClick={() => self.brandFilter()}>廠牌選車</Link>
						</section>


						{
							listData.map((l, t) => {
								if (t == 1) { //價格
									return <section key={"list" + t} className="flt-box">
										<Title title={l.label} />
										<ul className="flt-list clearfix">
											{
												l.option.map((v, i) => (
													<li key={"item" + i} className="flt-item" onClick={() => self.pubSlt(l.field, v.value, v.name)}>
														<div className={"flt-car-icon flt-car-icon-" + v.value + " " + (condition[l.field] == v.value ? "at" : "")}></div>
														<div className="flt-car-name">{v.name}</div>
													</li>
												))
											}
										</ul>
									</section>
								}else if (t == 7) { //配備
									let _val = condition[l.field] ? condition[l.field].split(',') : [];
									return <section key={"list" + t} className="flt-box">
										<Title title={l.label} />
										<ul className="flt-list clearfix">
											{
												l.option.map((v, i) => {
													let sel = false;
													for (var n = 0; n < _val.length; n++) {
														if (_val[n] == v.value) {
															sel = true;
														}
													}
													return <li key={"item" + i} className={"flt-item " + (sel ? "at" : "")}>
														<div className="flt-item-inner" onClick={() => self.pubSlt(l.field, v.value, v.name)}>{v.name}</div>
													</li>
												})
											}
										</ul>
									</section>
								}else if (t > 1 && t < 7) {
									return <section key={"list" + t} className="flt-box">
										<Title title={l.label} />
										<ul className="flt-list clearfix">
											{
												l.option.map((v, i) => (
													<li key={"item" + i} className={"flt-item " + (condition[l.field] == v.value ? "at" : "")}>
														<div className="flt-item-inner" onClick={() => self.pubSlt(l.field, v.value, v.name)}>{v.name}</div>
													</li>
												))
											}
										</ul>
									</section>
								};
							})
						}


						<section className="flt-foot">
							<span className="flt-foot-reset" onClick={() => self.reset()}>重置</span>
							<Link className="flt-foot-all" to={resultData.total != 0 ? {pathname: "/filter/autos", query: condition} : null}>{"搜尋（共" + resultData.total + "個車款）"}</Link>
						</section>


					</div>
				}
				</div>
			)
		}else {
			return null;
		}
	}
}

class Title extends Component {
	render() {
		return <div className="flt-title">{this.props.title}</div>
	}
}

function mapStateToProps(state) {
	return {
		cp_brand_open: state.component.get('cp_brand_open')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpBrandOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(kindsum)