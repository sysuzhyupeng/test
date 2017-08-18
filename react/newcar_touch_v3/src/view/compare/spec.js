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
import { cpBrandOpen, cpKindOpen, cpModelOpen } from '../../action/component'
import Brand from '../component/brand'
import Kind from '../component/kind'
import Model from '../component/model'
import seo from '../../utils/seoConfig'
import Toast from 'antd-mobile/lib/toast'
import "../../resource/css/vs.less"

class compareSpec extends Component {
	constructor() {
		super()
		this.state = {
			brand_id: '',
			kind_id: ''
		}
		this.key = 'specAttr';
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
		let self = this;

		self.props.actions.cpModelOpen(true);
		self.setState({
			kind_id: kindData.kind_id
		})
	}
	modelCallBack(modelData) { //點擊車型
		let self = this,
			data = self.props.vs_spec_data || [],
			selNum = 0,
			listObj = {
				modelName: modelData.modelName,
				myid: modelData.myid,
				brandName: modelData.brandName,
				kindName: modelData.kindName
			};

		for (var i in data) {
			//已选择的车型提示重复选择
			if (listObj.myid == data[i].myid) {
				Toast.fail('該車型已添加在列表中！', 1);
				return false;
			};
			if (data[i].sel == true) {
				selNum++;
			};
		};
		//選中比較的數量小於6時，比較頁自動選中該車輛
		if (selNum < 6) {
			listObj.sel = true;
		};

		data.push(listObj);
		localStorage.setItem(self.key, JSON.stringify(data));
		self.props.actions.vsGetData(self.key);
		self.props.actions.cpBrandOpen(false);
		self.props.actions.cpKindOpen(false);
		self.props.actions.cpModelOpen(false);
	}
	render() {
		let self = this,
			data = self.props.vs_spec_data || [],
			{ cp_brand_open, cp_kind_open, cp_model_open } = self.props;

		if (data != '') { //設置SEO
			seo('compareSpec');
		}
		return (
			<div>

				{
					cp_brand_open ?
					<section className={cp_model_open ? "hide" : ""}>
						<Brand api={Api.base + '/brand/select?type=base'} brandCallBack={(brandData) => self.brandCallBack(brandData)} />
					</section>
					:
					<section>

						<CompareHeader />

						<CompareNav nav="spec" />

						<div className="vs-add" onClick={() => self.add()}>+ 添加車型</div>

						<CompareList typeName="車型" most="6" data={data} keyValue={self.key} />

						<CompareFoot type="spec" typeName="車型" most="6" data={data} keyValue={self.key} />

					</section>
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

export default connect(mapStateToProps, mapDispatchToProps)(compareSpec)