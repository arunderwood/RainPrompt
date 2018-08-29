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
load('api_aws.js');

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
if (deviceId === "")
{
  deviceId = Cfg.get("rainprompt.deviceId");
  Cfg.set("device.id", deviceId);
}

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

function reportState() {
  print('Reporting state:', JSON.stringify(state));
  AWS.Shadow.update(0, state);
}

//Timer.set(freq, Timer.REPEAT, function() {

//  state = getStatus();
//  reportState();

//}, null);

AWS.Shadow.setStateHandler(function(ud, event, reported, desired) {
  print('Event:', event, '('+AWS.Shadow.eventName(event)+')');

  // Report state when device connects to AWS
  if (event === AWS.Shadow.CONNECTED) {
    reportState();
    return;
  }
  
    // Go to sleep after AWS acknowledges an update
  if (event === AWS.Shadow.UPDATE_ACCEPTED) {
    print('Caught event:', event, '('+AWS.Shadow.eventName(event)+')');
    ESP32.deepSleep(freq);
    return;
  }

  // mOS will request state on reconnect and deltas will arrive on changes.
  if (event !== AWS.Shadow.GET_ACCEPTED && event !== AWS.Shadow.UPDATE_DELTA) {
    return;
  }

}, null);
