import React, { Component } from 'react'
import { Link } from 'react-router'
import render from 'react-dom'
import { connect } from 'react-redux'

class ArtdtKind extends Component {
	render() {
		let data = this.props.data;
		return (
			<div className="artdt-kind-wrap">
			   <Link to={ '/kindsum/' + data[0].kind_id } className="clearfix artdt-kind-link">
				   <img  className="artdt-kind-thumb" src={data[0].thumb} />
				   <div className="artdt-kind-content">
					   <div className="artdt-kind-title">{data[0].full_name}</div>
					   <div className="artdt-kind-money">{data[0].call_price}</div>
				   </div>
				   <div className="detial-btn">立即試駕</div>
			   </Link>
			   <div className="sum-list">

			   		<div className="sum-page">
			   			<Link to={ '/kindsum/' + data[0].kind_id }>
				   			綜述頁
				   			<div className="line"></div>
			   			</Link>
			   		</div>
			   		<div className="picture-page">
			   			<Link to={ "/kindpic/"+ data[0].kind_id +"/all" }>
				   			圖片
				   			<div className="line"></div>
			   			</Link>
			   		</div>
			   		<div className="kindbalance-page">
				   		<a href={Api.host + '/m/kindbalance/11471' }>
				   			規格配備
			   			</a>
			   		</div>
			   </div>
		   </div>
		);
	}
}

export default connect()(ArtdtKind)