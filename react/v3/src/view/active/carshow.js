import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import $ from 'jquery'
import Header from '../component/header'
import '../../plugin/jquery.slide.js'
import Ajax from '../../utils/ajax'
import "../../resource/css/active/carshow.less";

class carShow extends Component {
	constructor() {
		super()
		this.state = {
			topData: [],
			firstData: [],
			newData: [],
			exposeData: [],
			pictureData: [],
			tidbitsData: []
		};
	}
	componentWillMount() {
		this.getInfo();
	}
	getInfo() { //請求數據
		var self = this;

		Ajax.get(Api.base + '/autoexpo/shanghai/all').then(function(res) {
			self.setState({
				topData: res.data
			});
		}).catch(function() {
			self.setState({
				topData: []
			});
		});
		Ajax.get(Api.base + '/autoexpo/shanghai/article?t=1').then(function(res) {
			self.setState({
				firstData: res.data
			});
		}).catch(function() {
			self.setState({
				firstData: []
			});
		});
		Ajax.get(Api.base + '/autoexpo/shanghai/article?t=3').then(function(res) {
			self.setState({
				newData: res.data
			});
		}).catch(function() {
			self.setState({
				newData: []
			});
		});
		Ajax.get(Api.base + '/autoexpo/shanghai/article?t=8').then(function(res) {
			self.setState({
				exposeData: res.data
			});
		}).catch(function() {
			self.setState({
				exposeData: []
			});
		});
		Ajax.get(Api.base + '/autoexpo/shanghai/picture').then(function(res) {
			self.setState({
				pictureData: res.data
			});
		}).catch(function() {
			self.setState({
				pictureData: []
			});
		});
		Ajax.get(Api.base + '/autoexpo/shanghai/movie').then(function(res) {
			self.setState({
				tidbitsData: res.data
			});
		}).catch(function() {
			self.setState({
				tidbitsData: []
			});
		});
	}
	componentDidUpdate(prevProps, prevState) {
		this.slideFn();
	}
	slideFn() { //banner切換
		let arr = ['top', 'picture', 'tidbits'];

		for (var i = 0; i < arr.length; i++) {
			$('#cs-'+ arr[i] + '-banner').slide({
	            delay: 3000,
	            content: '.cs-'+ arr[i] + '-item',
	            pager: '#cs-'+ arr[i] + '-pagination',
	            pageEvent: 'click',
	            effect: 'scrollright',
	            split: 1,
	            hasArrow: true,
	            pageActiveCss: {            
	                backgroundColor: '#1e4d8d'
	            },
	            pageCss: {
	                display: 'none'
	            }
	        });
		}
	}
	anchor(value) { //導航錨點
		var self = this,
			sec = document.getElementById(value);

		document.body.scrollTop = sec.offsetTop;
	}
	render() {
		let self = this,
			topData = self.state.topData,
			firstData = self.state.firstData,
			newData = self.state.newData,
			exposeData = self.state.exposeData,
			pictureData = self.state.pictureData,
			tidbitsData = self.state.tidbitsData,
			navArr = [
				{
					value: 'top',
					name: '頭條'
				},
				{
					value: 'first',
					name: '台灣新車'
				},
				{
					value: 'new',
					name: '下半年新車'
				},
				{
					value: 'expose',
					name: '概念新秀'
				},
				{
					value: 'picture',
					name: '圖片'
				},
				{
					value: 'tidbits',
					name: '直播'
				}
			];

		return (
			<div>

				<Header nav={true} module="上海國際汽車展覽會" hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" iconClass="hd-icon white" />

				<div className="cs-hd"></div>

				<div className="cs-main">

					<div className="cs-nav">
						{ navArr.map((v, k) => {
							return <a key={'nav' + k} href="javascript:;" className="cs-nav-item" onClick={() => self.anchor(v.value)}>{v.name}</a>
						})}
		            </div>

					<Title name="top" />
					<Banner name="top" data={topData} />

					<Title name="first" />
					<Article data={firstData} />

					<Title name="new" />
					<Article data={newData} />


					<Title name="expose" />
					<Article data={exposeData} />


					<Title name="picture" />
					<Banner name="picture" data={pictureData} />

					<Title name="tidbits" />
					<Tidbits data={tidbitsData} />

				</div>

			</div>
		)
	}
}

