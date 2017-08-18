import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'


class kindyear extends Component {
	constructor() {
		super()
		this.state = {
			data: '',
		};
	}
	componentDidMount() {
		let self = this;
		self.getInfo(self.props.params);
	}

	getInfo(params) { //請求數據
		let self = this;
		Ajax.get(Api.base + '/photo/', params).then(function(res) {
			self.setState({
				data: res
			});
		});
	}

	render() {
		let self = this,
			k = self.props.params.k,
			years = self.state.data != ''?self.state.data.years:'';
		return (
			<div>
				<Header titleName="年份選擇" hdClass="hd-inner" />
				<div>
				{years != '' ?
					<ul>
					{years.map((d, i) => {
						return <Link key={'i' + i} to={d.new_kind_id?"/kindpic/"+k+"/"+d.new_kind_id:"/kindpic/"+k+"/all"} className="kindyear">{ d.year }</Link>
					})}
					</ul>
				:null}
				</div>
			</div>
		)
	}
}

export default connect()(kindyear)