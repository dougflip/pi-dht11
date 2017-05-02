const path = require('path');
const url = require('url');
const fs = require('fs');
const http = require('http');
var sensor = require('node-dht-sensor');

const asTemp = pre => val => `${val}${pre}`;
const asF = asTemp('F');
const asC = asTemp('C');

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const readData = () => {
    return new Promise((resolve, reject) => {
	sensor.read(11, 4, function(err, temperature, humidity) {
    if (err) {
	reject(err);
    }
    if (!err) {
	console.log('What is the temp?', temperature);
	const c = temperature.toFixed(1);
	const f = (c * 1.8 + 32).toFixed(1);
	const h = humidity;
	console.log(`${asF(f)}/${asC(c)} - ${h}%H`);
	return resolve({
 		farenheight: f,
		celcius: c,
		humidity: h,
		timestamp: new Date().toISOString()
        });
    }
});
    });
}

const handler = (req, res) => {
    const { pathname } = url.parse(req.url);
    if (pathname === '/data') {
        res.setTimeout(1000);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return readData().then(s => res.end(JSON.stringify(s), 'utf8'));
    }

    res.setTimeout(500);
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(indexHtml);
};

const server = http.createServer(handler);
server.listen(6565, null, null, () => {
    console.log('server up');
});

process.on('SIGINT', () => {
    console.log('see ya!');
    server.close();
});
