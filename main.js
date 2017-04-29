var sensor = require('node-dht-sensor');

const asTemp = pre => val => `${val}${String.fromCharCode(0x00B0)}${pre}`;

const asF = asTemp('F');
const asC = asTemp('C');

sensor.read(11, 4, function(err, temperature, humidity) {
    if (err) {
    	console.error(err);
    }
    if (!err) {
	const c = temperature.toFixed(2);
	const f = c * 1.8 + 32;
	const h = humidity.toFixed(2);
	console.log(`${asF(f)}/${asC(c)} - ${h}%H`);
    }
});
