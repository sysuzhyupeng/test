import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Brand extends Component {
	constructor() {
		super();
	}
	handleClick(data) { //列表點擊事件
		var self = this;

		if (self.props.brandItemClick) {
			self.props.brandItemClick(data);
		}else {
			return false;
		}
	}
	render() {
		let self = this,
			data = self.props.data || [];

		return (
			<div>

			    {
					data.map((v, i)=>{
						return (
							<div key={'brand-' + i } className="brand-wrap clearfix">
								<div id={'letter' + v['label']} className="brand-letter">{v['label']}</div>
								<ul className="brand-content clearfix">
									{
										v.list ? v.list.map((l, t) => {
											return <a
												key={'brand-filter-'+ t}
												onClick={() => self.handleClick(l)}
												href={self.props.brandItemClick ? 'javascript:;' : Api.index + 'kind/' + l.id}
											>
													<span className="brand-photo">
														<img src={l['image']} />
													</span>
													<span className="brand-info">{l['name']}</span>
											</a>
										}): null
									}
							    </ul>
							</div>
						)
					})
				}

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
			
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Brand)