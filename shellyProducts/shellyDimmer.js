import got from 'got'
import { ShellyMaster } from './shellyMaster.js';


class ShellyDimmer extends ShellyMaster {
    static getRelayState() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].ison;
    }
    static getBrightness() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].brightness;
    }
    static getPowerConsumption() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[0].power;
    }

    static async toggleRelay() {
        const response = await got.get("http://" + this.targetIp + "/light/0?turn=toggle", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOn() {
        const response = await got.get("http://" + this.targetIp + "/light/0?turn=on", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOff() {
        const response = await got.get("http://" + this.targetIp + "/light/0?turn=off", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async setBrightness(brightness) {
        const response = await got.get("http://" + this.targetIp + "/light/0?brightness=" + brightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async dimUp(step) {
        const response = await got.get("http://" + this.targetIp + "/light/0?dim=up&step=" + step, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async dimDown(step) {
        const response = await got.get("http://" + this.targetIp + "/light/0?dim=down&step=" + step, null)
        if (response.statusCode == 200) return true;
        else return false;
    }

    static actions = {
        toggle: {
            name: 'Toggle',
            options: [],
            callback: async (action, context) => {
                this.toggleRelay();
            },
        },
        on: {
            name: 'Turn on',
            options: [],
            callback: async (action, context) => {
                this.turnOn();
            },
        },
        off: {
            name: 'Turn off',
            options: [],
            callback: async (action, context) => {
                this.turnOff();
            },
        },
        setBrightness: {
            name: 'Set Brightness',
            options: [
                {
                    type: 'number',
                    label: 'Brightness (1-100%)',
                    id: 'brightness',
                    min: 1,
                    max: 100,
                    default: 50,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.setBrightness(action.options.brightness);
            },
        },
        dimUp: {
            name: 'Dim up',
            options: [
                {
                    type: 'number',
                    label: 'Dim up by (0-100%)',
                    id: 'percentage',
                    min: 0,
                    max: 100,
                    default: 10,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.dimUp(action.options.percentage);
            },
        },
        dimDown: {
            name: 'Dim down',
            options: [
                {
                    type: 'number',
                    label: 'Dim down by (0-100%)',
                    id: 'percentage',
                    min: 0,
                    max: 100,
                    default: 10,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.dimDown(action.options.percentage);
            },
        },
    }
    static feedbacks = {
        relayState: {
            type: 'boolean',
            name: 'Relay State',
            description: "Change the button based on the current Shelly relay state",
            options: [],
            callback: async (feedback, context) => {
                return this.getRelayState();
            }
        },
        dimValue: {
            type: 'advanced',
            name: 'Dimmer Brightness',
            description: "Change the button text to the current dimmer value",
            options: [],
            callback: async (feedback, context) => {
                const currentBrightness = this.getBrightness();
                return { text: currentBrightness + "%" }
            }
        },
        powerConsumption: {
            type: 'advanced',
            name: 'Power consumption',
            description: "Change the button text to the current dimmer power consumption",
            options: [],
            callback: async (feedback, context) => {
                const currentPowerConsumption = this.getPowerConsumption();
                return { text: currentPowerConsumption + " W" }
            }
        },
    }
}

export { ShellyDimmer };
