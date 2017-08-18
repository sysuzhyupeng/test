/*
 * 回到頂部按鈕
*/
import React, { Component } from 'react'
import render from 'react-dom'
import { connect } from 'react-redux'

class BackTop extends Component {
	constructor() {
		super()
		this.state = {
			show: false
		};
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
    componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
    }
	handleScroll() { //滾動顯示/隱藏
		var self = this,
			windowHeight = window.screen.height,
			scollTop = document.body.scrollTop;
			
			if (scollTop > windowHeight/2) {
				self.setState({
					show: true
				});
			}else {
				self.setState({
					show: false
				});
			}

	}
	turnTop() { //點擊回到頂部
		window.scroll(0, 0);
	}
	render() {
		var self = this;

		return (
			<div className={"backto-wrap " + (self.state.show ? "" : "hide")} onClick={() => self.turnTop()}>
				<div className="backto-one"></div>
				<div className="backto-arrow"></div>
			</div>
		);
	}

}

export default connect()(BackTop)
