/*
* 熱門廠牌
*/

import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import loadingImg from '../../resource/img/loading.png'
import COMMON from '../component/common'

class HotModel extends Component {
	render() {
		let self = this,
			data = self.props.data || [];

		if (data.length != 0) {
			return (
				<div className="hotmod-wrap clearfix">
					{data.map((v, i) => {
						return <Link key={'hot' + i} to={"/kindsum/" + v.kind_id} className="hotmod-item">
							<img src={ COMMON.fnSetPicSize(v.thumb,173,115) } className="hotmod-img" />
							<p className="hotmod-kind">{v.kind}</p>
						</Link>
					})}
				</div>
			)
		}else {
			return <div className="loadingImg">
				<img src={loadingImg} />
			</div>
		}
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

export default connect(mapStateToProps, mapDispatchToProps)(HotModel)