import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Header from '../component/header'
import { vsEdit } from '../../action/compare'

class compareHeader extends Component {
	constructor() {
		super()
		this.state = {
			data: ''
		};
	}
	componentWillMount() {
		document.getElementsByTagName('body')[0].style.backgroundColor = '#fff';
	}
	componentWillUnmount() {
		document.getElementsByTagName('body')[0].style.backgroundColor = '#f5f5f9';
	}
	edit() { //點擊編輯/完成
		let self = this,
			editStatus = self.props.vs_edit;

		self.props.actions.vsEdit(!editStatus);
	}
	render() {
		let self = this;

		return (
			<div style={{background: '#f5f5f9'}}>

				<Header titleName="比較" hdClass="hd-inner" rightContent={<span className="vs-edit" onClick={() => self.edit()}>{self.props.vs_edit ? '完成' : '編輯'}</span>} />

			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		vs_edit: state.compare.get('vs_edit')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			vsEdit
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(compareHeader)