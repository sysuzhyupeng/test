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
import Share from '../component/share'
import SumNav from './sumnav'
import KsList from './kindsum-list'
import RidersCommentItem from '../component/ridersCommentItem'
import FootNav from '../component/footNav'
import AutoCar from '../component/autoCar'
import { tpNavAt } from '../../action/topic'
import OrderItem from '../order/orderitem'
import OrderTip from '../order/ordertip'
import { hasLogin } from '../../utils/auth'
import "../../resource/css/sum.less"

class kindsum extends Component {
	constructor() {
		super()
		this.state = {
			data: '',
			show_call_tip: false,
			followSuccess: false
		};
		this.followStatus = false;
	}
	getInfo(params) { //請求數據
		let self = this;

		Ajax.get(Api.base + '/info/', params).then(function(res) {
			self.setState({
				data: res
			});
			Toast.hide();
		});
	}
	componentWillMount() {
		Toast.loading('加載中...', 20, function() {
			Toast.fail('頁面加載失敗，請刷新重試！');
		});
	}
	componentDidMount() {
		let self = this;

		self.getInfo(self.props.params);
		self.props.actions.sumKsYear(0);
	}
	componentWillUnmount() {
		Toast.hide();
	}
	yearAt(num) { //點擊年份切換
		let self = this;

		self.props.actions.sumKsYear(num);
	}
	shareOpen() { //分享
		this.props.actions.cpShareStatus(true);
	}
	follow(kind_id) { //關注
		let self = this;

		if (!self.followStatus) {
			self.followStatus = true;
            //判斷是否登錄
            hasLogin(function() {
            	let data = '[{"type":"3","id":"'+ kind_id +'"}]';
            	Ajax.post(Api.base + '/u/favorAdd/', {
            		data: data,
            		token: localStorage.getItem('accesstoken') || ''
            	}).then(function(res) {
					if (res.status == 200) {
						Toast.success('關注成功');
						self.setState({
							followSuccess: true
						});
					}else if (res.error) {
                        Toast.fail(res.error.message);
                    }
					self.followStatus = false;
				}).catch(function(rej) {
					self.followStatus = false;
				});
			});
		}
	}
	showCallTip(ivr_active, tel, ivr_phone){  //展示撥打電話提示
		var self = this;
		var data = {};
		if(ivr_active){
			data.ivr_active = true;
			data.ivr_phone = ivr_phone;
		} else {
			data.ivr_active = false;
		}
		data.tel = tel;
		self.setState({
			show_call_tip: true,
			call__tip_data: data
		})
	}
	hideCallTip() {  //隱藏撥打電話提示
		var self = this;
		self.setState({
			show_call_tip: false
		})
	}
	navLinkTo(num) { //跳轉到深度解析詳情頁對應的文章
		this.props.actions.tpNavAt(num);
	}
	listLinkTo(tag_id) { //跳轉到深度解析詳情頁對應的文章
		var self = this,
			topicNav = self.state.data.topicNav;

		if (tag_id > 0) {
			for (var i = 0; i < topicNav.length; i++) {
				if (tag_id == topicNav[i].tag_id) {
					this.props.actions.tpNavAt(i);
				}
			}
		}
	}
	gaYy() { //预约试驾按钮统计
		ReactGA.ga('send', 'event', '深度解析詳情頁', '深度试驾', '按钮')
	}
	render() {
		let self = this,
			data = self.state.data,
			nav_foot_data = [{'name':data.brandName + ' ' + data.kindName,'url':'/kindsum/'+data.kind_id}],
			year = data ? data.data : '';

		return (
			<div>

				{ data ? <section>

					<Header titleName={data.brandName + ' ' + data.kindName} hdClass="hd-inner" rightContent={<span className="sum-icon"><i onClick={() => self.shareOpen()} className="sum-icon-share"></i><i onClick={() => self.follow(data.kind_id)} className={"sum-icon-follow " + (self.state.followSuccess ? "at" : "")}></i></span>} />

					<SumNav at="kindsum"  kid={data.kind_id} source="kind" topic={data.topic.id || ''} />

					{data.pictures ? <section className="ks-ov">
		                <dl className="ks-ov-pic clearfix">
		                    <dt className="fl">
		                        <Link to={"kindpic/" + data.kind_id +'/all'} className="ks-ov-big">
		                            <img src={data.pictures[0].bigPic} />
		                            <span className="ks-ov-type">{data.pictures[0].type_name}</span>
		                        </Link>
		                    </dt>
		                    <dd className="fr">
		                        <Link to={"kindpic/" + data.kind_id +'/all'} className="ks-ov-sm">
		                            <img src={data.pictures[1].smallPic} />
		                            <span className="ks-ov-type">{data.pictures[1].type_name}</span>
		                        </Link>
		                        <Link to={"kindpic/" + data.kind_id +'/all'} className="ks-ov-sm">
		                            <img src={data.pictures[2].smallPic} />
		                            <span className="ks-ov-type">{data.pictures[2].type_name}</span>
		                        </Link>
		                    </dd>
		                </dl>
		                <div className="ks-ov-info clearfix">
		                	<dl>
		                		<dt>{data.price}</dt>
			                    <dd>
			                    	<span>{data.tab}</span>
			                    	<span>{data.oil}</span>
			                    </dd>
			                </dl>
			                <Link onClick={() => self.gaYy()} to="/order" className="ks-ov-yy">預約試駕</Link>
		                </div>
		            </section> : null }

		            {year != '' ? <section className="ks-yr clearfix">
				        <div className="ks-yr-title-wrap">
				            <ul className="ks-yr-title clearfix">
				            {year.map((d, i) => {
				            	return <li key={'year' + i} className={'ks-yr-title-list ' + (i == self.props.sum_ks_year ? 'slt' : '')} onClick={() => self.yearAt(i)}>{d.label}</li>
				            })}
				            </ul>
				        </div>
				        <div className="ks-yr-content-wrap">
				        	{year.map((dl, k) => {
				                return <KsList key={'list' + k} dl={dl} k={k} brandName={data.brandName} kindName={data.kindName} />
				        	})}
				        </div>
				    </section> : null }

				    {data.topic != '' ? <section className="ks-bj">
				    	<div className="ks-title clearfix">
				    		<span className="ks-title-name">編輯測評</span>
				    		<Link to={"/show/topic/" + data.topic.id} className="ks-title-link">查看測評全文></Link>
				    	</div>
				    	<nav className="ks-bj-nav clearfix">
				    		{data.topicNav.map((bj, j) => {
					    		return <Link key={'nav' + j}
					    					 to={"/show/topic/" + bj.topic_id}
					    					 className="ks-bj-nav-link"
					    					 onClick={() => self.navLinkTo(j)}
					    				>{bj.name}</Link>
				    		})}
				    	</nav>
				    	<div className="ks-bj-list">
				    		{data.evaluation.map((ev, e) => {
				    			return <Link key={'ev' + e}
				    						 to={"/show/topic/" + ev.topic_id}
				    						 className="ks-bj-list-link"
				    						 onClick={() => self.listLinkTo(ev.tag_id)}
				    					>{ev.intro + '(' + ev.name + ')' + ':' + ev.value}</Link>
				    		})}
				    		<Link to={"/show/topic/" + data.topic.id} className="ks-bj-list-content">
				    			<div>編輯點評：</div>
				    			<p>{data.editorRating[0].content}</p>
				    			<span>查看更多</span>
				    		</Link>
				    	</div>
				    </section> : null }

				    {data.comment != '' ? <section className="ks-cmt">
				    	<div className="ks-title clearfix">
				    		<span className="ks-title-name">車友評價</span>
				    		<a href={Api.host + '/m/commentedit'} className="ks-title-link">寫評價</a>
				    	</div>
				    	<div className="ks-cmt-list">
				    		{data.comment.map((rdc, r) => {
				    			return <RidersCommentItem key={'rdc' + r} data={rdc} />
				    		})}
				    		<a href={Api.host + '/m/kindcomment/' + data.kind_id} className="ks-cmt-more">更多評價</a>
				    	</div>
				    </section> : null }

				    {data.dealer != '' ? <section className="ks-dealder">
				    	<div className="ks-title clearfix">
				    		<span className="ks-title-name">經銷商列表</span>
				    		<Link to='/order' className="ks-title-more">更多</Link>
				    	</div>
				    	{
				    		data.dealer.map((v, i)=>{
				    			return <OrderItem key={'OrderItem' + i} data={v} ivr={data['ivr_active']} callBackFn={self.showCallTip.bind(self)} />
				    		})
				    	}
				    </section> : null }

				    {data.autoData != '' ? <section className="ks-compete">
				    	<div className="ks-title clearfix">
				    		<span className="ks-title-name">競爭車款</span>
				    	</div>
				    	<div className="ks-compete-list clearfix">
				    		{data.autoData.map((ad, a) => {
				    			return <AutoCar key={'ad' + a} data={ad} />
				    		})}
				    	</div>
				    </section> : null }

				    <a href={Api.host + '/m/compare'} className="ks-pk">
				    	<p>PK</p>
				    	<p>比較</p>
				    	{self.props.sum_ks_pk ? <span></span> : null}
				    </a>

		            <Share shareUrl={data.fb_url} />

					{self.state.show_call_tip ? <OrderTip data={self.state.call__tip_data} callBackFn={self.hideCallTip.bind(self)} /> : null}

	            </section> : null }
	            { data.brandName?<FootNav data={ nav_foot_data }/>:null }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		sum_ks_year: state.sum.get('sum_ks_year'),
		sum_ks_pk: state.sum.get('sum_ks_pk')
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

export default connect(mapStateToProps, mapDispatchToProps)(kindsum)