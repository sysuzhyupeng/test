import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import COMMON from '../component/common'

class listItem extends Component {
	constructor() {
		super()
		this.state = {
		}
	}
	render() {
		let self = this,
			data = self.props.data;

		return <div className="tpls-item">
			<Link to={'/show/topic/' + data['id']}>
				<div className="tpls-pic"><img src={ COMMON.fnSetPicSize(data['pc_cover'],260,170) } /></div>
				<div className="tpls-info">
					<p className="tpls-title">{data['big_title']}</p>
					<div className="tpls-desp"><span className="tpls-view"><i></i>{data['visit_num']}</span><span className="tpls-date">{data['add_time']}</span></div>
				</div>
			</Link>	
		</div>
	}
}

function mapStateToProps(state) {
	return {
		
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(listItem)