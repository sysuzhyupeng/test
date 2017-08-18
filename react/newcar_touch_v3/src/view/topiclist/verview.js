import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'

class Overview extends Component {
	constructor() {
		super()
		this.state = {
			
		}
	}
	render() {
		let self = this,
			data = self.props.data;
		
			return <div className="tpls-ov">
				<Link to={'/show/topic/' + data['id']} >
					<div className="tpls-ov-pic">
						<img src={data['pc_cover']} />
						<div className="tpls-ov-title ellipsis" title={data['big_title']}>{data['big_title']}</div>
					</div>
					<div className="tpls-ov-content"><span className="tpls-ov-text">{data['rating']}</span>{ data['rating'] ? <span className="tpls-ov-check">查看全文</span> : null}</div>
					<div className="tpls-ov-desp clearfix"><span className="tpls-ov-view"><i></i>{data['visit_num']}</span><span className="tpls-ov-date">{data['add_time']}</span></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Overview)