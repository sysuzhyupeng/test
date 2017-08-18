/*
* 熱門廠牌
*/

import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import loadingImg from '../../resource/img/loading.png'

class DowloadFoot extends Component {
	render() {
		let self = this,
			data = self.props.data || [];

		if (data.length != 0) {
			return (
				<div className="hotbrd-wrap clearfix">
					{data.map((v, i) => {
						return <a key={'hot' + i} href={Api.index + "kind/" + v.id} className={"hotbrd-item fl clearfix " + (i == 9 && self.props.more ? "hide" : "")}>
							<img src={v.image} className="hotbrd-img" />
							<p className="hotbrd-title">{v.en_name}</p>
						</a>
					})}
					{self.props.more ? <a href={Api.index + "brand"} className="hotbrd-item fl clearfix">
						<span className="hotbrd-more"></span>
						<p className="hotbrd-title">更多</p>
					</a> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(DowloadFoot)