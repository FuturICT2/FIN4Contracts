import React, { Component } from 'react';
import ContractData from '../ContractData';
import { Fin4Box } from '../Elements';

class Messages extends Component {

    getMyMessage = ({ 0: sender, 1: message, 2: fulfillmentAddress, 3: proofTypeName }) => {
        return <li>
                <div>
                    {message}<br></br>Requested by: <i>{sender}</i><br></br>
                    <b><a href={`/approving?fulfillmentAddress=${fulfillmentAddress}&proofTypeName=${proofTypeName}`}>Go to approval page</a></b>
                </div>
            </li>
    };

	getMyMessagesCount = data => {
        var messageCount = Number(data);
        if (messageCount === 0) {
            return <i>No messages</i>;
        }
        var messageIndices = [];
        for (var i = 0; i < messageCount; i++) {
            messageIndices.push(i);
        }
		const messageItems =
            messageIndices.map((index) => {
                return (
                <ContractData 
                    key={index}
                    contractName="Fin4Main"
                    method="getMyMessage"
                    methodArgs={[index]}
                    callback={this.getMyMessage} 
                />);
			});
		return <ul>{messageItems}</ul>;
	};

	render() {
		return (
			<Fin4Box title="Messages">
				<ContractData
					contractName="Fin4Main"
					method="getMyMessagesCount"
					callback={this.getMyMessagesCount}
				/>
			</Fin4Box>
		);
	}
}

export default Messages;