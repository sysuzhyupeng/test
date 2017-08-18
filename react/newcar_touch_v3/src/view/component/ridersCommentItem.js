import React, { Component } from 'react'
import render from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'


class ridersCommentItem extends Component {
    render() {
        var self = this,
            data = self.props.data;

        var items = [];
        for (var i = 0; i < 5; i++) {
            items.push(<i key={i} className={i < data.star_level ? 'at' : ''}></i>);
        }

        return (
            <a href={Api.host + '/m/commentdetails/' + data.id} className="rdc-item">
                <div className="rdc-item-portrait">
                    <img src={data.m_headpic_new} />
                </div>
                <dl className="rdc-item-main">
                    <dt>
                        <span className="rdc-item-name">{data.name}</span>
                        <div className="rdc-item-star">
                            {items}
                            <span>{data.star_level + '.0'}</span>
                        </div>
                    </dt>
                    <dd>
                        <div className="rdc-item-kind">{data.title}</div>
                        <p className="rdc-item-content">{data.content}</p>
                        <span className="rdc-item-more">查看更多</span>
                        <div className="rdc-item-info">
                            <span className="rdc-item-date">{data.time}</span>
                            <ul className="rdc-item-sup clearfix">
                                <li className="rdc-item-sup-li">
                                    <i className="zan"></i>
                                    <span>{data.likeCount}</span>
                                </li>
                                <li className="rdc-item-sup-li">
                                    <i className="evaluate"></i>
                                    <span>{data.replyNum}</span>
                                </li>
                            </ul>
                        </div>
                    </dd>
                </dl>
            </a>
        )
    }
}

export default connect()(ridersCommentItem)