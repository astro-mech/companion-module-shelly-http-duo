import got from 'got'
import { ShellyMaster } from './shellyMaster.js';

class ShellyRGBW2Color extends ShellyMaster {
    static getRelayState() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].ison;
    }
    static getPowerConsumption() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[0].power;
    }
    static getOverPowerState() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[0].overpower;
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

    static async toggleRelay() {
        const response = await got.get("http://" + this.targetIp + "/color/0?turn=toggle", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOn() {
        const response = await got.get("http://" + this.targetIp + "/color/0?turn=on", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOff() {
        const response = await got.get("http://" + this.targetIp + "/color/0?turn=off", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async setColor(red, green, blue, white, gain) {
        const response = await got.get("http://" + this.targetIp + "/color/0?red=" + red + "&green=" + green + "&blue=" + blue + "&white=" + white + "&gain=" + gain, null)
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
                    required: true
                },
                {
                    type: 'number',
                    label: 'Green (0-255)',
                    id: 'green',
                    min: 0,
                    max: 255,
                    default: 128,
                    required: true
                },
                {
                    type: 'number',
                    label: 'Blue (0-255)',
                    id: 'blue',
                    min: 0,
                    max: 255,
                    default: 128,
                    required: true
                },
                {
                    type: 'number',
                    label: 'White (0-255)',
                    id: 'white',
                    min: 0,
                    max: 255,
                    default: 128,
                    required: true
                },
                {
                    type: 'number',
                    label: 'Gain (0-100)',
                    id: 'gain',
                    min: 0,
                    max: 100,
                    default: 100,
                    required: true
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
                const currentBrightness = this.getColorBrightness();
                return { text: currentBrightness + "%" }
            }
        },
        powerConsumption: {
            type: 'advanced',
            name: 'Power consumption',
            description: "Change the button text to the current power consumption in Watts",
            options: [],
            callback: async (feedback, context) => {
                const currentPowerConsumption = this.getPowerConsumption();
                return { text: currentPowerConsumption + " W" }
            }
        },
    }
}

class ShellyRGBW2White extends ShellyMaster {
    static getRelayState(relayNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[relayNumber].ison;
    }
    static getPowerConsumption(relayNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[relayNumber].power;
    }
    static getOverPowerState(relayNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[relayNumber].overpower;
    }
    static getBrightness(relayNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[relayNumber].brightness;
    }
    static getColor(relayNumber) {
        if (this.lastStatus == null) return null;
        return {
            red: this.lastStatus.lights[relayNumber].red,
            green: this.lastStatus.lights[relayNumber].green,
            blue: this.lastStatus.lights[relayNumber].blue,
            white: this.lastStatus.lights[relayNumber].white,
        }
    }

    static async toggleRelay(relayNumber) {
        const response = await got.get("http://" + this.targetIp + "/white/" + relayNumber + "?turn=toggle", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOn(relayNumber) {
        const response = await got.get("http://" + this.targetIp + "/white/" + relayNumber + "?turn=on", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOff(relayNumber) {
        const response = await got.get("http://" + this.targetIp + "/white/" + relayNumber + "?turn=off", null)
        if (response.statusCode == 200) return true;
        else return false;
    }

    static async setBrightness(relayNumber, brightness) {
        const response = await got.get("http://" + this.targetIp + "/white/" + relayNumber + "?brightness=" + brightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }

    static actions = {
        toggle: {
            name: 'Toggle',
            options: [
                {
                    type: 'dropdown',
                    label: 'Channel',
                    id: 'selectedChannel',
                    default: 0,
                    choices: [
                        { id: 0, label: "Channel 1" },
                        { id: 1, label: "Channel 2" },
                        { id: 2, label: "Channel 3" },
                        { id: 3, label: "Channel 4" },
                    ],
                },
            ],
            callback: async (action, context) => {
                this.toggleRelay(action.options.selectedChannel);
            },
        },
        on: {
            name: 'On',
            options: [
                {
                    type: 'dropdown',
                    label: 'Channel',
                    id: 'selectedChannel',
                    default: 0,
                    choices: [
                        { id: 0, label: "Channel 1" },
                        { id: 1, label: "Channel 2" },
                        { id: 2, label: "Channel 3" },
                        { id: 3, label: "Channel 4" },
                    ],
                },
            ],
            callback: async (action, context) => {
                this.turnOn(action.options.selectedChannel);
            },
        },
        off: {
            name: 'Off',
            options: [
                {
                    type: 'dropdown',
                    label: 'Channel',
                    id: 'selectedChannel',
                    default: 0,
                    choices: [
                        { id: 0, label: "Channel 1" },
                        { id: 1, label: "Channel 2" },
                        { id: 2, label: "Channel 3" },
                        { id: 3, label: "Channel 4" },
                    ],
                },
            ],
            callback: async (action, context) => {
                this.turnOff(action.options.selectedChannel);
            },
        },
        setBrightness: {
            name: 'Set Brightness',
            options: [
                {
                    type: 'dropdown',
                    label: 'Channel',
                    id: 'selectedChannel',
                    default: 0,
                    choices: [
                        { id: 0, label: "Channel 1" },
                        { id: 1, label: "Channel 2" },
                        { id: 2, label: "Channel 3" },
                        { id: 3, label: "Channel 4" },
                    ],
                    required: true
                },
                {
                    type: 'number',
                    label: 'Brightness (1-100%)',
                    id: 'brightness',
                    min: 1,
                    max: 100,
                    default: 50,
                    required: true
                },
            ],
            callback: async (action, context) => {
                this.setBrightness(action.options.selectedChannel, action.options.brightness);
            },
        }
    }

    static feedbacks = {
        relayState: {
            type: 'boolean',
            name: 'Relay State',
            description: "Change the button based on the current Shelly relay state",
            options: [
                {
                    type: 'dropdown',
                    label: 'Channel',
                    id: 'selectedChannel',
                    default: 0,
                    choices: [
                        { id: 0, label: "Channel 1" },
                        { id: 1, label: "Channel 2" },
                        { id: 2, label: "Channel 3" },
                        { id: 3, label: "Channel 4" },
                    ],
                }

            ],
            callback: async (feedback, context) => {
                return this.getRelayState(feedback.options.selectedChannel);
            }
        },
        dimValue: {
            type: 'advanced',
            name: 'Dimmer Brightness',
            description: "Change the button text to the current dimmer value",
            options: [
                {
                    type: 'dropdown',
                    label: 'Channel',
                    id: 'selectedChannel',
                    default: 0,
                    choices: [
                        { id: 0, label: "Channel 1" },
                        { id: 1, label: "Channel 2" },
                        { id: 2, label: "Channel 3" },
                        { id: 3, label: "Channel 4" },
                    ],
                },
            ],
            callback: async (feedback, context) => {
                const currentBrightness = this.getBrightness(feedback.options.selectedChannel);
                return { text: currentBrightness + "%" }
            }
        },
        powerConsumption: {
            type: 'advanced',
            name: 'Power consumption',
            description: "Change the button text to the current power consumption in Watts",
            options: [
                {
                    type: 'dropdown',
                    label: 'Channel',
                    id: 'selectedChannel',
                    default: 0,
                    choices: [
                        { id: 0, label: "Channel 1" },
                        { id: 1, label: "Channel 2" },
                        { id: 2, label: "Channel 3" },
                        { id: 3, label: "Channel 4" },
                    ],
                },
            ],
            callback: async (feedback, context) => {
                const currentPowerConsumption = this.getPowerConsumption(feedback.options.selectedChannel);
                return { text: currentPowerConsumption + " W" }
            }
        },
    }
}

export { ShellyRGBW2Color, ShellyRGBW2White };