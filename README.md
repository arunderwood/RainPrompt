#  RainPrompt

IoT sensor sending plant data to AWS-IOT

## Overview

__TODO__


## How to install this app

__TODO__

## Flashing a device

```
# Build device firmware
mos build

# Write the firmware to the device over USB
mos flash

# Write the wifi settings to the device over USB
mos wifi <SSID> <WPA_KEY>

# Provision the device with AWS IoT certificates
mos aws-iot-setup --aws-region <YOUR_AWS_REGION>
```

## Starting 

```
mos --http-addr HOST_ADDRESS:1992 --verbose
```
