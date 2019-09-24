const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());
let title = 'FIN4XPLORER Demo Faucet Server';

app.get('/', (req, res) => res.send(title));

app.get('/faucet', (req, res) => {
	console.log('GET request received');
	res.send('done');
});

app.listen(port, () => console.log(title + 'listening on port ' + port));
