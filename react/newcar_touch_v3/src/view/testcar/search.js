import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import Ajax from '../../utils/ajax'
import { connect } from 'react-redux'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import ArticleItem from '../component/articleItem'
import Header from '../component/header'
import { testcarsearchData, testcarsearchPaging } from '../../action/testcar'
import { Link } from 'react-router'
import "../../resource/css/testcar.less"

class testcarsearch extends Component {
	constructor() {
		super()
		this.state = {
			data: '',
			type: ' ',
			price_index:'',
			grade_index:'',
			price_gap:'',
			grade_id:'',
			key:'',
			show:true,
			loading: false
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	componentWillMount() {
		let self = this;
		self.getOptionData();
		
		if( self.props.location.query.show == 'false'  && self.props.testcarsearch_data != '') {
			self.setState({
				show: false,
			});
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
			self.getInfo(self.props.testcarsearch_paging);
		}
	}
	getInfo(paging) { //請求數據to="/testcar/2"

		let self = this,
			params = {
				'r' : self.state.price_gap,
				'at' : self.state.grade_id,
				'key' : self.state.key,
			},
			testcarsearch_data =  self.props.testcarsearch_data || [];
		if (self.loadStatus) {
			self.loadStatus = false;
			if (typeof(paging) != 'undefined') { //滾動加載數據
				if (paging != '') { //有下一頁
					Ajax.get(paging)
					.then(function(res) {
						testcarsearch_data.push(res.data);
						self.props.actions.testcarsearchData(testcarsearch_data); //新的數據
						self.props.actions.testcarsearchPaging(res.paging); //下一頁的鏈接
						self.loadStatus = true;
						if (res.paging) {
							self.setState({
								loading: true,
								show: false
							});
						}else {
							self.setState({
								loading: false,
								show: false
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
				Ajax.get(Api.base + '/trialArt/?', params).then(function(res) {
					testcarsearch_data = [];
					testcarsearch_data.push(res.data);
					self.props.actions.testcarsearchData(testcarsearch_data); //新的數據
					self.props.actions.testcarsearchPaging(res.paging); //下一頁的鏈接
					self.loadStatus = true;
					if (res.paging) {
						self.setState({
							loading: true,
							show: false
						});
					}else {
						self.setState({
							loading: false,
							show: false
						});
					}
					Toast.hide();
				}).catch(function(rej) {
					self.loadStatus = true;
				});
			}
		}
	}
	getOptionData() {
		var self = this;
		Ajax.get(Api.base + '/trialArt/filter', {}).then(function(res) {
			self.setState({
				data: res
			});
		})
	}
	fnPrice(min,max,i,name) {
		let self = this,
			ga_name = name?name:'不限',
			price_gap = min!=undefined?min+','+max:'',
			index = i!=undefined?i:'';
			self.setState({
				price_index: index,
				price_gap: price_gap
			});
		
		ReactGA.ga('send', 'event', '試駕列表搜索', '搜索價格', ga_name);
		history.replaceState(null, '', '/m/testcarsearch?at='+self.state.grade_id+"&r="+price_gap+"&key="+self.state.key);
	}
	fnGrade(id,i,name) {
		let self = this,
			ga_name = name?name:'不限',
			grade_id = id!=undefined?id:'',
			index = i!=undefined?i:'';

			self.setState({
				grade_index: index,
				grade_id: grade_id
			});
		ReactGA.ga('send', 'event', '試駕列表搜索', '搜索車型', ga_name);
		history.replaceState(null, '', '/m/testcarsearch?at='+grade_id+"&r="+self.state.price_gap+"&key="+self.state.key);
	}
	keyContent(show) {
		let self = this;
		
		if( show ) {
			self.getInfo();
		} else {
			self.setState({
				show: true,
				price_index:'',
				grade_index:'',
				price_gap:'',
				grade_id:'',
				key:'',
			});
		}
		history.replaceState(null, '', '/m/testcarsearch?at='+self.state.grade_id+"&r="+self.state.price_gap+"&key="+self.refs.keyContent.value+"&show=false");
	}
	onChange(e) {
		let self = this;
		self.setState({
			key: self.refs.keyContent.value,
		});
		history.replaceState(null, '', '/m/testcarsearch?at='+self.state.grade_id+"&r="+self.state.price_gap+"&key="+self.refs.keyContent.value);
	}
	render() {
		let self = this,
			list_data = self.props.testcarsearch_data,
			data = self.state.data;

		return (
			<div>
				<Header nav={false}  hdClass="hd-inner hd-inner-blue hd-padding-right" titleRight={
					<div  className="testcar-search">
						<input type="text" value={ self.state.key } ref="keyContent" onChange={ ()=> self.onChange(event) } placeholder="請輸入關鍵字"/>
						<div className="search-btn"  onClick={ ()=> self.keyContent(self.state.show) } >{ self.state.show?'確定':'清空' }</div>
					</div>
				} backClass="hd-back hd-back-in" iconClass="hd-icon white" />
			{ self.state.show?
				<section className="search-option">
					<div className="price-option-content">
						<div className="price-name">價格:</div>
						<div className="price-items">
							<div className={ self.state.price_index === ''?"price-btn price-select":"price-btn"} onClick={ ()=> self.fnPrice() }>不限</div>
						{
							data!=''?data.price.map((d,i) => (
								<div key={i} className={ self.state.price_index === i?"price-btn price-select":"price-btn"} onClick={ ()=> self.fnPrice(d.min,d.max,i,d.name) }>{ d.name }</div>
							)) : null
						}
						</div>
					</div>
					<div className="grade-option-content">
						<div className="grade-name">車型:</div>
						<div className="grade-items">
							<div className={ self.state.grade_index === ''?"grade-btn grade-select":"grade-btn"} onClick={ ()=> self.fnGrade() }>不限</div>
							{
								data!=''?data.autoType.map((d,i) => (
									<div key={i} className={ self.state.grade_index === i?"grade-btn grade-select":"grade-btn"} onClick={ ()=> self.fnGrade(d.id,i,d.name) }>{ d.name }</div>
								)) : null
							}
						</div>

					</div>
				</section>
			:
				<seciton className="testcar-index">
					<div className="main">
						{
							list_data != ''&& list_data != undefined ? list_data.map((v,i) => (
							  <ArticleItem key={"articleItem" + i} data={v} limit="10" />
							)) : null
						}
					</div>
					{ self.state.loading ?<Button className="btn" loading>加載中..</Button> : null }
				</seciton>
			}
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		testcarsearch_data: state.testcar.get('testcarsearch_data'),
		testcarsearch_paging: state.testcar.get('testcarsearch_paging')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			testcarsearchData,
			testcarsearchPaging
		}, dispatch)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(testcarsearch)