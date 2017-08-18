import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Toast from 'antd-mobile/lib/toast'
import Ajax from '../../utils/ajax'
import Header from '../component/header'
import { cpShareStatus } from '../../action/component'
import { sumKsYear } from '../../action/sum'
import { sumKindIndex } from '../../action/sum'
import { sumKindI } from '../../action/sum'
import { sumKindM } from '../../action/sum'
import Share from '../component/share'
import SumNav from './sumnav'
import KindList from './kindlist'
import KindDetialList from './kinddetaillist'
import KindDetial from './kinddetail'
import KsList from './kindsum-list'
import RidersCommentItem from '../component/ridersCommentItem'
import AutoCar from '../component/autoCar'
import { tpNavAt } from '../../action/topic'
import OrderItem from '../order/orderitem'
import OrderTip from '../order/ordertip'
import { hasLogin } from '../../utils/auth'
import "../../resource/css/sum.less"

class kindpic extends Component {
	constructor() {
		super()
		this.state = {
			data: '',
			photoList:'',
			kindpicShow:true,
			KindDetialListShow:false,
			KindDetialShow:false
		};
	}
	getInfo(params) { //請求數據
		let self = this,
		 	data = {
				'k': self.props.params.k,
				'myid': self.props.params.nk == 'all'?'':self.props.params.nk,
			};
		Ajax.get(Api.base + '/info/', data).then(function(res) {
			self.setState({
				data: res
			});
			Toast.hide();
		});
	}
	getPhoto() {
		let self = this,
		 	params = {
				'k': self.props.params.k,
			};
			Ajax.get(Api.base + '/photo/', params).then(function(res){
				self.setState({
					photoList:res
				})
			})
	}
	componentWillMount() {
		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
	}
	componentDidMount() {
		let self = this;
		self.getInfo(self.props.params);
		self.getPhoto();

	}
	carMore(d) {
		let self = this;
		self.setState({
			kindpicShow:false,
			KindDetialListShow:true,
			KindDetialShow:false
		});
	}
	fnShowkindpic() {
		document.body.style.backgroundColor ="#f5f5f5";
		let self = this;
		self.setState({
			kindpicShow:true,
			KindDetialListShow:false,
			KindDetialShow:false
		});
	}
	fnShowkinddetail() {
		let self = this;
		self.setState({
			kindpicShow:false,
			KindDetialListShow:false,
			KindDetialShow:true
		});
	}
	render() {
		let self = this,
			photoList = self.state.photoList,
			listIndex = self.props.sum_kind_index,
			sum_kind_i = self.props.sum_kind_i,
			sum_kind_m = self.props.sum_kind_m,
			data = self.state.data;
			 
		return (
	<div>

		{ data&&self.state.kindpicShow ?
			<section>
				<Header nav={true} module={ data.brandName } hdClass="hd-inner hd-inner-blue" titleRight={
					<a href={Api.host + '/m/search/search'} className="hd-search">
						<i></i>
					</a>
				} backClass="hd-back hd-back-in" iconClass="hd-icon white" />

					<SumNav at="autopic" source="auto" kid={data.kind_id} myid={ self.props.params.nk } topic={data.topic.id || ''} />

					<KindList  kid={data.kind_id} nk={self.props.params.nk} data={ photoList } fnShowkinddetail={ () => self.fnShowkinddetail() } carMore={ () => self.carMore() }/>

            </section>
	    : null }
	    <div>
		{ listIndex&&self.state.KindDetialListShow ?
			<KindDetialList  sumKindI={sum_kind_i} data={listIndex} brandName={ data.brandName } fnShowkinddetail={ () => self.fnShowkinddetail() } fnShowkindpic={ () => self.fnShowkindpic() } />
	    : null }
	    </div>
	    <div>
		{ data&&self.state.KindDetialShow ?
			<KindDetial  sumKindI={sum_kind_i} sumKindM={sum_kind_m} data={ photoList } brandName={ data.year + '款'+data.brandName }  fnShowkindpic={ () => self.fnShowkindpic() } />
	    : null }
	    </div>
	</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		sum_ks_year: state.sum.get('sum_ks_year'),
		sum_ks_pk: state.sum.get('sum_ks_pk'),
		sum_kind_index: state.sum.get('sum_kind_index'),
		sum_kind_i: state.sum.get('sum_kind_i'),
		sum_kind_m: state.sum.get('sum_kind_m')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			cpShareStatus,
			sumKsYear,
			tpNavAt
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(kindpic)