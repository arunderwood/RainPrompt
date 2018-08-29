load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load('api_esp32.js');
load('api_dht.js');
load('api_adc.js');
load('api_rpc.js');
load('api_shadow.js');

// Pins
let resetPin = Cfg.get('rainprompt.pins.reset');
let ledPin = Cfg.get('rainprompt.pins.led');
let dhtPin = Cfg.get('rainprompt.pins.dht');
let moisturePin = Cfg.get('rainprompt.pins.moisture');
let lightPin = Cfg.get('rainprompt.pins.light');

// Turn on status led
GPIO.set_mode(ledPin, GPIO.MODE_OUTPUT);
GPIO.write(ledPin, 0);

print('Starting...');

// Init sensors
ADC.enable(moisturePin);
ADC.enable(lightPin);
let dht = DHT.create(dhtPin, DHT.DHT11);

let getStatus = function() {
  return {
    'temperature': dht.getTemp(),
    'humidity': dht.getHumidity(),
    'moisture': ADC.read(moisturePin),
    'light': ADC.read(lightPin)
  };
};

let reportInterval = Cfg.get('rainprompt.reportInterval');

Timer.set(reportInterval, Timer.REPEAT, function() {
  Shadow.update(0, getStatus);
}, null);