class Title extends Component {
	render() {
		return (
			<h2 id={this.props.name} className="cs-title"><span className={"cs-title-name " + this.props.name}></span></h2>
		)
	}
}

class Banner extends Component {
	render() {
		let name = this.props.name,
			defaultData = this.props.data,
			data = [];

		for (var i = 0; i < defaultData.length; i += 4) {
			data.push(defaultData.slice(i, i + 4));
		}

		if (data.length != 0) {
			return (
				<div id={"cs-"+name+"-banner"} className={"cs-top-banner " + (data.length > 1 ? "" : "initial")}>
	                <div className="cs-top-box clearfix">
	                	{ data.map((l, t) => {
	                		return <div key={'item' + t} className={"cs-"+name+"-item clearfix"}>
                			{ name == 'top' ? l.map((v, k) => {
		                    	return <Link key={'banner' + k} to={"/show/articledetails/" + v['type'] + "/" + v['id']} className="cs-top-link">
		                            <img src={v['cover_pic']} />
		                            <p>{v['title']}</p>
		                        </Link>
		                    	})
	                    	: l.map((v, k) => {
		                    	return <a key={'banner' + k} href={Api.index + "kindpic/" + v['kind_id']} className="cs-top-link">
		                            <img src={v['smallPic']} />
		                            <p>{v['brand_name'] + " " + v['kind_name']}</p>
		                        </a>
		                    	})
		                    }
	                		</div>
	                	})}
	                </div>
	                <div id={"cs-"+name+"-pagination"} className="cs-top-pagination"></div>
	            </div>
			)
		}else {
			return (
				<div className="cs-blank">敬請期待</div>
			)
		}
	}
}

class Tidbits extends Component {
	render() {
		let defaultData = this.props.data,
			data = [];

		for (var i = 0; i < defaultData.length; i += 3) {
			data.push(defaultData.slice(i, i + 3));
		}

		if (data.length != 0) {
			return (
				<div id="cs-tidbits-banner" className="cs-tidbits-banner">
	                <div className="cs-tidbits-box clearfix">
	                	{ data.map((l, t) => {
	                		return <div key={'item' + t} className="cs-tidbits-item clearfix">
                			{ l.map((v, k) => {
		                    	return <Link key={'tidbits' + k} to={"/show/articledetails/" + v['type'] + "/" + v['id']} className="cs-tidbits-link">
		                            <img src={v['cover_pic']} />
		                            <p>{v['title']}</p>
		                            <i className="cs-tidbits-icon"></i>
		                        </Link>
		                    })}
	                		</div>
	                	})}
	                </div>
	                <div id="cs-tidbits-pagination" className="cs-tidbits-pagination"></div>
	            </div>
			)
		}else {
			return (
				<div className="cs-blank">敬請期待</div>
			)
		}
	}
}

class Article extends Component {
	render() {
		var self = this,
			data = self.props.data;

		if (data.length != 0) {
			return (
	            <ul className="cs-first clearfix">
	            	{ data.map((v, k) => {
	                return <Link key={"first" + k} to={"/show/articledetails/" + v['type'] + "/" + v['id']} className={"cs-first-item " + (k > 1 ? "hide" : "")}>
	                    <div className="cs-first-pic">
	                        <img src={v['cover_pic']} alt="" />
	                    </div>
	                    <div className="cs-first-main">
	                        <div className="cs-first-title">{v['title']}</div>
	                        <p className="cs-first-info clearfix">
	                        	<span className="fl">{v['post_time'].split(' ')[0]}</span>
	                        	<span className="fr">{v['is_num'] + "閱讀"}</span>
	                        </p>
	                    </div>
	                </Link>
	            	})}
	            </ul>
			)
		}else {
			return (
				<div className="cs-blank">敬請期待</div>
			)
		}
	}
}

export default connect()(carShow)