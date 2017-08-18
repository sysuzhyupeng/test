import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import Ajax from '../../utils/ajax'
import { connect } from 'react-redux'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import ArticleItem from '../component/articleItem'
import FootNav from '../component/footNav'
import Header from '../component/header'
import { testcarData, testcarPaging } from '../../action/testcar'
import { Link } from 'react-router'
import "../../resource/css/testcar.less"

class testcar extends Component {
	constructor() {
		super()
		this.state = {
			data: '',
			type: ' ',
			loading: false
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	componentWillMount() {
		let self = this;

		self.getNavData();
		if (!self.props.testcar_data) {
			self.getInfo(undefined,self.props.params.t);
		}
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}
	handleScroll() {
		let self = this,
			afterScrollTop = document.body.scrollTop,
			scrollHeight = document.body.offsetHeight - window.screen.height;
		if (afterScrollTop >= scrollHeight || document.documentElement.scrollTop >= scrollHeight) {
			self.setState({
				loading: true
			});
			self.getInfo(self.props.testcar_paging);
		}
	}
	getInfo(paging,genre) { //請求數據to="/testcar/2"
		let self = this,
			testcar_data =  self.props.testcar_data || [];
			if(typeof(genre) != 'undefined') {
				history.replaceState(null, '', '/m/testcar/'+genre);
				self.props.params.t = '100';
				self.setState({
					type: genre
				});
			}

		if (self.loadStatus) {
			self.loadStatus = false;
			if (typeof(paging) != 'undefined') { //滾動加載數據
				if (paging != '') { //有下一頁
					Ajax.get(paging)
					.then(function(res) {
						testcar_data.push(res.data);
						self.props.actions.testcarData(testcar_data); //新的數據
						self.props.actions.testcarPaging(res.paging); //下一頁的鏈接
						self.loadStatus = true;
						if (res.paging) {
							self.setState({
								loading: true
							});
						}else {
							self.setState({
								loading: false
							});
						}
					}).catch(function() {
						self.loadStatus = true;
					})
				}else {
					self.setState({
						loading: false
					});
					self.loadStatus = true;
				}
			} else {
				Toast.loading('加載中...', 20, function() {
					Toast.fail('頁面加載失敗，請刷新重試！');
				});
				Ajax.get(Api.base + '/trialArt/', {type: genre}).then(function(res) {
					testcar_data = [];
					testcar_data.push(res.data);
					self.props.actions.testcarData(testcar_data); //新的數據
					self.props.actions.testcarPaging(res.paging); //下一頁的鏈接
					self.loadStatus = true;
					if (res.paging) {
						self.setState({
							loading: true
						});
					}else {
						self.setState({
							loading: false
						});
					}
					Toast.hide();
				}).catch(function(rej) {
					self.loadStatus = true;
				});
			}
		}
	}
	getNavData(info) {
		var self = this;
		Ajax.get(Api.base + '/trialArtTag/', info).then(function(res) {
			self.setState({
				data: res
			});
		})
	}
	render() {
		let self = this,
			list_data = self.props.testcar_data,
			nav_foot_data = [{'name':'試駕','url':'/testcar/'+self.state.type}],
			data = self.state.data;
		return (
			<div>
				<Header nav={true} module={ '試駕' } home="home" hdClass="hd-inner hd-inner-blue" titleRight={
					<Link to='/testcarsearch' className="hd-search">
						<i></i>
					</Link>
				} backClass="hd-back hd-back-in" iconClass="hd-icon white" />
				<seciton className="testcar-index">
					<nav className="nav">
						<Link className={ self.props.params.t==0||parseInt(self.state.type)===0?'select-nav testcar-nav':'testcar-nav' }  onClick={ ()=>self.getInfo( undefined,0) } to="/testcar/0">全部</Link>
						<Link className={ self.props.params.t==20||self.state.type==20?'select-nav testcar-nav':'testcar-nav' }  onClick={ ()=>self.getInfo( undefined,20) } to="/testcar/20">深度解析</Link>
						<Link className={ self.props.params.t==1||self.state.type==1?'select-nav testcar-nav':'testcar-nav' }  onClick={ ()=>self.getInfo( undefined,1) } to="/testcar/1">集評導購</Link>
						<Link className={ self.props.params.t==2||self.state.type==2?'select-nav testcar-nav':'testcar-nav' }  onClick={ ()=>self.getInfo( undefined,2) } to="/testcar/2">油耗測試</Link>
					</nav>
					<div className="main">
						{
							list_data != ''&& list_data != undefined ? list_data.map((v,i) => (
							  <ArticleItem key={"articleItem" + i} data={v} limit="10" />
							)) : null
						}
					</div>
					{ self.state.loading ?<Button className="btn" loading>加載中..</Button> : null }
					<FootNav data={ nav_foot_data }/>
				</seciton>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		testcar_data: state.testcar.get('testcar_data'),
		testcar_paging: state.testcar.get('testcar_paging')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			testcarData,
			testcarPaging
		}, dispatch)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(testcar)