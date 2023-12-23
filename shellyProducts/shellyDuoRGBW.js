import got from 'got';
import { combineRgb } from '@companion-module/base'
import { ShellyMaster } from './shellyMaster.js'
import { ShellyDuo } from './shellyDuo.js'

const ColorWhite = combineRgb(255, 255, 255)
const ColorBlack = combineRgb(0, 0, 0)
const ColorRed = combineRgb(255, 0, 0)          //STOP,HALT,BREAK,KILL and similar terminating functions + Active program on switchers
const ColorGreen = combineRgb(0, 204, 0)        //TAKE,GO,PLAY, and similar starting functions. + Active Preview on switchers
const ColorYellow = combineRgb(255, 255, 0)     //PAUSE,HOLD,WAIT and similar holding functions + active Keyer on switchers
const ColorBlue = combineRgb(0, 51, 204)        //Active AUX on switchers
const ColorPurple = combineRgb(255, 0, 255)     //Presets that need user configuration after they have been draged onto a button

export class ShellyCommon extends ShellyMaster {
    /*  Attributes:
        ison 	    bool 	Whether the channel is turned ON or OFF
        power       number 	Consumed power, W
        total       number 	Total energy consumed in Watt-minute
        overpower 	bool 	Whether an overpower condition has occured
        source 	    string 	Source of the last command
    */

    static getRelayState(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].ison;
    }
    static getPowerConsumption(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[0].power;
    }
    static getTotalPowerConsumption(channelNumber) {
        if (this.lastStatus == null) return null;
        return (this.lastStatus.meters[0].total / 60).toFixed(2);
    }
    static getOverPowerState(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[0].overpower;
    }

    static async setRelayState(channelNumber, action) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?turn=" + action, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
}
export class ShellyWhite extends ShellyCommon {
    /*  Attributes:
        brightness 	number 	Brightness, 0..100
        temp 	    number 	Color temperature, 2700/3000..6500K
    */

    static getBrightness(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].brightness;
    }
    static getTemp(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].temp;
    }

    static async setBrightness(channelNumber, brightness) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?brightness=" + brightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async changeBrightness(channelNumber, delta) {
        if (this.lastStatus == null) return false;
        let newBrightness = Math.max(Math.min(this.lastStatus.lights[channelNumber].brightness + delta, 100), 0);
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?brightness=" + newBrightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async setTemp(channelNumber, temp) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?temp=" + temp, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async changeTemp(channelNumber, delta, minTemp, maxTemp) {
        if (this.lastStatus == null) return false;
        let newTemp = Math.max(Math.min(this.lastStatus.lights[channelNumber].temp + delta, maxTemp), minTemp);
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?temp=" + newTemp, null)
        if (response.statusCode == 200) return true;
        else return false;
    }

}
export class ShellyColor extends ShellyWhite {
    /*  Attributes:
        mode 	string 	Currently configured mode
        red 	number 	Red brightness, 0..255, applies in mode="color"
        green 	number 	Green brightness, 0..255, applies in mode="color"
        blue 	number 	Blue brightness, 0..255, applies in mode="color"
        white 	number 	White brightness, 0..255, applies in mode="color"
        gain 	number 	Gain for all channels, 0..100, applies in mode="color"
        effect 	number 	Currently applied effect, description
    */

