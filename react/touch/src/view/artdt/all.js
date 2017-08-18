import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Comment from './comment'
import Header from '../component/header'

class all extends Component {
    back() { //點擊返回
    	history.back();
    }
	render() {
		let self = this;



		return (
			<div>
				<section className="tp-wrap">

					<Header nav={true} module="留言" titleRight={
						<a href={Api.host + '/m/search/search'} className="hd-search">
							<i></i>
						</a>
					} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" iconClass="hd-icon white" />

					<div>

						<Comment params={self.props.params} />
					</div>

				</section>
			</div>
		)
	}
}

export default connect()(all)