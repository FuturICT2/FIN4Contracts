import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';

class TokenSelectorComponent extends Component { // adopted from https://www.js-tutorials.com/react-js/react-select-example-using-material-ui/
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.state = {
            selected: 'None',
			dataKey: this.contracts.Fin4Main.methods.getActionNames.cacheCall()
		};
    }

    handleChange = event => {
        this.setState({ selected: event.target.value, name: event.target.name });
    };

    render() {
        if (!this.props.contracts.Fin4Main.initialized) {
			return <span>Initializing...</span>;
        }
        
        if (!(this.state.dataKey in this.props.contracts.Fin4Main.getActionNames)) {
			return <span>Fetching...</span>;
        }

        var pendingSpinner = this.props.contracts.Fin4Main.synced ? '' : 'syncing';

        var displayData = this.props.contracts.Fin4Main.getActionNames[this.state.dataKey].value;
        var tokenAddressArr = displayData;
        
        const menuItems = tokenAddressArr.map((tokenAdr, i) => {
            return (
                <MenuItem key={i} value={tokenAdr}>{tokenAdr}</MenuItem>
            );
		});

        return (
            <Select key="select" style={{
                width: '100%',
                marginBottom: '15px'
              }} value={this.state.selected} onChange={this.handleChange}>
                {menuItems}
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
