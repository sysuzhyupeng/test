import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import Ajax from '../../utils/ajax'
import { connect } from 'react-redux'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import Header from '../component/header'
import Brand from '../component/brand'
import { cpKindOpen } from '../../action/component'
import { Link } from 'react-router'
import Kind from '../component/kind'

class pictureMore extends Component {
	constructor() {
		super()
		this.state = {
			brand_id: '',
			kind_id: '',
		}
		this.key = 'specAttr';
	}
	componentWillMount() {
		let self = this;
		self.props.actions.cpKindOpen(false);
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

		self.setState({
			kind_id: kindData.kind_id
		})
	}

	render() {
		let self = this;
		return (
			<div>
				<Brand back="back" api={Api.base + '/brand/select?type=base'} brandCallBack={(brandData) => self.brandCallBack(brandData)} />
				{ self.props.cp_kind_open ?
				<section>
					<Kind link="link" api={Api.base + '/kind/select?type=base'} params={{b: self.state.brand_id, limit: 10}} kindCallBack={(kindData) => self.kindCallBack(kindData)} />
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
		kind_data: state.component.get('kind_data'),
		cp_kind_open: state.component.get('cp_kind_open')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpKindOpen
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(pictureMore)