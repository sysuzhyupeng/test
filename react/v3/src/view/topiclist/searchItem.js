/*
* 頂部篩選
*/

import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getTouchOs } from '../../utils'
import { tpListSearchSelected } from '../../action/topiclist'
import logo from '../../resource/img/logo.png'

class SearchItem extends Component {
	constructor() {
		super()
		this.state = {
			horizontal: false
		};
	}
	componentWillMount() {
	}
	componentDidMount() {
		var self = this;
	}
	selectBrand(name){
		var self = this;
		var parent = self.props.parent;
		var hd_icon_input = parent.refs['hd-icon-input'];
		hd_icon_input.value = name;
		self.props.actions.tpListSearchSelected(name);
	}
	render() {
		var self = this;
		var data = self.props.data;
		return (
            <div>
            	<section className="">
            		<div className="tpls-search-title">{self.props.module}{ self.props.clearTag ? <span className="tpls-search-clear" onClick={self.props.clearFun} ></span>: null}</div>
            		<ul className="tpls-search-item clearfix">
            		    {
	            		    data ? data.map((v, i) => {
	            		    	return <li key={self.props.module + i} onClick={()=>self.selectBrand(v['name'])}>{v['name']}</li>
	            		    }): null
	            		}
            		</ul>
				</section>
            </div>
		);
	}
}

function mapStateToProps(state) {
	return {
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			tpListSearchSelected
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchItem)