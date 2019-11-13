const express = require('express');
const app = express();
const port = 4050;
const cors = require('cors');
app.use(cors());
const title = 'FIN4Xplorer Sensor Server';

app.listen(port, () => console.log(title + ' listening on port ' + port));

app.get('/', (req, res) => res.send(title));

app.get('/sensor', (request, response) => {
	console.log('Received sensor request: ', request.query);

	// e.g. http://localhost:4050/sensor?id=123&data=something

	// TODO

	response.send('Request received');
});
