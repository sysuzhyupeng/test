import React, { Component } from 'react'
import PropTypes from 'prop-types'

/*
* 調用 <GoogleAd gad="div-gpt-ad-1494228065303-0" gadTag="/173427088/觸屏版首頁輪播廣告001" width={680} height={280} />
*/

class googleAd extends Component {
    constructor() {
        super()
    }

    componentDidMount() {
        let self = this;

        Promise.all([
            require('https://www.googletagservices.com/tag/js/gpt.js')
        ]).then(function() {
            googletag.cmd.push(function() {
                googletag.defineSlot(self.props.gadTag, [self.props.width, self.props.height], self.props.gad).addService(googletag.pubads());
                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
                googletag.display(self.props.gad);
            });
        });

    }

    render() {
        return (
            <div id={this.props.gad} style={{width: 0, height: 0}}></div>
        );
    }
}

googleAd.propTypes = {
    gad: PropTypes.string.isRequired,
    gadTag: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};

export default googleAd;