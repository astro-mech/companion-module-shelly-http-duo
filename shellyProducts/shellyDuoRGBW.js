import got from 'got';
import { combineRgb } from '@companion-module/base';
import { ShellyDuo, Options  } from './ShellyDuo.js'


/*export class ShellyColor extends ShellyLight {
    *//*  Attributes:
    *//*



    static getEffect() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].effect;
    }

    
    static async setEffect(effect) {
        const response = await got.get("http://" + this.targetIp + "/light/0?effect=" + effect, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
}
*/

const MODE_VALUES = ['white', 'color', 'current']
const MODE_SELECTION = ['white', 'color', 'toggle']
const MODE_ACTIONS = ['white', 'color', 'current', 'all', 'preselected']
const MODE_FEEDBACK_ACTIONS = ['white', 'color', 'current', 'preselected']
let preselectedMode = 'current'
Options.selectMode = {
    type: 'dropdown',
    label: 'Mode',
    id: 'mode',
    default: MODE_VALUES[1],
    choices: MODE_VALUES.map((label) => ({ id: label, label })),
}
Options.selectSetMode = {
    type: 'dropdown',
    label: 'Mode',
    id: 'mode',
    default: MODE_SELECTION[1],
    choices: MODE_SELECTION.map((label) => ({ id: label, label })),
}
Options.selectModeAction = {
    type: 'dropdown',
    label: 'Mode',
    id: 'mode',
    default: MODE_ACTIONS[2],
    choices: MODE_ACTIONS.map((label) => ({ id: label, label })),
}
Options.selectModeFeedbackAction = {
    type: 'dropdown',
    label: 'Mode',
    id: 'mode',
    default: MODE_FEEDBACK_ACTIONS[2],
    choices: MODE_FEEDBACK_ACTIONS.map((label) => ({ id: label, label })),
}
Options.selectColorTemperature3000 = {
    type: 'number',
        label: 'Color Temperature [K]',
            id: 'colorTemperature',
                min: 3000,
                    max: 6500,
		default: 4000,
        required: true,
            range: true
},
Options.selectRed = {
    type: 'number',
    label: 'Red Channel level',
    id: 'red',
    min: 0,
    max: 255,
	default: 128,
    required: true,
    range: true,
}
Options.selectGreen = {
    type: 'number',
    label: 'Green Channel level',
    id: 'green',
    min: 0,
    max: 255,
    default: 128,
    required: true,
    range: true,
}
Options.selectBlue = {
    type: 'number',
    label: 'Blue Channel level',
    id: 'blue',
    min: 0,
    max: 255,
    default: 128,
    required: true,
    range: true,
}
Options.selectWhite = {
    type: 'number',
    label: 'White Channel level',
    id: 'white',
    min: 0,
    max: 255,
    default: 128,
    required: true,
    range: true,
}

export class ShellyDuoRGBW extends ShellyDuo {
    
