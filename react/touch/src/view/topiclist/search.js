import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'
import Toast from 'antd-mobile/lib/toast'
import Button from 'antd-mobile/lib/button'
import { tpListDataSearch, tpListPagingSearch, tpListSearchHot, tpListSearchSelected} from '../../action/topiclist'
import Header from '../component/header'
import ConfirmTip from '../component/confirmtip'
import SearchItem from './searchItem'
import ListItem from './listItem'
import BackTop from '../component/backtop'
import "../../resource/css/topicList.less"

class TPlistSearch extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		}
		this.handleScroll = this.handleScroll.bind(this);
		this.loadStatus = true;
	}
	getInfo(params, paging) { //請求數據
		let self = this,
			tplist_data = self.props.tplist_data || [];
		var search_selected = self.props.tplist_search_selected;
		if (self.loadStatus && search_selected != '') { //防止多次加載
			self.loadStatus = false;

			if (typeof(paging) != 'undefined') { //滾動加載數據
				if (paging != '') { //有下一頁
					Ajax.get(paging)
					.then(function(res) {
						tplist_data.push(res);
						self.props.actions.tpListDataSearch(tplist_data); //新的數據
						self.props.actions.tpListPagingSearch(res.paging); //下一頁的鏈接
						self.loadStatus = true;
					}).catch(function() {
						self.loadStatus = true;
					})
				}else { //滾到底部了
					self.setState({
						loading: false
					})
				}
			}else { //非滾動加載的要先清空數據
				var api =  Api.base + '/topic/search/';
				//更新歷史搜索中的數據
				self.renderSearchHistory();
				var search_param = '&key=' + search_selected;
				Ajax.get(api, search_param)
				.then(function(res) {
					tplist_data = [];
					tplist_data.push(res);
					self.props.actions.tpListDataSearch(tplist_data); //新的數據
					self.props.actions.tpListPagingSearch(res.paging); //下一頁的鏈接
					window.addEventListener('scroll', self.handleScroll);
					if(!res.paging) {
						self.setState({
							loading: false
						})
					} else {
						self.setState({
							loading: true
						})
					}
					self.loadStatus = true;
				}).catch(function() {
					self.loadStatus = true;
				})
			}

		}
	}
	//搜索框中輸入數據
	fillSearch(event){
		// var self = this;
		// var input_value = event.target.value;
		// self.setState({
		// 	inputValue: input_value
		// })
	}
	//搜索框中輸入數據
	fillSearchKey(event){
		var self = this;
		var input_value = event.target.value;
		if(event.key == 'Enter'){
			self.props.actions.tpListSearchSelected(input_value);
		}
	}
	//搜索框焦點放在上面
	focusOnSearch(){
		var self = this;
		self.renderSearchHistory();
		self.loadStatus = true;
		self.props.actions.tpListSearchSelected('');
		window.removeEventListener('scroll', this.handleScroll);
	}
	//更新歷史搜索中的數據，如果加入clear參數就是清除
	renderSearchHistory(clear){
		var self = this;
		var history_search =  localStorage.getItem('tplist_history');
		//如果傳入了一個clear參數
		if(clear){
			self.setState({
				history_search: ''
			})
			localStorage.setItem('tplist_history', '');
			return false;
		}
		//如果有歷史記錄
		if(history_search){
			history_search = JSON.parse(history_search);
			self.setState({
				history_search: history_search
			})
		}
	}
	//彈出窗口後的回調，如果是確認就調用清除瀏覽記錄
	confirmTipFn(confirm){
		var self = this;
		if(confirm){
			self.renderSearchHistory(true);
		}
		self.setState({
			confirmtip: false
		})
	}
	//點擊清除瀏覽記錄彈出窗口
	clearSearchHistory(){
		var self = this;
		self.setState({
			confirmtip: true
		})
	}
	//更新localStorage中的搜索條件
	updateSearchHistory(search_selected){
		var self = this,
			 new_storage = [],
			 history_search =  localStorage.getItem('tplist_history'),
			 new_item = {};
		new_item['name'] = search_selected;
		//是否是新的搜索條件
		var is_new_item = true;
		if(!history_search){
			new_storage.push(new_item);
		} else {
			//JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
			new_storage = JSON.parse(history_search);
			for(var i = 0, len = new_storage.length; i < len; i++){
				if(new_storage[i].name == search_selected){
					is_new_item = false;
					break;
				}
			}
			new_storage.push(new_item);
		}
		if(!is_new_item) return false;
		localStorage.setItem('tplist_history', JSON.stringify(new_storage));
	}
	getSearchInfo(){
		var self = this;
		var api =  Api.base + '/topic/search/';
		Ajax.get(api)
			.then(function(res) {
				var tplist_data = [];
				tplist_data.push(res);
				// self.props.actions.tpListData(tplist_data); //新的數據
				//更新篩選框中的數據
				self.updateSearchHot(tplist_data);
				//更新歷史搜索中的數據
				self.renderSearchHistory();
			}).catch(function() {

			})
	}
	//更新熱門搜索中的數據
	updateSearchHot(data){
		var self = this,
		    hot_data =  data || self.props.tplist_data;
		self.props.actions.tpListSearchHot(hot_data[0].filter[0].list);
	}
	componentDidMount() {
		var self = this;
		self.getSearchInfo();
	}
	componentDidUpdate() {
		var self = this,
			hd = self.refs['tplist-wrap'];
	    var search_selected = self.props.tplist_search_selected;
	    if (search_selected) {
			self.getInfo(); //初始化請求數據
			self.updateSearchHistory(search_selected);
		}
	}
	componentWillUnmount() {
	}
	handleScroll() { //滾動事件
		let self = this,
			afterScrollTop = document.body.scrollTop,
			scrollHeight = document.body.offsetHeight - window.screen.height;
		//滾到底部加載下一列表
		if (afterScrollTop >= scrollHeight || document.documentElement.scrollTop >= scrollHeight) {
			self.getInfo({}, self.props.tplist_paging);
		}
	}
	render() {
		let self = this,
			data = self.props.tplist_data;
	    let search_hot = self.props.tplist_search_hot,
	      search_selected = self.props.tplist_search_selected,
	      history_search = self.state.history_search;

		return <div>
			<section className="tpls-search-wrap">
				<Header nav={true} titleName={
					<input type="text" ref="hd-icon-input" className="hd-icon-input" placeholder="請輸入關鍵字"  onClick={self.focusOnSearch.bind(self)} onKeyUp={self.fillSearchKey.bind(self)} />
				} hdClass="hd-inner hd-inner-blue" backClass="hd-back hd-back-in" iconClass="hd-icon white" />
				{ 
					search_selected == '' ?
					<div>
						{  history_search ? <SearchItem parent={self} module="歷史搜索" data={history_search} clearTag={true} clearFun={self.clearSearchHistory.bind(this)} />: null}
						{  search_hot ? <SearchItem parent={self} module="熱門車款" data={search_hot} /> : null }
					</div>
					: null
				}
				{
					search_selected && data ? data.map((v, i) => {
						return <div key={i} className="tpls-search-main">
							{
								v.old.length ? v.old.map((l, t) => {
									return <ListItem key={'listItem' + t} data={l} />
								})  : 
								<div className="tpls-search-none">
									<div className="tpls-search-find"></div>
									<div className="tpls-search-find-text">沒有搜尋到相關內容</div>
								</div>
							}	
						</div>
					}) : null
				}
				{ self.state.confirmtip ? <ConfirmTip info="確認刪除全部歷史記錄？" callbackFn={self.confirmTipFn.bind(self)} /> : null}
				{ self.props.nav ? <NavTop /> : null }
				{ self.state.loading && search_selected ? <Button className="btn" loading>加載中...</Button> : null}

				<BackTop />
			</section>
		</div>
	}
}

function mapStateToProps(state) {
	return {
		tplist_data: state.topic_list.get('tplist_data_search'),
		tplist_data_length: state.topic_list.get('tplist_data_length_search'),
		tplist_paging: state.topic_list.get('tplist_paging_search'),
		tplist_search_hot: state.topic_list.get('tplist_search_hot'),
		tplist_search_selected: state.topic_list.get('tplist_search_selected')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			tpListDataSearch,
			tpListPagingSearch,
			tpListSearchHot,
			tpListSearchSelected
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TPlistSearch)