import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Share from '../component/share'
import Header from '../component/header'
import { cpShareStatus } from '../../action/component'
import { Carousel, WhiteSpace } from 'antd-mobile/lib'
import "../../resource/css/sum.less"

class kinddetail extends Component {
	constructor() {
		super()
		this.state = {
			data: '',
			list:'',
			now:0,
			name:'',
			show_nav:0
		};
	}
	fnInfo() {
		let self = this;
		self.props.carMore()
	}
	componentWillMount() {
		document.body.style.backgroundColor ="black";
	}
	componentDidMount() {
		let self = this;
		self.getPhoto();
	}
	getPhoto() {
		let self = this,
			res = self.props.data,
			index = self.props.sumKindI?self.props.sumKindI:0;
		self.setState({
			data:res.data,
			list:res.data[index],
			show_nav:index,
			now: self.props.sumKindM,
			name: res.data[index].list[self.props.sumKindM].name
		})
	}
	shareFn() { //點擊分享
		this.props.actions.cpShareStatus(true);
	}
	fnGetNavData(i) {
		let self = this,
			index = i?i:0,
			data = self.state.data;
		self.setState({
			list:data[index],
			show_nav:index,
			now:0,
			name: self.state.list.list[index].name
		})
	}
	afterChange(index) {
		let self = this;
		self.setState({
			now:index,
			name: self.state.list.list[index].name
		})
	}
	render() {
		let self = this,
			show_nav = 0,
			data = self.state.data,
			shareUrl = location.href,
			name = self.state.name,
			lists = self.state.list;
		return (
			<div>
				<section className="hd-wrap photo-bg">
					<div id="hd-inner" className="hd-inner hd-border">
						<a href="javascript:;" className="hd-back hd-black" onClick={ () => self.props.fnShowkindpic() } ></a>
						<div className="hd-main hd-main-color">{ lists.count == 0?0:self.state.now + 1}/{ lists.count }</div>
						<i className="button-share-icon" onClick={ ()=> self.shareFn() }></i>
					</div>
				</section>
			{ data != '' ?
				<div>
					<nav className="photo-nav">
							{ data.map((d,i) => (
								 <div key={i} onClick={ () => self.fnGetNavData(i) } className={ d.count==0?'none nav':self.state.show_nav==i?'nav select-nav':'nav'}>{ d.label }<b>({ d.count })</b></div>
							))}
					</nav>
					<div className="photo-counts">{ name }</div>
					<section className="photo-big">
				<Carousel
					selectedIndex={self.state.now}
					className="tp-photo"
					dots={false}
					infinite={true}
					afterChange={index => self.afterChange(index)}
				>
						{ lists.list.map((d,i) => (
							<div key={i} className="photo-center">
								<img src={ d.bigthumb } />
							</div>
						))}
				</Carousel>
					</section>

					<srction className="photo-thumbnail">
				<Carousel
					selectedIndex={self.state.now}
					className="tp-thumbnail"
					height="80"
					slideLeft="30"
					slidesToShow={3}
					slidesToScroll={3}
					dots={false}
					slideWidth={1.05}
					infinite={true}

				>
				{ lists.list.map((d,i) => (
			 		<div key={i} className="photo-thumbnail-item" onClick={ ()=> self.afterChange(i) }>
						<img src={ d.thumb } />
					</div>
				))}
				</Carousel>
				<Share shareUrl={shareUrl} />
					</srction>
				</div>
			 :null }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		cp_share_status: state.component.get('cp_share_status')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpShareStatus
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(kinddetail)