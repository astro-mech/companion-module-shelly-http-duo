import got from 'got'
import { ShellyMaster } from './shellyMaster.js';
import { ShellyLight } from './shellyLight.js';
import { ShellyMeter } from './shellyMeter.js';

// astro-mech: new class for shelly duo
class ShellyDuo extends ShellyMaster {
    static actions = {
        on: {
            name: 'Turn on',
            options: [],
            callback: async (action, context) => {
                ShellyLight.turnOn(0);
            }
        },
        off: {
            name: 'Turn off',
            options: [],
            callback: async (action, context) => {
                ShellyLight.turnOff(0);
            }
        },
        toggle: {
            name: 'Toggle',
            options: [],
            callback: async (action, context) => {
                ShellyLight.turnToggle(0);
            }
        },
        setBrightness: {
            name: 'Set brightness',
            options: [
                {
                    type: 'number',
                    label: 'Brightness (0-100 %)',
                    id: 'brightness',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.setBrightness(0, action.options.brightness);
            }
        },
        setWhite: {
            name: 'Set white level',
            options: [
                {
                    type: 'number',
                    label: 'White level (0-100 %)',
                    id: 'white',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.setWhite(0, action.options.white);
            }
        },
        setTemp: {
            name: 'Set color temperature ',
            options: [
                {
                    type: 'number',
                    label: 'Color temperature (2700-6500 K)',
                    id: 'temp',
                    min: 2700,
                    max: 6500,
                    default: 4600,
                    required: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.setTemp(0, action.options.temp);
            }
        },
        /* does nothing !?
        setTransition: {
            name: 'Set transition time ',
            options: [
                {
                    type: 'number',
                    label: 'Transition time (0-5000 ms)',
                    id: 'transition',
                    min: 0,
                    max: 5000,
                    default: 1000,
                    required: true
                }
            ],
            callback: async (action, context) => {
                ShellyLight.setTransition(0, action.options.transition);
            }
        }
        */
    }
    
    static feedbacks = {
        isOn: {
            type: 'boolean',
            name: 'Is on',
            description: "Whether the channel is turned ON or OFF",
            options: [],
            callback: async (feedback, context) => {
                return ShellyLight.getIsOn(0);
            }
        },
        powerConsumption: {
            type: 'advanced',
            name: 'Power consumption',
            description: "Change the button text to the current power consumption",
            options: [],
            callback: async (feedback, context) => {
                const currentPowerConsumption = ShellyMeter.getPowerConsumption(0);
                return { text: currentPowerConsumption + " W" }
            }
        },
        totalPowerConsumption: {
            type: 'advanced',
            name: 'Total power consumption',
            description: "Change the button text to the total power consumption",
            options: [],
            callback: async (feedback, context) => {
                const currentTotalPowerConsumption = ShellyMeter.getTotalPowerConsumptionWh(0);
                return { text: currentTotalPowerConsumption + " Wh" }
            }
        },
        brightness: {
            type: 'advanced',
            name: 'Brightness',
            description: "Change the button text to the current brightness",
            options: [],
            callback: async (feedback, context) => {
                const currentBrightness = ShellyLight.getBrightness(0);
                return { text: currentBrightness + " %" }
            }
        },
        whiteLevel: {
            type: 'advanced',
            name: 'White level',
            description: "Change the button text to the current white level",
            options: [],
            callback: async (feedback, context) => {
                const currentWhiteLevel = ShellyLight.getWhite(0);
                return { text: currentWhiteLevel + " %" }
            }
        },
        whiteTemp: {
            type: 'advanced',
            name: 'Color temperature',
            description: "Change the button text to the current color temperature",
            options: [],
            callback: async (feedback, context) => {
                const currentTemp = ShellyLight.getTemp(0);
                return { text: currentTemp + " K" }
            }
        },
        /* does nothing !?
        transition: {
            type: 'advanced',
            name: 'Transition time',
            description: "Change the button text to the current transition time",
            options: [],
            callback: async (feedback, context) => {
                const currentTransitionTime = ShellyLight.getTransition(0);
                return { text: currentTransitionTime + " ms" }
            }
        }
        */
    }
}

export { ShellyDuo };