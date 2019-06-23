import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringRetriever from './StringRetriever';

class ContractRetriever extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.state = {
            dataKey: this.contracts.Fin4Main.methods.getChildren.cacheCall()
        };
    }

    render() {
        if (!this.props.contracts.Fin4Main.initialized) {
            return <span>Initializing...</span>;
        }

        if (!(this.state.dataKey in this.props.contracts.Fin4Main.getChildren)) {
            return <span>Fetching...</span>;
        }

        var tokenAddressArr = this.props.contracts.Fin4Main.getChildren[this.state.dataKey].value;

        const balances = tokenAddressArr.map((tokenAdr, i) => {
            return (
                <>
                    <span style={{ fontWeight: 'bold' }}>
                        <StringRetriever tokenAdr={tokenAdr} attribute={'name'} />
                    </span>
                    &nbsp;
                    <span>
                        [<StringRetriever tokenAdr={tokenAdr} attribute={'symbol'} />]
                    </span>
                    &nbsp;
                    <span>
                        [<StringRetriever tokenAdr={tokenAdr} attribute={'balanceOfMe'} />]
                    </span>
                </>
            );
        });

        return (
            <>
                {balances}
            </>
        );
    }
}

ContractRetriever.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts
    };
};

export default drizzleConnect(ContractRetriever, mapStateToProps);
