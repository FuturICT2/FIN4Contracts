import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';

class TokenSelectorComponent extends Component { // adopted from https://www.js-tutorials.com/react-js/react-select-example-using-material-ui/
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.state = {
            data: this.getDev(),
            selected: 'None',
			//dataKey: this.contracts.Fin4BaseToken.methods.getStatusesOfMyClaims.cacheCall()
		};
    }

    handleChange = event => {
        this.setState({ selected: event.target.value, name: event.target.name });
    };

    getDev() {
        return [        
            {name: 'asdfasdf', code: 'A'}, {name: 'qqrwerw', code: 'B'}, {name: 'shdsfgh', code: 'C'}
        ]
    }

    renderOptions() {
        return this.state.data.map((dt, i) => {
            return (
                <MenuItem key={i} value={dt.country_name}>{dt.code}</MenuItem>
            );
        });
    }

    render() {
        return (
            <Select key="select" style={{
                width: '100%',
                marginBottom: '15px'
              }} value={this.state.selected} onChange={this.handleChange}>
                {this.renderOptions()}
           </Select>
        );
    }
}

TokenSelectorComponent.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(TokenSelectorComponent, mapStateToProps);
