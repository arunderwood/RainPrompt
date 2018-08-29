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
let ResetPin = 0;
let LedPin = 16;
let dhtPin = 22;
let moisturePin = 32;
let LightPin = 34;

// How often should we update the cloud
let freq = 60000;

// Turn on status led
GPIO.set_mode(LedPin, GPIO.MODE_OUTPUT);
GPIO.write(LedPin, 0);

print("Starting...");

// Init sensors
ADC.enable(moisturePin);
ADC.enable(LightPin);
let dht = DHT.create(dhtPin, DHT.DHT11);

// Set deviceID
let deviceId = Cfg.get("device.id");

// Init state
let state = {
  'Temperature': dht.getTemp(),
  'Humidity': dht.getHumidity(),
  'Moisture': ADC.read(moisturePin),
  'Light': ADC.read(LightPin)
};

let getStatus = function() {
  return {
    'Temperature': dht.getTemp(),
    'Humidity': dht.getHumidity(),
    'Moisture': ADC.read(moisturePin),
    'Light': ADC.read(LightPin)
  };
};

let reportInterval = Cfg.get("rainprompt.reportInterval");

Timer.set(reportInterval, Timer.REPEAT, function() {
  Shadow.update(0, state);
}, null);
