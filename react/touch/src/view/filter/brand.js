import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Toast from 'antd-mobile/lib/toast'
import Ajax from '../../utils/ajax'
import FootNav from '../component/footNav'
import Header from '../component/header'
import HotBrand from '../component/hotBrand'
import BrandList from '../component/brandList'
import BrandNav from '../component/brandNav'
import COMMON from '../component/common'
import "../../resource/css/brand.less"

class kindsum extends Component {
	constructor() {
		super()
		this.state = {
			data: [],
			navStatus: false
		};
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentWillMount() {
		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
		this.getInfo();
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		Toast.hide();
	}
	//請求數據
	getInfo() {
		let self = this;

		Ajax.get(Api.base + '/index/', {ht_limit: 10}).then(function(res) {
			self.setState({
				data: res
			});
			Toast.hide();
		});
	}
	//滾動事件
	handleScroll() {
		let self = this,
			afterScrollTop = document.body.scrollTop,
			car = self.refs['brd-car'];
			
		if (car) {
			let carTop = car.offsetTop;
			//滾動定位導航
			if (afterScrollTop >= carTop) {
				self.setState({
					navStatus: true
				})
			}else {
				self.setState({
					navStatus: false
				})
			}
		}
	}
	filterGa(name) {
		ReactGA.ga('send', 'event', '找車頁', '熱門條件', name);
	}
	render() {
		let self = this,
			data = self.state.data,
			nav_foot_data = [{'name':'找車','url':'/brand'}];
		return (
			<div>


				<Header 
					nav={true} 
					module="找車"
					titleRight={
						<a href={Api.host + '/m/search/autos'} className="hd-search">
							<i></i>
						</a>
					}
					hdClass="hd-inner hd-inner-blue"
					backClass="hd-back hd-back-in"
					iconClass="hd-icon white" 
				/>


				{ data.condition ? <section>
					<Title title="熱門條件" />
					<div className="brd-filter viewFilterBrand">
						<div className="brd-filter-list clearfix">
							{ data.condition.map((v, i) => {
								return <Link key={"condition" + i} to={{pathname: "/filter/autos", query: v.value}} className="brd-filter-link" onClick={() => self.filterGa(v.name)}>{v.name}</Link>
							})}
						</div>
						<Link to="/filter" className="brd-filter-more">條件選車</Link>
					</div>
				</section> : null }


				{ data.hot_brand ? <section>
					<Title title="熱門廠牌" />
					<HotBrand data={data.hot_brand} />
				</section> : null }


				{ data.hot_car ? <section ref="brd-car">
					<Title title="熱門車款" />
					<div className="brd-car clearfix">
						{ data.hot_car.map((v, i) => {
							return <Link key={'hotCar' + i} to={"/kindsum/" + v.kind_id} className="brd-car-item">
								<img src={ COMMON.fnSetPicSize(v.thumb,210,140) } className="brd-car-img" />
								<div className="brd-car-title ellipsis">{v.name}</div>
							</Link>
						})}
					</div>
				</section> : null }


				{ data.brand ? <BrandList data={data.brand} /> : null }

				{ self.state.navStatus && data.index ? <BrandNav data={data.index} /> : null }

				<FootNav data={ nav_foot_data }/>

			</div>
		)
	}
}

class Title extends Component {
	render() {
		return <div className="brd-title">{this.props.title}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(kindsum)