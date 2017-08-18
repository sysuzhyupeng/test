import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { sumKindIndex } from '../../action/sum'
import { sumKindI } from '../../action/sum'
import { sumKindM } from '../../action/sum'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import "../../resource/css/kindlist.less"

class kindlist extends Component {
	constructor() {
		super()
	}
	fnInfo(i) {
		let self = this;
		self.props.actions.sumKindIndex(self.props.data.data[i]);
		self.props.actions.sumKindI(i);
		self.props.carMore()
	}
	fnPhotoShow(i,m) {
		let self = this;
		self.props.actions.sumKindI(i);
		self.props.actions.sumKindM(m);
		self.props.fnShowkinddetail()
	}
	componentDidMount() {
		let self = this;
	}
	render() {
		let self = this,
			data = self.props.data;
		return (
			<div>
				{ data != '' ?
					data.data.map((d,i) => (
				 	 d.count != 0 ? <section className="photo-list" key={'i' + i} >
								<header  className="photo-header">
									<label className="title">{ d.label }</label>
									<div className="photo-count">({ d.count }張)</div>
									<div className="more" onClick={() => self.fnInfo(i)}>更多</div>
								</header>
								<div className="car-photo-list">
									{ d.list.map((n,m) => {
								return <div className="car-photo-item" key={'m'+m} onClick={() => self.fnPhotoShow(i,m)}>
											<img src={ n.thumb } />
										</div>
									})}
								</div>
						</section>
						: null
						))
				: null }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			sumKindIndex,
			sumKindI,
			sumKindM,
		}, dispatch)
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(kindlist)