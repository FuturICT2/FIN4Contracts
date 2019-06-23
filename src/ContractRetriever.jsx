import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringRetriever from './StringRetriever';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

        const names = [];
        const symbols = [];
        const balances = [];

        tokenAddressArr.forEach(t => {
            names.push(<StringRetriever tokenAdr={t} attribute={'name'} />);
            symbols.push(<StringRetriever tokenAdr={t} attribute={'symbol'} />);
            balances.push(<StringRetriever tokenAdr={t} attribute={'balanceOfMe'} />);
        });

        return (
            <Paper>
                <Typography variant="h5" component="h3">
                    {this.props.title}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            {["Name", "Symbol", "Balance"].map((key, index) => {
                                return <TableCell key={index}>{key}</TableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {names.map((n, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell key={`1`}>{names[i]}</TableCell>
                                    <TableCell key={`2`}>{symbols[i]}</TableCell>
                                    <TableCell key={`3`}>{balances[i]}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Paper>
        )
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
