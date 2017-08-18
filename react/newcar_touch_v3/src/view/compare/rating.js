import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import CompareHeader from './header'
import CompareNav from './nav'
import CompareList from './list'
import CompareFoot from './foot'
import { vsGetData } from '../../action/compare'
import { cpBrandOpen, cpKindOpen } from '../../action/component'
import Brand from '../component/brand'
import Kind from '../component/kind'
import Model from '../component/model'
import Toast from 'antd-mobile/lib/toast'
import "../../resource/css/vs.less"

class compareRating extends Component {
	constructor() {
		super()
		this.state = {
			brand_id: '',
			kind_id: ''
		}
		this.key = 'ratingAttr';
	}
	componentWillMount() {
		this.props.actions.vsGetData(this.key)
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
		let self = this,
			data = self.props.vs_rating_data || [],
			selNum = 0,
			listObj = {
				modelName: kindData.modelName || '',
				myid: kindData.kind_id,
				brandName: kindData.brandName,
				kindName: kindData.kindName
			};

		for (var i in data) {
			//已选择的车型提示重复选择
			if (listObj.myid == data[i].myid) {
				Toast.fail('該車款已添加在列表中！', 1);
				return false;
			};
			if (data[i].sel == true) {
				selNum++;
			};
		};
		//選中比較的數量小於2時，比較頁自動選中該車輛
		if (selNum < 2) {
			listObj.sel = true;
		};

		data.push(listObj);
		localStorage.setItem(self.key, JSON.stringify(data));
		self.props.actions.vsGetData(self.key);
		self.props.actions.cpBrandOpen(false);
		self.props.actions.cpKindOpen(false);
	}
	render() {
		let self = this,
			data = self.props.vs_rating_data || [],
			{ cp_brand_open, cp_kind_open, cp_model_open } = self.props;

		return (
			<div>

				{
					cp_brand_open ? 
					<section className={cp_model_open ? "hide" : ""}>
						<Brand api={Api.base + '/brand/select?type=evalCompare'} brandCallBack={(brandData) => self.brandCallBack(brandData)} />
					</section>
					:
					<section>

						<CompareHeader />

						<CompareNav nav="rating" />

						<div className="vs-add" onClick={() => self.add()}>+ 添加車款</div>

						<CompareList typeName="車款" most="2" data={data} keyValue={self.key} />

						<CompareFoot type="rating" typeName="車款" most="2" data={data} keyValue={self.key} />

					</section>
				}

				{
					cp_kind_open ? 
					<section>
						<Kind api={Api.base + '/kind/select?type=evalCompare'} params={{b: self.state.brand_id, limit: 10}} kindCallBack={(kindData) => self.kindCallBack(kindData)} />
					</section>
					:
					null
				}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		vs_rating_data: state.compare.get('vs_rating_data'),
		cp_brand_open: state.component.get('cp_brand_open'),
		cp_kind_open: state.component.get('cp_kind_open')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			vsGetData,
			cpBrandOpen,
			cpKindOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(compareRating)