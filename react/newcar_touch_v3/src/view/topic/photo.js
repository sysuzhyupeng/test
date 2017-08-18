import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Carousel, WhiteSpace } from 'antd-mobile/lib';
import { tpPhotoStatus } from '../../action/topic'



class Photo extends Component {
	constructor() {
		super()
		this.state = {
			now: 1
		}
	}
	getPic(pic) {
		var self = this,
			images = self.props.images,
			pic = pic.split('//')[1];

		for (var i = 0; i < images.length; i++) {
			if (images[i].path.indexOf(pic) != -1) {
				self.setState({
					now: i
				});
			}
		}
		this.props.actions.tpPhotoStatus(true);
	}
	deletePhoto() {
		this.props.actions.tpPhotoStatus(false);
	}
	componentDidMount() {
		var self = this;
		global.openPhoto = ((pic) => self.getPic(pic));
	}
	afterChange(index) {
		this.setState({
			now: index
		});
	}
	render() {
		var self = this,
			images = self.props.images;

		return (
			<div className={"tp-photo-wrap " + (self.props.tp_photo_status ? "" : "hide")}>
				<span className="tp-photo-delete" onClick={() => self.deletePhoto()}>×</span>
				<Carousel
					selectedIndex={self.state.now}
					className="tp-photo"
					dots={false}
					infinite={true}
					afterChange={index => self.afterChange(index)}
				>
					{images.map((v, i) => (
						<div key={i}>
							<img src={v.path} />
							<p>
								<span className="tp-photo-number">
									<span>{i + 1}</span>/{images.length}
								</span>
								<span>{v.text}</span>
							</p>
						</div>
					))}
				</Carousel>
				<WhiteSpace />
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		tp_photo_status: state.topic.get('tp_photo_status'),
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			tpPhotoStatus
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Photo)