    static duoRgbwActions = {
        mode: {
            name: 'Mode',
            options: [Options.selectSetMode],
            callback: async (action, context) => {
                this.setColorMode(0, action.options.mode)
            }
        },
        preselectedMode: {
            name: 'Preselected Mode',
            options: [Options.selectModeAction],
            callback: async (action, context) => {
                if (action.options.mode != 'preselected')
                    preselectedMode = action.options.mode
            }
        },
        brightness: {
            name: 'Brightness',
            options: [Options.selectModeAction, Options.selectBrightness],
            callback: async (action, context) => {
                let newMode = action.options.mode;
                if (action.options.mode == 'preselected') newMode = preselectedMode;
                switch (newMode) {
                    case 'white': this.setWhiteBrightness(0, action.options.brightness); break;
                    case 'color': this.setColorBrightness(0, action.options.brightness); break;
                    case 'current': this.setBrightness(0, action.options.brightness); break;
                    default:
                        this.setWhiteBrightness(0, action.options.brightness);
                        this.setColorBrightness(0, action.options.brightness);
                }
            },
            learn: (action) => {
                return {
                    brightness: this.getBrightness(0)
                }
            }
        },
        brightnessChange: {
            name: 'Increase/Decrease Brightness',
            options: [Options.selectModeAction, Options.selectBrightnessDelta],
            callback: async (action, context) => {
                let newMode = action.options.mode;
                if (action.options.mode == 'preselected') newMode = (preselectedMode == 'white' ? 'white' : 'color');
                switch (newMode) {
                    case 'white': this.changeWhiteBrightness(0, action.options.brightnessDelta); break;
                    case 'color': this.changeColorBrightness(0, action.options.brightnessDelta); break;
                    case 'current': this.changeBrightness(0, action.options.brightnessDelta); break;
                    default:
                        this.changeWhiteBrightness(0, action.options.brightnessDelta);
                        this.changeColorBrightness(0, action.options.brightnessDelta);
                }
            }
        },
        light: {
            name: 'Light',
            options: [
                Options.selectPower,
                Options.selectMode,
                Options.selectColorTemperature3000,
                Options.selectRed,
                Options.selectGreen,
                Options.selectBlue,
                Options.selectWhite,
                Options.selectBrightness,
            ],
            callback: async (action, context) => {
                console.log(
                    'light > lightpower=' + action.options.power +
                    ' / mode: ' + action.options.mode +
                    ' / colorTemperature: ' + action.options.colorTemperature +
                    ' / red: ' + action.options.red +
                    ' / green: ' + action.options.green +
                    ' / blue: ' + action.options.blue +
                    ' / white: ' + action.options.white +
                    ' / brightness: ' + action.options.brightness);
                this.setColorLight(
                    0,
                    action.options.power,
                    action.options.mode,
                    action.options.colorTemperature,
                    action.options.red,
                    action.options.green,
                    action.options.blue,
                    action.options.white,
                    action.options.brightness,
                );
            },
            learn: (action) => {
                const light = this.getColorLight(0);
                //console.log('power=' + this.powerValue(light.power) + ' / mode: ' + light.mode + ' / colorTemperature: ' + light.colorTemperature + ' / brightness: ' + light.brightness);
                return {
                    power: this.powerValue(light.power),
                    mode: light.mode,
                    colorTemperature: light.colorTemperature,
                    red: light.red,
                    green: light.green,
                    blue: light.blue,
                    white: light.white,
                    brightness: light.brightness,
                }
            }
        },
        color: {
            name: 'Color',
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
/*                {
                    type: 'number',
                    label: 'Gain (0-100 %)',
                    id: 'gain',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: false,
                    range: true
                },
*/            ],
            callback: async (action, context) => {
 /*               console.log(
                    'red: ' + action.options.red +
                    ' / green: ' + action.options.green +
                    ' / blue: ' + action.options.blue +
                    ' / white: ' + action.options.white
                );
*/                this.setColor(
                    0,
                    action.options.red,
                    action.options.green,
                    action.options.blue,
                    action.options.white
                    /*, action.options.gain*/);
            },
            learn: (action) => {
                return {
                    red: this.lastStatus.lights[0].red,
                    green: this.lastStatus.lights[0].green,
                    blue: this.lastStatus.lights[0].blue,
                    white: this.lastStatus.lights[0].white,
                    //gain: this.lastStatus.lights[0].gain,
                }
            }
        },
        changeColor: {
            name: 'Increase/Decrease Color Channels',
            options: [
                {
                    type: 'number',
                    label: 'Red Delta',
                    id: 'redDelta',
                    min: -32,
                    max: 32,
                    default: 17,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'Green Delta',
                    id: 'greenDelta',
                    min: -32,
                    max: 32,
                    default: 17,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'Blue Delta',
                    id: 'blueDelta',
                    min: -32,
                    max: 32,
                    default: 17,
                    required: false,
                    range: true
                },
                {
                    type: 'number',
                    label: 'White Delta',
                    id: 'whiteDelta',
                    min: -32,
                    max: 32,
                    default: 17,
                    required: false,
                    range: true
                },
/*                {
                    type: 'number',
                    label: 'Brightness Delta',
                    id: 'deltaGain',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: false,
                    range: true
                },
*/            ],
            callback: async (action, context) => {
                this.changeColor(
                    0,
                    action.options.redDelta,
                    action.options.greenDelta,
                    action.options.blueDelta,
                    action.options.whiteDelta
                    /*, action.options.deltaGain*/)
            }
        },
/*        setEffect: {
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
*/    }
    static actions = {
        ...ShellyDuo.actions,
        ...this.duoRgbwActions
    };

    static duoRgbwFeedbacks = {
        brightness: {
            type: 'advanced',
            name: 'Brightness',
            description: 'When brightness changes, change colors of the bank',
            options: [
                Options.selectModeFeedbackAction,
                Options.selectBrightnessLowFg, Options.selectBrightnessLowBg,
                Options.selectBrightnessMiddleFg, Options.selectBrightnessMiddleBg,
                Options.selectBrightnessHighFg, Options.selectBrightnessHighBg],
            callback: (feedback, context) => {
                let newMode;
                if (feedback.options.mode == 'preselected') {
                    newMode = preselectedMode;
                } else {
                    newMode = feedback.options.mode;
                };
                let currentBrightness;
                switch (newMode) {
                    case 'white': currentBrightness = this.getWhiteBrightness(0); break;
                    case 'color': currentBrightness = this.getColorBrightness(0); break;
                    default: currentBrightness = this.getBrightness(0);
                }
                if (currentBrightness < 25) {
                    return { color: feedback.options.fgLowBrightness, bgcolor: feedback.options.bgLowBrightness }
                } else if (currentBrightness > 75) {
                    return { color: feedback.options.fgHighBrightness, bgcolor: feedback.options.bgHighBrightness }
                } else {
                    return { color: feedback.options.fgMiddleBrightness, bgcolor: feedback.options.bgMiddleBrightness }
                }

                return { color: feedback.options.fgMiddleBrightness, bgcolor: feedback.options.bgMiddleBrightness }
            }
        },
   }
    static feedbacks = {
        ...ShellyDuo.feedbacks,
        ...this.duoRgbwFeedbacks
    }

    static variables() {
        let varList = [
            { variableId: 'power', name: 'Power Status' },
            { variableId: 'powerConsumption', name: 'Power Consumption' },
            { variableId: 'totalPowerConsumption', name: 'Total Power Consumption' },
            { variableId: 'brightness', name: 'Brightness' },
            { variableId: 'colorTemperature', name: 'Color Temperature' },
//            { variableId: 'light', name: 'Light' },

            { variableId: 'mode', name: 'Configured Mode' },
            { variableId: 'color', name: 'Color' },
            { variableId: 'rgbColor', name: ' RGB Color' },
            { variableId: 'whiteColor', name: 'White Color' },
            //----
            { variableId: 'preselectedMode', name: 'Preselected Mode' },
            { variableId: 'whiteBrightness', name: 'White Brightness' },
            { variableId: 'colorBrightness', name: 'Color Brightness' },

            { variableId: 'red', name: 'Red Brightness' },
            { variableId: 'green', name: 'Green Brightness' },
            { variableId: 'blue', name: 'Blue Brightness' },
            { variableId: 'white', name: 'White Brightness' },
/*
            { variableId: 'relayState', name: 'Power State' },
            { variableId: 'powerConsumption', name: 'Power Consumption' },
            { variableId: 'totalPowerConsumption', name: 'Total Power Consumption' },
            { variableId: 'overPowerState', name: 'Over Power State' },

            { variableId: 'temp', name: 'Color Temperatur' },

            { variableId: 'colorBrightness', name: 'Color Brightness' },
            { variableId: 'effect', name: 'Currently applied effect' },
*/        ];
        return varList;
    }

    static updateVariables(instance) {
        ShellyDuo.updateVariables(instance);
        instance.setVariableValues({
            'mode': this.getColorMode(0),
            'preselectedMode': preselectedMode,
            'whiteBrightness': this.getWhiteBrightness(0),
            'colorBrightness': this.getColorBrightness(0),
            'brightness': this.getBrightness(0),
            'light': this.lightText(this.getWhiteLight(0)),

            'color': "#" + (1 << 24 | this.lastStatus.lights[0].red << 16 | this.lastStatus.lights[0].green << 8 | this.lastStatus.lights[0].blue).toString(16).slice(1) + 
                (1 << 8 | this.lastStatus.lights[0].white).toString(16).slice(1),
            'rgbColor': "#" + (1 << 24 | this.lastStatus.lights[0].red << 16 | this.lastStatus.lights[0].green << 8 | this.lastStatus.lights[0].blue).toString(16).slice(1),
            'whiteColor': "#" + (1 << 24 | this.lastStatus.lights[0].red << 16 | this.lastStatus.lights[0].green << 8 | this.lastStatus.lights[0].blue).toString(16).slice(1),

            'red': this.lastStatus.lights[0].red,
            'green': this.lastStatus.lights[0].green,
            'blue': this.lastStatus.lights[0].blue,
            'white': this.lastStatus.lights[0].white,
        })
    }


        
/*
            {
//            ...this.updateVariables(instance),
            //--------------------
*//*            'preselectedMode': preselectedMode,
            'whiteBrightness': this.getWhiteBrightness(0),
            'colorBrightness': this.getColorBrightness(0),
            'brightness': this.getBrightness(0),
            'colorTemperature': this.getColorTemperature(),
*//*
*//*            'relayState': this.getRelayState(0),
            'powerConsumption': this.getPowerConsumption(0),
            'totalPowerConsumption': this.getTotalPowerConsumption(0),
            'overPowerState': this.getOverPowerState(0),


            'color': "#" + (1 << 24 | this.lastStatus.lights[0].red << 16 | this.lastStatus.lights[0].green << 8 | this.lastStatus.lights[0].blue).toString(16).slice(1),
            'red': this.lastStatus.lights[0].red,
            'green': this.lastStatus.lights[0].green,
            'blue': this.lastStatus.lights[0].blue,
            'white': this.lastStatus.lights[0].white,
            'effect': this.getEffect(0),
*//*        })
    }
 */


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
                const currentMode = ShellyLight.getColorMode(0);
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