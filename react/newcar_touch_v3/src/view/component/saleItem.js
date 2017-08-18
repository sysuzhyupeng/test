import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import COMMON from '../component/common'

class saleItem extends Component {
	render() {
		var self = this,
			data = self.props.data || [],
			limit = self.props.limit; //限制顯示個數

		return (
			<div>
				{ data.length != 0 ? data.map((v, i) => {
					return <Link key={"sale" + i} to={"/kindsum/" + v.kind_id} className={"sale-item clearfix " + (i >= limit ? "hide" : "")}>
						<div className="sale-pic">
							<span className="sale-icon">{i + 1}</span>
							<img src={ COMMON.fnSetPicSize(v.thumb,190,130) } className="sale-img" />
						</div>
						<dl className="sale-params">
							<dt>
								<div className="sale-params-title">{v.name}</div>
								<div className="sale-params-price">{v.price}</div>
							</dt>
							<dd>{"月售" + v.sales + "輛"}</dd>
						</dl>
					</Link>
				}) : null}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		cp_article_limit: state.component.get('cp_article_limit') //取消限制的個數
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(saleItem)