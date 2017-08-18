import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { sumKsPk } from '../../action/sum'


class KsList extends Component {
	constructor() {
		super()
		this.state = {
			allStatus: true,
			defaultAttr: localStorage.getItem('specAttr') ? JSON.parse(localStorage.getItem('specAttr')) : []
		};
	}
	componentWillMount() {
		var self = this;

		//初始判斷比較個數是否大於0
		if (self.state.defaultAttr.length > 0) {
			self.props.actions.sumKsPk(true);
		}
	}
	all() { //查看全部車型
		this.setState({
			allStatus: !this.state.allStatus
		})
	}
	join(modelName, year, myid) { //加入/取消比較
		var self = this,
			listObj = {},
			selNum = 0,
			nowAttr = self.state.defaultAttr;

		listObj.modelName = modelName;
		listObj.year = year + '款';
		listObj.myid = myid;
		listObj.brandName = self.props.brandName;
		listObj.kindName = self.props.kindName;

		//選中比較的數量小於6時，比較頁自動選中該車輛
        for (var i in nowAttr) {
            if (nowAttr[i].sel == true) {
                selNum++;
            };
        };
        if (selNum < 6) {
            listObj.sel = true;
        };

        nowAttr.push(listObj);
        localStorage.setItem('specAttr', JSON.stringify(nowAttr));
        self.setState({
        	defaultAttr: nowAttr
        });
        self.props.actions.sumKsPk(true);
	}
	cancelJoin(myid) { //取消比較
		var 	self = this,
			 nowAttr = self.state.defaultAttr;

		for (var i in nowAttr) {
            if (myid == nowAttr[i].myid) {
                nowAttr.splice(i, 1);
            };
        };
        localStorage.setItem('specAttr', JSON.stringify(nowAttr));
        self.setState({
        	defaultAttr: nowAttr
        });
        if (nowAttr.length > 0) {
        	self.props.actions.sumKsPk(true);
        }else {
        	self.props.actions.sumKsPk(false);
        }
	}
	render() {
		let self = this,
			dl = self.props.dl,
			k = self.props.k;

		return (
			<ul key={'content' + k} className={"ks-yr-content " + (k == self.props.sum_ks_year ? '' : 'hide')}>
            	{dl.list.map((l, t) => {
            	var joinStatus = false;
            	self.state.defaultAttr.map((ls, a) => {
                	if (ls.myid == l.myid) {
                		joinStatus = true;
                	}
                })
                return <li key={'li' + t} className={'ks-yr-content-list ' + (t > 1 && self.state.allStatus ? 'in' : '')}>
	                <a href={Api.index + "auto/" + l.kind_id + "/" + l.myid} className="ks-yr-main clearfix">
	                    <dl>
	                    	<h3>{l.modelName}</h3>
		                    <p>
		                        <span>{l.gas}</span>
		                        <span>{l.tab}</span>
		                        <span>{l.power}</span>
		                    </p>
	                    </dl>
	                    <strong className="ks-yr-right-money">{l.price}</strong>
	                </a>
	                <div className="ks-yr-foot clearfix">
	                    <a href={Api.host + '/m/auto/' + l.kind_id + '/' + l.myid}>規格配備</a>
	                    <a href="javascript:;" onClick={() => {joinStatus ? self.cancelJoin(l.myid) : self.join(l.modelName, l.year, l.myid)}}>{joinStatus ? '×取消比較' : '+加入比較'}</a>
	                </div>
	            </li>
                })}
                {dl.list.length > 2 ? <div className={'ks-yr-content-all ' + (self.state.allStatus ? '' : 'at')} onClick={() => self.all()}>全部車型</div> : null}
            </ul>
		)
	}
}

function mapStateToProps(state) {
	return {
		sum_ks_year: state.sum.get('sum_ks_year')
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			sumKsPk
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(KsList)