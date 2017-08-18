import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { vsGetData } from '../../action/compare'
import Toast from 'antd-mobile/lib/toast'

class compareList extends Component {
	select(myid) { //點擊選中/取消選中
		var self = this,
			most = self.props.most,
			data = self.props.data,
			 key = self.props.keyValue,
			 all = 0,
			typeName = self.props.typeName;

		for (var i = 0; i < data.length; i++) {
			if (data[i].sel) {
				all++;
			}
		}

		for (var i = 0; i < data.length; i++) {
			if (myid == data[i].myid) {
				if (data[i].sel) {
					data[i].sel = false;
				}else {
					if (most == all) {
						Toast.fail('最多可以對比' + most + '個' + typeName, 1);
						return false;
					}else {
						data[i].sel = true;
					}
				}
			}
		}
		localStorage.setItem(key, JSON.stringify(data));
		self.props.actions.vsGetData(key);
	}
	delete(myid) { //刪除
		var self = this,
			data = self.props.data,
			 key = self.props.keyValue;

		for (var i = 0; i < data.length; i++) {
			if (myid == data[i].myid) {
				data.splice(i, 1);
			}
		}
		localStorage.setItem(key, JSON.stringify(data));
		self.props.actions.vsGetData(key);
	}
	render() {
		let self = this,
			data = self.props.data;

		if (data.length != 0) {
			return (
				<ul className="vs-list">
					{ data.map((l, i) => {
						return <li key={i} className="vs-list-li" onClick={() => (self.props.vs_edit ? self.delete(l.myid) : self.select(l.myid))}>
							<span id={'list' + i} type="checkbox" className={"vs-list-icon " +  (self.props.vs_edit ? "del" : (l.sel ? "at" : ""))}></span>
							<label htmlFor={'list' + i}>{l.brandName + ' ' + l.kindName + ' ' + l.modelName}</label>
						</li>
					})}
				</ul>
			)
		}else {
			return null;
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
			vsGetData
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(compareList)