import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'


class autoCar extends Component {
    render() {
        var self = this,
            data = self.props.data;

        return (
            <a href={Api.host + '/m/kindsum/' + data.kind_id} className="autocar-item">
                <img src={data.thumb} />
                <div>{data.brandName + ' ' + data.kindName}</div>
                <p>{data.price}</p>
            </a>
        )
    }
}

export default connect()(autoCar)