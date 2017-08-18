import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import COMMON from '../component/common'

class articleItem extends Component {
	constructor() {
		super()
		this.state = {
			data: "",
			paging:"",
			loading: true,
			showLoading:1
		};
	}
	//浏览人数超过3位数增加逗号.
	addCommas(nStr) {
		nStr += '';
		var x = nStr.split('.');
		var x1 = nStr;
		var x2 = '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
	render() {
		var self = this,
			limit = self.props.limit, //限制顯示個數
			data = self.props.data,
			ArticleDetails = self.props.type;
		return (
			<div>
				{ data.length != 0 ? data.map((v, i) => {
					if (ArticleDetails != "ArticleDetails") {
						return <Link key={"article" + i} to={v.type!=4?"/show/articledetails/" + v.type + "/" + v.id : "/show/topic/"+v.id} className={"article-item clearfix " + (i >= limit ? "hide" : "")}>
							<img src={ COMMON.fnSetPicSize(v.thumb,190,130) } className="article-img" />
							<div className="article-params">
								<div className="article-title">{v.title}</div>
								<div className="article-info">
									<span className="fr article-time">{ v.time }</span>
									<i className="browse-icon"></i>
									<span >{self.addCommas(v.visits) }</span>
								</div>
							</div>
						</Link>
					}else if (ArticleDetails == "ArticleDetails") {
						return <a key={"article" + i} href={"/m/show/articledetails/" + v.type + "/" + v.id} className={"article-item clearfix " + (i >= limit ? "hide" : "")}>
							<img src={ COMMON.fnSetPicSize(v.thumb,190,130) } className="article-img" />
							<div className="article-params">
								<div className="article-title">{v.title}</div>
								<div className="article-info">
									<span className="fr article-time">{ v.post_time }</span>
									<span>
										<i className="browse-icon"></i>
										{self.addCommas(v.visits) }
									</span>
								</div>
							</div>
						</a>
					}
				}) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(articleItem)