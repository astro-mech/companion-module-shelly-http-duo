import { combineRgb } from '@companion-module/base'
import { ShellyMaster } from './shellyMaster.js';
import { ShellyLight } from './shellyLight.js';
import { ShellyMeter } from './shellyMeter.js';

class ShellyDuo extends ShellyMaster {
    static actions = {
        power: {
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
                ShellyLight.power(0, action.options.powerAction);
            }
        },
        brightness: {
            name: 'Brightness',
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
                ShellyLight.brightness(0, action.options.brightness);
            }
        },
        brightnessChange: {
            name: 'Brightness Increase/Decrease (+25 % to -25 %)',
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
                ShellyLight.brightnessChange(0, action.options.delta);
            }
        },
        white: {
            name: 'White level',
            options: [
                {
                    type: 'number',
                    label: 'White Level (0-100 %)',
                    id: 'white',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: true,
                    range: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.white(0, action.options.white);
            }
        },
        whiteChange: {
            name: 'White level Increase/Decrease (+25 % to -25 %)',
            options: [
                {
                    type: 'number',
                    label: 'White Level +/- n %',
                    id: 'delta',
                    min: -25,
                    max: 25,
                    default: 10,
                    required: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.whiteChange(0, action.options.delta);
            }
        },
        colorTemp: {
            name: 'Color Temperature',
            options: [
                {
                    type: 'number',
                    label: 'Color Temperature (2700..6500 K)',
                    id: 'colorTemp',
                    min: 2700,
                    max: 6500,
                    default: 4600,
                    required: true,
                    range: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.temp(0, action.options.colorTemp);
            }
        },
        colorTempChange: {
            name: 'Color Temperature Increase/Decrease (+200 K to -200 K)',
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
                ShellyLight.tempChange(0, action.options.delta);
            }
        },
    }

    static feedbacks = {
        powerStatus: {
            type: 'advanced',
            name: 'Power Status',
            description: 'When light power status changes, change colors of the bank',
            options: [
                {
                    type: 'dropdown',
                    label: 'Power Status',
                    id: 'powerStatus',
                    choices: [
                        { id: 'on', label: 'on' },
                        { id: 'off', label: 'off' },
                    ],
                    default: 'on',
                },
                {
                    type: 'colorpicker',
                    label: 'Foreground Color',
                    id: 'fg',
                    default: combineRgb(0, 0, 0)
                },
                {
                    type: 'colorpicker',
                    label: 'Background Color',
                    id: 'bg',
                    default: combineRgb(0, 255, 0)
                },
            ],
            callback: async (feedback, context) => {
                if (ShellyLight.getPower(0) && feedback.options.powerStatus == 'on') {
                    return { color: feedback.options.fg, bgcolor: feedback.options.bg/*, text: feedback.options.tx*/ }
                }
                else if (!ShellyLight.getPower(0) && feedback.options.powerStatus == 'off') {
                    return { color: feedback.options.fg, bgcolor: feedback.options.bg/*, text: feedback.options.tx*/ }
                }
            }
        },
        power: {
            type: 'boolean',
            name: 'Power',
            description: "Whether power is on or off",
            options: [],
            callback: async (feedback, context) => {
                return ShellyLight.getPower(0);
            }
        },
        light: {
            type: 'advanced',
            name: 'Light',
            description: "Change the button text to the current state of the light channel",
            options: [],
            callback: async (feedback, context) => {
                const currentStatus = ShellyLight.getLight(0);
                return { text: currentStatus }
            }
        },
        meter: {
            type: 'advanced',
            name: 'Meter',
            description: "Change the button text to the current power information",
            options: [],
            callback: async (feedback, context) => {
                const currentMeters = ShellyMeter.getMeter(0);
                return { text: currentMeters }
            }
        },
    }

    static variables() {
        var varList = [
            { variableId: 'power', name: 'Power Status' },
            { variableId: 'brightness', name: 'Brightness' },
            { variableId: 'white', name: 'White Level' },
            { variableId: 'temp', name: 'Color Temperatur' }
        ];
        return varList;
    }

    static updateVariables(instance) {
        instance.setVariableValues({
            'power': ShellyLight.getPower(0),
            'brightness': ShellyLight.getBrightness(0),
            'white': ShellyLight.getWhite(0),
            'temp': ShellyLight.getTemp(0)
        })
    }
}

export { ShellyDuo };