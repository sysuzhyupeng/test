import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { vsGetData, vsEdit } from '../../action/compare'

class compareFoot extends Component {
	linkTo() { //跳轉到比較詳情頁
		let self = this,
			type = self.props.type,
			data = self.props.data,
			myid_arr = [];

		//被選中的比較個數
		for (var i = 0; i < data.length; i++) {
			if (data[i].sel) {
				myid_arr.push(data[i].myid);
			}
		}
		browserHistory.push('/m/vs/' + type + '/' + myid_arr.join());
	}
	clear() { //清空
		var self = this,
			 key = self.props.keyValue;

		localStorage.setItem(key, JSON.stringify([]));
		self.props.actions.vsGetData(key);
		self.props.actions.vsEdit(false);
	}
	render() {
		let 		self = this,
			  editStatus = self.props.vs_edit,
					most = self.props.most,
					data = self.props.data,
					 all = 0,
					typeName = self.props.typeName;

		//被選中的比較個數
		for (var i = 0; i < data.length; i++) {
			if (data[i].sel) {
				all++;
			}
		}

		if (editStatus) { //編輯狀態
			return (
				<div className="vs-foot-none clearfix" onClick={() => self.clear()}>{'清除所有' + typeName}</div>
			)
		}else {
			return (
				<div className="vs-foot clearfix">
					<span>{'最多比較' + most + '個' + typeName}</span>
					<span className={"vs-foot-link " + (all >= 2 ? "at" : "")} onClick={() => (all >= 2 ? self.linkTo() : null)}>{'比較(' + all + ')'}</span>
				</div>
			)
		}
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
			vsGetData,
			vsEdit
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(compareFoot)