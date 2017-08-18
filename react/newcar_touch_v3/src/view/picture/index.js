import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import Ajax from '../../utils/ajax'
import { connect } from 'react-redux'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import LazyLoadImg from 'react-lazyload-img'
import noPic from '../../resource/img/nopic-86-57.png'
import Header from '../component/header'
import { Link } from 'react-router'
import { pictureData, picturePaging } from '../../action/picture'
import "../../resource/css/picture.less"

class picture extends Component {
	constructor() {
		super()
		this.state = {
			data: '',
			loading: false
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	getInfo(paging) { //請求數據
		let self = this,
			params = '',
			url = Api.base + '/picture/index/',
			picture_data =  self.props.picture_data || [];
		if(self.loadStatus) {
			if(typeof(paging) != 'undefined') {
				url = paging;
			}
			Ajax.get(url,params).then(function(res) {
				if(res.paging == '') {
					self.loadStatus = false;
 				}
				picture_data.push(res.data);
				self.props.actions.pictureData(picture_data);
				self.props.actions.picturePaging(res.paging);
				self.setState({
					loading: false
				});
			});
		} else {
			self.setState({
				loading: false
			});
		}
	}
	componentDidMount() {
		let self = this;
		if(!self.props.picture_data) {
			self.getInfo();
		}
		window.addEventListener('scroll', this.handleScroll);
	}
	handleScroll() {
		let self = this,
			afterScrollTop = document.body.scrollTop,
			scrollHeight = document.body.offsetHeight - window.screen.height;
		if (afterScrollTop >= scrollHeight || document.documentElement.scrollTop >= scrollHeight) {

			self.getInfo(self.props.picture_paging);
		}
	}
	render() {
		let self = this,
			data = self.props.picture_data;
		return (
			<div>
				<Header nav={false} module={ '汽車圖庫' } hdClass="hd-inner hd-inner-blue padding-right" titleRight={
					<Link to="/picture/more" className="">
						<div  className="select-brand" >
						 	廠牌搜寻
						</div>
					</Link>
				} backClass="hd-back hd-back-in" iconClass="hd-icon white" />
				<seciton className="picture-index">
					<div className="pic-list">
						<ul>
						{ data != ''?
							data.map((m,n) => (
								m.map((d,i) => (
									<li key={i} className="pic-item">
										<Link to={"/kindpic/" + d.kind_id +"/all"} >
												<LazyLoadImg className="pic-img" src={ d.thumb } placeholder={noPic}/>
												<div className="pic-bottom">
													<span className="car-name">{ d.name }</span>
													<span className="pic-count">{ d.pic_count }張</span>
												</div>
										</Link>
									</li>
								))
							))
						:null}
						</ul>
					</div>
					{ self.state.loading ?<Button className="btn" loading>加載中..</Button> : null }
				</seciton>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		picture_data: state.picture.get('picture_data'),
		picture_paging: state.picture.get('picture_paging')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			pictureData,
			picturePaging
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(picture)