    static getMode() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].mode;
    }
    static getColorBrightness() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].gain;
    }
    static getColor() {
        if (this.lastStatus == null) return null;
        return {
            red: this.lastStatus.lights[0].red,
            green: this.lastStatus.lights[0].green,
            blue: this.lastStatus.lights[0].blue,
            white: this.lastStatus.lights[0].white,
        }
    }
    static getEffect() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].effect;
    }

    static async setMode(mode) {
        const response = await got.get("http://" + this.targetIp + "/light/0?mode=" + mode, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async setColorBrightness(gain) {
        const response = await got.get("http://" + this.targetIp + "/light/0?gain=" + gain, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async changeColorBrightness(delta) {
        if (this.lastStatus == null) return false;
        const newGain = Math.max(Math.min(this.lastStatus.lights[0].gain + delta, 100), 0);
        const response = await got.get("http://" + this.targetIp + "/light/0?gain=" + newGain, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async setColor(red, green, blue, white, gain) {
        const response = await got.get("http://" + this.targetIp + "/color/0?red=" + red + "&green=" + green + "&blue=" + blue + "&white=" + white + "&gain=" + gain, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async changeColor(deltaRed, deltaGreen, deltaBlue, deltaWhite, deltaGain) {
        if (this.lastStatus == null) return false;
        const red = Math.max(Math.min(this.lastStatus.lights[0].red + deltaRed, 255), 0);
        const green = Math.max(Math.min(this.lastStatus.lights[0].green + deltaGreen, 255), 0);
        const blue = Math.max(Math.min(this.lastStatus.lights[0].blue + deltaBlue, 255), 0);
        const white = Math.max(Math.min(this.lastStatus.lights[0].white + deltaWhite, 255), 0);
        const gain = Math.max(Math.min(this.lastStatus.lights[0].gain + deltaGain, 100), 0);
        const response = await got.get("http://" + this.targetIp + "/color/0?red=" + red + "&green=" + green + "&blue=" + blue + "&white=" + white + "&gain=" + gain, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async setEffect(effect) {
        const response = await got.get("http://" + this.targetIp + "/light/0?effect=" + effect, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
}

/*const POWER_VALUES = ['OFF', 'ON']
const selectPower = {
    type: 'dropdown',
    label: 'Power status',
    id: 'power',
    default: 1,
    choices: POWER_VALUES.map((label, index) => ({ id: index, label })),
}
const foregroundColor = {
    type: 'colorpicker',
    label: 'Foreground color',
    id: 'fg',
    default: ColorWhite,
}
const backgroundColor = {
    type: 'colorpicker',
    label: 'Background color',
    id: 'bg',
    default: ColorGreen,
}
*/class ShellyDuoRGBW extends ShellyColor {

    static actions = {
        setPower: {
            name: 'Power',
            options: [
                {
                    type: 'dropdown',
                    label: 'Power toggle/on/off',
                    id: 'powerAction',
                    choices: [
                        { id: 'toggle', label: 'toggle' },
                        { id: 'on', label: 'on' },
                        { id: 'off', label: 'off' },
                    ],
                    default: 'toggle'
                }
            ],
            callback: async (action, context) => {
                this.setRelayState(0, action.options.powerAction)
            }
        },

        setBrightness: {
            name: 'Set Brightness',
            options: [
                {
                    type: 'number',
                    label: 'Brightness (0-100 %)',
                    id: 'brightness',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: true,
                    range: true
                }
            ],
            callback: async (action, context) => {
                this.setBrightness(0, action.options.brightness)
            },
            learn: (action) => {
                return {
                    brightness: this.lastStatus.lights[0].brightness
                }
            }
        },
        changeBrightness: {
            name: 'Increase/Decrease Brightness (+25 % to -25 %)',
            options: [
                {
                    type: 'number',
                    label: 'Brightness +/- n %',
                    id: 'delta',
                    min: -25,
                    max: 25,
                    default: 10,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.changeBrightness(0, action.options.delta)
            }
        },
        setTemp: {
            name: 'Set Color Temperature',
            options: [
                {
                    type: 'number',
                    label: 'Color Temperature (3000..6500 K)',
                    id: 'temp',
                    min: 3000,
                    max: 6500,
                    default: 4750,
                    required: true,
                    range: true
                }
            ],
            callback: async (action, context) => {
                this.setTemp(action.options.temp)
            },
            learn: (action) => {
                return {
                    temp: this.lastStatus.lights[0].temp
                }
            }
        },
        changeTemp: {
            name: 'Increase/Decrease Color Temperature (+200 K to -200 K)',
            options: [
                {
                    type: 'number',
                    label: 'Color Temperature +/- n K',
                    id: 'delta',
                    min: -200,
                    max: 200,
                    default: 100,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.changeTemp(0, action.options.delta, 3000, 6500)
            }
        },

        setMode: {
            name: 'Set Mode',
            options: [
                {
                    type: 'dropdown',
                    label: 'Mode',
                    id: 'mode',
                    choices: [
                        { id: 'white', label: 'white' },
                        { id: 'color', label: 'color' },
                    ],
                    default: 'white'
                }
            ],
            callback: async (action, context) => {
                this.setMode(action.options.mode)
            }
        },
        setColorBrightness: {
            name: 'Set Color Brightness',
            options: [
                {
                    type: 'number',
                    label: 'Color Brightness (0-100 %)',
                    id: 'gain',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: true,
                    range: true
                }
            ],
            callback: async (action, context) => {
                this.setColorBrightness(action.options.gain)
            },
            learn: (action) => {
                return {
                    gain: this.lastStatus.lights[0].gain
                }
            }
        },
        changeColorBrightness: {
            name: 'Increase/Decrease Color Brightness (+25 % to -25 %)',
            options: [
                {
                    type: 'number',
                    label: 'Color Brightness +/- n %',
                    id: 'delta',
                    min: -25,
                    max: 25,
                    default: 10,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.changeColorBrightness(action.options.delta)
            }
        },
        setColor: {
            name: 'Set color',
            options: [
                {
                    type: 'number',
                    label: 'Red (0-255)',
                    id: 'red',
                    min: 0,
                    max: 255,
                    default: 128,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'Green (0-255)',
                    id: 'green',
                    min: 0,
                    max: 255,
                    default: 128,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'Blue (0-255)',
                    id: 'blue',
                    min: 0,
                    max: 255,
                    default: 128,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'White (0-255)',
                    id: 'white',
                    min: 0,
                    max: 255,
                    default: 128,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'Gain (0-100 %)',
                    id: 'gain',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: false,
                    range: true
                },
            ],
            callback: async (action, context) => {
                this.setColor(action.options.red, action.options.green, action.options.blue, action.options.white, action.options.gain);
            },
            learn: (action) => {
                return {
                    red: this.lastStatus.lights[0].red,
                    green: this.lastStatus.lights[0].green,
                    blue: this.lastStatus.lights[0].blue,
                    white: this.lastStatus.lights[0].white,
                    gain: this.lastStatus.lights[0].gain,
                }
            }
        },
        changeColor: {
            name: 'Increase/Decrease Color Channels (+32 to -32)',
            options: [
                {
                    type: 'number',
                    label: 'Red +/- n',
                    id: 'deltaRed',
                    min: -32,
                    max: 32,
                    default: 17,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'Green +/- n',
                    id: 'deltaGreen',
                    min: -32,
                    max: 32,
                    default: 17,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'Blue +/- n',
                    id: 'deltaBlue',
                    min: -32,
                    max: 32,
                    default: 17,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'White +/- n',
                    id: 'deltaWhite',
                    min: -32,
                    max: 32,
                    default: 17,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'Gain +/- n',
                    id: 'deltaGain',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: false,
                    range: true
                },
            ],
            callback: async (action, context) => {
                this.changeColor(action.options.deltaRed, action.options.deltaGreen, action.options.deltaBlue, action.options.deltaWhite, action.options.deltaGain)
            }
        },
        setEffect: {
            name: 'Set Effect',
            options: [
                {
                    type: 'dropdown',
                    label: 'Effect',
                    id: 'effect',
                    choices: [
                        { id: '0', label: '0 - Off' },
                        { id: '1', label: '1 - Meteor Shower' },
                        { id: '2', label: '2 - Gradual Change' },
                        { id: '3', label: '3 - Flash' },
                    ],
                    default: 0,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.setEffect(action.options.effect)
            },
            learn: (action) => {
                return {
                    effect: this.lastStatus.lights[0].effect
                }
            }
        },
     }

    static feedbacks = {
        relayState: {
            type: 'boolean',
            name: 'Relay State',
            description: "Current Shelly relay state",
            options: [],
            callback: async (feedback, context) => {
                return this.getRelayState(0);
            }
        },
        modeState: {
            type: 'boolean',
            name: 'Mode State',
            description: "Currently configured mode",
            options: [
                {
                    type: 'dropdown',
                    label: 'Mode',
                    id: 'mode',
                    choices: [
                        { id: 'white', label: 'white' },
                        { id: 'color', label: 'color' },
                    ],
                    default: 'white'
                }
            ],
            callback: async (feedback, context) => {
                //console.log('getMode=' + this.getMode(0) + '  /  mode=' + feedback.options.mode);
                return (this.getMode(0) == feedback.options.mode);
            }
        },
        power: {
            type: 'advanced',
            name: 'Power',
            description: 'Power',
            options: [
                {
                    type: 'colorpicker',
                    label: 'Foreground Color',
                    id: 'onFg',
                    default: ColorWhite
                },
                {
                    type: 'colorpicker',
                    label: 'Background Color',
                    id: 'onBg',
                    default: ColorGreen
                }
            ],
            callback: async (feedback, context) => {
                if (this.lastStatus == null) return { color: ColorWhite, bgcolor: ColorRed };
                if (this.lastStatus.lights[0].ison) return { color: feedback.options.onFg, bgcolor: feedback.options.onBg };
            }
        },
/*        power: {
            type: 'advanced',
            name: 'Power Status',
            description: 'When light power status changes, change colors of the bank',
            options: [selectPower, foregroundColor, backgroundColor],
            callback: (feedback) => {
*//*                const variable =
                    feedback.feedbackId === 'power' ? this.data.variables.on : this.data.variables[feedback.feedbackId]
                if (variable === undefined) {
                    return
                }
                const currentValue = isFunction(variable.getValue)
                    ? variable.getValue(this.data.status[feedback.feedbackId])
                    : this.data.status[feedback.feedbackId]
                const feedbackValue = isFunction(variable.getValue)
                    ? variable.getValue(feedback.options[feedback.feedbackId])
                    : feedback.options[feedback.feedbackId]
                if (currentValue === feedbackValue) {
*//*                    return { color: feedback.options.fg, bgcolor: feedback.options.bg }
//                }
            }
        },
*/    }

    static variables() {
        let varList = [
            //{ variableId: 'power', name: 'Power Status' },

            { variableId: 'relayState', name: 'Power State' },
            { variableId: 'powerConsumption', name: 'Power Consumption' },
            { variableId: 'totalPowerConsumption', name: 'Total Power Consumption' },
            { variableId: 'overPowerState', name: 'Over Power State' },

            { variableId: 'brightness', name: 'Brightness' },
            { variableId: 'temp', name: 'Color Temperatur' },

            { variableId: 'mode', name: 'Configured Mode' },
            { variableId: 'colorBrightness', name: 'Color Brightness' },
            { variableId: 'color', name: ' Color' },
            { variableId: 'red', name: 'Red Brightness' },
            { variableId: 'green', name: 'Green Brightness' },
            { variableId: 'blue', name: 'Blue Brightness' },
            { variableId: 'white', name: 'White Brightness' },
            { variableId: 'effect', name: 'Currently applied effect' },
        ];
        return varList;
    }

    static updateVariables(instance) {
        instance.setVariableValues({
            //'power': this.POWER_VALUES[this.lastStatus.lights[0].ison],

            'relayState': this.getRelayState(0),
            'powerConsumption': this.getPowerConsumption(0),
            'totalPowerConsumption': this.getTotalPowerConsumption(0),
            'overPowerState': this.getOverPowerState(0),

            'brightness': this.getBrightness(0),
            'temp': this.getTemp(0),

            'mode': this.getMode(0),
            'colorBrightness': this.getColorBrightness(0),
            'color': "#" + (1 << 24 | this.lastStatus.lights[0].red << 16 | this.lastStatus.lights[0].green << 8 | this.lastStatus.lights[0].blue).toString(16).slice(1),
            'red': this.lastStatus.lights[0].red,
            'green': this.lastStatus.lights[0].green,
            'blue': this.lastStatus.lights[0].blue,
            'white': this.lastStatus.lights[0].white,
            'effect': this.getEffect(0),
        })
    }



    /*
    status
        meters
            0	
                power               0..n                    W   Consumed power, W
                is_valid            true | false                Always true
                timestamp           e.g. 1703257592             Timestamp of the last energy counter value, with the applied timezone
                counters                                        Energy counter value for the last 3 round minutes in Watt-minute
                    0               #.###                   Wm  
                    1               #.###                   Wm  
                    2               #.###                   Wm  
                total               0..n                    Wm  Total energy consumed in Watt-minute
        lights
            0	
                ison                true | false                Whether the channel is turned ON or OFF
                source              "http" | "cloud"            Source of the last command
                has_timer           true | false                Whether a timer is currently armed for this channel
                timer_started       e.g. 1703257335             Unix timestamp of timer start; 0 if timer inactive or time not synced (Seconds since Jan 01 1970. (UTC) )
                timer_duration      0..65535                s   Timer duration, s
                timer_remaining     0..65535                s   experimental If there is an active timer, shows seconds until timer elapses; 0 otherwise
                mode                "white" | "color"           Currently configured mode
                red                 0..255                      Red brightness, 0..255, applies in mode="color"
                green               0..255                      Green brightness, 0..255, applies in mode="color"
                blue                0..255                      Blue brightness, 0..255, applies in mode="color"
                white               0..255                      White brightness, 0..255, applies in mode="color"
                gain                0..100                  %   Gain for all channels, 0..100, applies in mode="color"
                temp                3000..6500              K   Color temperature in K, 3000..6500, applies in mode="white"
                brightness          0..100                  %   Brightness, 0..100, applies in mode="white"
                effect              0..3                        Currently applied effect, description
                transition          0..5000                 ms  One-shot transition, 0..5000 [ms]
    */


/*    static additionalActions = {
*//*        setMode: {
            name: 'Mode',
            options: [
                {
                    type: 'dropdown',
                    label: 'Mode',
                    id: 'mode',
                    choices: [
                        { id: 'white', label: 'White' },
                        { id: 'color', label: 'Color' },
                    ],
                    //min: 0,
                    //max: 5000,
                    default: 'white'
                }
            ],
            callback: async (action, context) => {
                ShellyLight.setMode(0, action.options.mode);
            }
        },
        setRed: {
            name: 'Set red brightness, applies in mode="color"',
            options: [
                {
                    type: 'number',
                    label: 'Red brightness, 0..255',
                    id: 'red',
                    min: 0,
                    max: 255,
                    default: 255,
                    required: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.setRed(0, action.options.red);
            }
        },
        setGreen: {
            name: 'Set green brightness, applies in mode="color"',
            options: [
                {
                    type: 'number',
                    label: 'Green brightness, 0..255',
                    id: 'green',
                    min: 0,
                    max: 255,
                    default: 255,
                    required: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.setGreen(0, action.options.green);
            }
        },
        setBlue: {
            name: 'Set blue brightness, applies in mode="color"',
            options: [
                {
                    type: 'number',
                    label: 'Blue brightness, 0..255',
                    id: 'blue',
                    min: 0,
                    max: 255,
                    default: 255,
                    required: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.setBlue(0, action.options.blue);
            }
        },
        testCycle: {
            name: 'Test cycle',
            options: [
                {
                    type: 'number',
                    label: 'Delay time between steps [ms]',
                    id: 'delayTime',
                    min: 0,
                    max: 5000,
                    default: 2000,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.testCycle(0, action.options.delayTime);
            }
        },
*//*    }
*/
/*    static actions = {
        ...ShellyDuo.actions,
        ...this.additionalActions
    };
*/    /*   static testCycle(delayTime) {
           //get current values
           var varIsOn = ShellyLight.getIsOn(0);
           varBrightness = ShellyLight.getBrightness(0);
           varWhite = ShellyLight.getWhite(0);
           varTransition = ShellyLight.getTransition(0);
           //cycle through test steps
           ShellyLight.setBrightness(0);   //0..100 %
           ShellyLight.setWhite(0);        //0..100 %
           //ShellyLight.setTemp(2700);    //2700..6500 K
           ShellyLight.setTransition(0);    //0..5000 ms
           ShellyLight.turnOn(0);
           *//*
                for (var i = 10; i <= 100; i += 10) {
                await timer(delayTime);
                ShellyLight.setBrightness(i);
            };
            ShellyLight.setMode('color');
            ShellyLight.setRed(255);
            await timer(delayTime);
            //restore values
            ShellyLight.setBrightness(varBrightness);
            ShellyLight.setWhite(varWhite);
            ShellyLight.setTransition(varTransition);
            if (varIsOn) ShellyLight.turnOn()
            else ShellyLight.turnOff()
    *//*
}
*/

/*    static additionalFeedbacks = {
*//*        mode: {
            type: 'advanced',
            name: 'Mode',
            description: "Change the button text to the current mode value",
            options: [],
            callback: async (feedback, context) => {
                const currentMode = ShellyLight.getMode(0);
                return { text: currentMode }
            }
        },
        isWhite: {
            type: 'boolean',
            name: 'Is white',
            description: "Whether the channel is in white mode",
            options: [],
            callback: async (feedback, context) => {
                return ShellyLight.getIsWhite(0);
            }
        },
        isColor: {
            type: 'boolean',
            name: 'Is color',
            description: "Whether the channel is in color mode",
            options: [],
            callback: async (feedback, context) => {
                return ShellyLight.getIsColor(0);
            }
        },
        red: {
            type: 'advanced',
            name: 'Red brightness',
            description: "Change the button text to the current red brightness, applies in mode='color'",
            options: [],
            callback: async (feedback, context) => {
                const currentRedBrightness = ShellyLight.getRed(0);
                return { text: currentRedBrightness }
            }
        },
        green: {
            type: 'advanced',
            name: 'Green brightness',
            description: "Change the button text to the current green brightness, applies in mode='color'",
            options: [],
            callback: async (feedback, context) => {
                const currentGreenBrightness = ShellyLight.getGreen(0);
                return { text: currentGreenBrightness }
            }
        },
        blue: {
            type: 'advanced',
            name: 'Blue brightness',
            description: "Change the button text to the current blue brightness, applies in mode='color'",
            options: [],
            callback: async (feedback, context) => {
                const currentBlueBrightness = ShellyLight.getBlue(0);
                return { text: currentBlueBrightness }
            }
        }
*//*    }
*/
/*    static feedbacks = {
        ...ShellyDuo.feedbacks,
        ...this.additionalFeedbacks
    }
*/

/*    static additionalPresets() {
    }
*/
/*    static presets() {
        *//*        let presets = this.presets();
                ...ShellyDuo.presets,
                ...this.additionalPresets
                return ShellyDuo.presets();
        *//*
        let presets = {}

        const ColorWhite = combineRgb(255, 255, 255)
        const ColorBlack = combineRgb(0, 0, 0)
        const ColorRed = combineRgb(255, 0, 0)
        const ColorGreen = combineRgb(0, 204, 0)
        const ColorYellow = combineRgb(255, 255, 0)
        const ColorBlue = combineRgb(0, 51, 204)
        const ColorPurple = combineRgb(255, 0, 255)

        presets['powerToggle'] = {
            type: 'button',
            category: 'General',
            name: 'Power Toggle',
            style: {
                text: 'on',
                size: '14',
                alignment: 'center:bottom',
                color: ColorWhite,
                bgcolor: ColorBlack,
                png64: "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/GMzLdsAAEOOaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA2LjAtYzAwMyAxMTYuYTM2MDg3MiwgMjAyMS8wOC8wMi0wOTo1NTo0NyAgICAgICAgIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBFbGVtZW50cyAxOS4wIChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAyMi0wNS0wMlQyMTo0Mjo1MiswMjowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjMtMTItMTBUMDg6MTk6MDIrMDE6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDIzLTEyLTEwVDA4OjE5OjAyKzAxOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpjYjFmMzk2NC1mYmZjLTEzNGYtOGQ3MC0xZGViZGNiZGRiMDk8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0N2VhYzcxZC05NzJjLTExZWUtYWE1OC04ODAwNmMwZDg1Yzc8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo4MWYzMmIzMS00NTI3LTA3NDctYjA0OC00NWY2ZjAwNzA0MTY8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ODFmMzJiMzEtNDUyNy0wNzQ3LWIwNDgtNDVmNmYwMDcwNDE2PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIyLTA1LTAyVDIxOjQyOjUyKzAyOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTkuMCAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjZhYjgyMzRhLWZkYWMtZTY0MC05OTkxLWE5NDhlMTQyODFlNjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMi0wNS0wMlQyMTo0NDo1MiswMjowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIEVsZW1lbnRzIDE5LjAgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo5NGEwOTFiMC04MWZjLTFkNGItYTg3YS1jN2EwZjFkNTEwZWY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMTItMTBUMDg6MTk6MDIrMDE6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBFbGVtZW50cyAxOS4wIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNvbnZlcnRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6cGFyYW1ldGVycz5mcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+ZGVyaXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6cGFyYW1ldGVycz5jb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6Y2IxZjM5NjQtZmJmYy0xMzRmLThkNzAtMWRlYmRjYmRkYjA5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIzLTEyLTEwVDA4OjE5OjAyKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgRWxlbWVudHMgMTkuMCAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDo5NGEwOTFiMC04MWZjLTFkNGItYTg3YS1jN2EwZjFkNTEwZWY8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDplZGY2ZmIxZC1kNmVjLTExZWMtYjU3OC1jNjExMzkyNWY4NGI8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo4MWYzMmIzMS00NTI3LTA3NDctYjA0OC00NWY2ZjAwNzA0MTY8L3N0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHBob3Rvc2hvcDpJQ0NQcm9maWxlPnNSR0IgSUVDNjE5NjYtMi4xPC9waG90b3Nob3A6SUNDUHJvZmlsZT4KICAgICAgICAgPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJOYW1lPmJsdXI8L3Bob3Rvc2hvcDpMYXllck5hbWU+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJUZXh0PmJsdXI8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOlRleHRMYXllcnM+CiAgICAgICAgIDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+CiAgICAgICAgICAgIDxyZGY6QmFnPgogICAgICAgICAgICAgICA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmZTgyMzAzMS1jYTE0LTExZWMtYWI3Mi1jNWU5Mjg3Yzg1ODg8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QmFnPgogICAgICAgICA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+MTE4MTEwMi8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MTE4MTEwMi8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MzwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj43MjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj43MjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+KSQJ9QAAACBjSFJNAAB6JQAAgIMAAPn/AACA6AAAdTAAAOpgAAA6lwAAF2+XqZnUAAAHOklEQVR42uybTWwcZxnHf8/7zn44a3utQvNlIFHbNEVICAUcpRVGIeUAFUIgkKgioAdOhR6AC+JQ4IzaG+JQCamlNFAJkapWU6cQ0kRUShSXiMRBSS0Mjh01tuL11653Z3fe9+Ews+u1lUrlshut55FejT0z0r7+7f/5nLEASmofaCZFkAJKAaWAUkApoBRQCigFlFoKKAWUAkoB3WsWdPPDR0c/z5EjIzz11JMUhwapu4Ca7yNyQmWlxNS/rvKHE79j/M3xrkLSTq/h4WF94YVf69ratIbhjNZqN7W8Pqt3lud1rlTW2VJd55YaeqvU0NvLDT311hkdHR3VbuxV6PA8aP/+/YyNvcLDB/YCAmIAg/OGWj0gdHmUHIhBmt+fwHp5mR98/3ucPj3euzHowIEDjL3+Mg8f2ANqQC14C2owGKwBgwc8ggdxGFEMSn9/kd/89vc8/viXOgqoYwoqFoucP/8mjxzcHcPxFrDxJsSgCHUvhI0MkSYKEhARDCAokQqV8grHv/U1Lly40FsKOn78SR45uBf1Bk1UI14w3sSeriACRhQRbX17RhRrFGMhMMqO/iF++rNne8vFisUiTz/9HVAFtYgaRE2iXUFUAMEgGENL1MZAYAVjDcYYrBGswJHRYxw9erR3AD322KMcPPiJWDVIC5Bg0MTBY/VsqKgVA0QwxmCsxMuAmIDPjRzuHUCPHhkB7wGDqEVoxh8bZyrVLS62ER0lgSdIDEviePTt49/tHUBf/sqxto8TFAE1qBdQRRMeKNg2CDG3zTlEJHa9gcGh3gGUz2VacFrJMymBtFnrtHxNkaROUzZOb029zmnvAArrYZvPSPJTXO+0fpcYDm1ZrAnIew9bYOX68r3Ti91330c3xKMK4kBAVZIg066NGE2zQPOJG3rjkisGBSpr5d5R0Nmz7yQgDJimWgATR2GNK8K2+qd1A14VpwnMOFSDCtVqDwF64423EDEYC8aCWEGSnN462uSIbKSuJKArgtdkJddP/umPvQPo0qUJrl+/SXW9Tr3hibzD4fHi8aJgFBXFJ6lMNQ7a2lSOSpLRBPWe8soi587+rXdi0NzcHK++eoqvf+Ob5HJZVH1c/BlBxGCtIQgsgQ0IggBjHdZ6MkGAFYs1zWo6bknevvRO7/ViJ0/+mWw2RxQ5nFMadUdY99RqDWq1iFrNUQvjcy5yqHfgHahrBe1mMfnSiy/23rhjamqKy/+YwHvFGIuxBiuCTfosY8AYaalKRDatpp0/f55Tp071HqBGo8GZM39p/cHWBgSZDNYGsULEEARB23VLEASbjiCcOPEKURT13jwIIJ/P89prr7N3+OOsrq4yO3uT4eGPsXv3birlMrVajT179yAo1WoVEWFwcJC1tTUGBgbw3nPo0GeYn5/vGKCODu3r9TqTk1dALPPztymXKywsLLBz5y7CWo3Kepmhfxc59NlDlBNgpVKJXC5HEARcvXqlo3A6Dsh7z9jYGKNf+CJ9fX3k83nCsIaLHPm+PlwUMTt7k0KhQH9/P9lsFhMPiNixYwfPPXeaTlvHH/tMTk6ysLDAvn37McbQ39+PiBAEAZlMlgcefIDAGrLZLEEQEAQWYyx37tzhzJm/dhxQxx8cLi4ucuWfl4miCO89zrnW8j4+tiWtpFhU3n13ghs3bvQ+oFhFVxExm6aGze4rhtOe4uN73n77bDe22h1AExMTeB+14LQmYSKYtronBhQ/3Th37tz2ARSGIc65uOdqgZDWqLU5h26er9frrKysbh9A3nvCsLYJzkZhJq2xUPN8FDnK5bXtA2h1dZWl0hKqmjw03DIwU2kL0srMzAyVSqUrgCzwy2642NJSiZGRw0QuzmaqPhlrxM2qcxGNRoP19QrPPPNDrl271hVAXXv9ZXx8nMMjIxQH+vn0pz7JWqVCqbRMoVDgoYceZO+ePayU1/jPzBwXL17s1ja79wJVJpNh965dhNUKg4U84iMW3r/F6tIiRh35XIYoDFkqLVKv17cfIICP3H8/i0srvD+/EI89ggxOIaw3qK6vU1peZqA4RKFQ6Noeu+ZizjlWV1eJoqg1KVxZWcF5B3iyuQCvG2OQbamgmf/OIGLiush7crksmSBA1beeYoRh2NH5zz0DyHtPLawBirUW9T5uWjMZMpm4UfXeEUWNTXXStlLQ/Pw8LqrTqDew1sZqqsVqajTqhLUatWqVarXatT12pQ5qr4eeeOKrTE29x9raGoE19BcKeOe4des2mVwfv3r+eaanp7sGqOMvcW61gYEBnv35L9i5a5ihwQGGikWKxSKqjh//5Edda1LbTbu99u3bpy+9fEL/fuGyTl6f1uvvTeuxY8f0XtibqKb/FX7PBukUUAooBZQCShGkgFJAKaAuWrPVSAvGu8ER0VRBH9LFtJszl3tVPWkM+j+DdKqiLeq5m4K2PaR2OO1Z7K73bqfMthXMhwG0LUB9EJim/W8AM8+zBbXVKp8AAAAASUVORK5CYII=",
                pngalignment: 'center:bottom',
            },
            steps: [{ down: [{ actionId: 'power', options: { powerAction: 'toggle' } }] }],
            feedbacks: [{ feedbackId: 'power', style: { text: 'off', color: ColorBlack, bgcolor: ColorGreen } }],
        }
        return presets

    }
*/
}

export { ShellyDuoRGBW };