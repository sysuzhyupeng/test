import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { sumKindIndex } from '../../action/sum'
import { sumKindI } from '../../action/sum'
import { sumKindM } from '../../action/sum'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Ajax from '../../utils/ajax'

class kinddetail extends Component {
	componentWillMount() {
		window.scrol
	}
	fnPhotoShow(i) {
		let self = this;
		self.props.actions.sumKindI(self.props.sumKindI);
		self.props.actions.sumKindM(i);
		self.props.fnShowkinddetail()
	}
	render() {
		let self = this,
			data = self.props.data;
		return (
			<div>
				<div className="photo-deital-section">
					{ data != '' ?
						<div>
						<section className="hd-wrap"><div id="hd-inner" className="hd-inner"><a href="javascript:;" className="hd-back" onClick={ () => self.props.fnShowkindpic() }></a><div className="hd-main">{ self.props.brandName + " " + data.label }</div></div></section>
						{ data.list.map((d, i) => {
						 	return <div key={i} data-index={ i } className="photo-detail-list">
								<img src={ d.thumb } onClick={ ()=> self.fnPhotoShow(i) } />
							</div>
						})}
						</div>
					:null }
				</div>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			sumKindIndex,
			sumKindI,
			sumKindM,
		}, dispatch)
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(kinddetail)