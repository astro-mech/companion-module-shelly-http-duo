import got from 'got'
import { ShellyMaster } from './shellyMaster.js';

class ShellyPro4PM extends ShellyMaster {
    static getRelayState(relayNumber) {
        if (relayNumber < 0 || relayNumber > 3) return null;
        if (this.lastStatus == null) return null;
        return this.lastStatus['switch:' + relayNumber].output;
    }
    static getPowerConsumption(relayNumber) {
        if (relayNumber < 0 || relayNumber > 3) return null;
        if (this.lastStatus == null) return null;
        return this.lastStatus['switch:' + relayNumber].apower;
    }
    static getOverPowerState(relayNumber) {
        if (relayNumber < 0 || relayNumber > 3) return null;
        if (this.lastStatus == null) return null;
        if (this.lastStatus['switch:' + relayNumber].errors != null && this.lastStatus['switch:' + relayNumber].errors.includes('overpower')) {
            return true;
        } else return false;
    }

    static async toggleRelay(relayNumber) {
        if (relayNumber < 0 || relayNumber > 3) return false;
        const response = await got.get("http://" + this.targetIp + "/relay/" + relayNumber + "?turn=toggle", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOn(relayNumber) {
        if (relayNumber < 0 || relayNumber > 3) return false;
        const response = await got.get("http://" + this.targetIp + "/relay/" + relayNumber + "?turn=on", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOff(relayNumber) {
        if (relayNumber < 0 || relayNumber > 3) return false;
        const response = await got.get("http://" + this.targetIp + "/relay/" + relayNumber + "?turn=off", null)
        if (response.statusCode == 200) return true;
        else return false;
    }

    static actions = {
        toggle: {
            name: 'Toggle',
            options: [
                {
                    type: 'dropdown',
                    label: 'Relay',
                    id: 'selectedRelay',
                    default: 0,
                    choices: [
                        { id: 0, label: "Relay 1" },
                        { id: 1, label: "Relay 2" },
                        { id: 2, label: "Relay 3" },
                        { id: 3, label: "Relay 4" },
                    ],
                },
            ],
            callback: async (action, context) => {
                this.toggleRelay(action.options.selectedRelay);
            },
        },
        on: {
            name: 'Turn on',
            options: [
                {
                    type: 'dropdown',
                    label: 'Relay',
                    id: 'selectedRelay',
                    default: 0,
                    choices: [
                        { id: 0, label: "Relay 1" },
                        { id: 1, label: "Relay 2" },
                        { id: 2, label: "Relay 3" },
                        { id: 3, label: "Relay 4" },
                    ],
                },
            ],
            callback: async (action, context) => {
                this.turnOn(action.options.selectedRelay);
            },
        },
        off: {
            name: 'Turn off',
            options: [
                {
                    type: 'dropdown',
                    label: 'Relay',
                    id: 'selectedRelay',
                    default: 0,
                    choices: [
                        { id: 0, label: "Relay 1" },
                        { id: 1, label: "Relay 2" },
                        { id: 2, label: "Relay 3" },
                        { id: 3, label: "Relay 4" },
                    ],
                },
            ],
            callback: async (action, context) => {
                this.turnOff(action.options.selectedRelay);
            },
        },
    }
    static feedbacks = {
        relayState: {
            type: 'boolean',
            name: 'Relay State',
            description: "Change the button based on the current Shelly relay state",
            options: [
                {
                    type: 'dropdown',
                    label: 'Relay',
                    id: 'selectedRelay',
                    default: 0,
                    choices: [
                        { id: 0, label: "Relay 1" },
                        { id: 1, label: "Relay 2" },
                        { id: 2, label: "Relay 3" },
                        { id: 3, label: "Relay 4" },
                    ],
                },
                {
                    type: 'checkbox',
                    label: 'Invert',
                    tooltip: 'If checked, this feedback gets enabled when the relay is off',
                    id: 'invertRelayState',
                    default: false
                }
            ],
            callback: async (feedback, context) => {
                var currentRelayState = this.getRelayState(feedback.options.selectedRelay);
                if (feedback.options.invertRelayState == true) {
                    currentRelayState = !currentRelayState;
                }
                return currentRelayState;
            }
        },
        powerConsumption: {
            type: 'advanced',
            name: 'Power consumption',
            description: "Display the current power consumption of a defined relay",
            options: [
                {
                    type: 'dropdown',
                    label: 'Relay',
                    id: 'selectedRelay',
                    default: 0,
                    choices: [
                        { id: 0, label: "Relay 1" },
                        { id: 1, label: "Relay 2" },
                        { id: 2, label: "Relay 3" },
                        { id: 3, label: "Relay 4" },
                    ],
                },
            ],
            callback: async (feedback, context) => {
                const currentPowerConsumption = this.getPowerConsumption(feedback.options.selectedRelay);
                return { text: currentPowerConsumption + " W" }
            }
        },
        overPower: {
            type: 'boolean',
            name: 'Overpower',
            description: "Triggers when the overpower value in the shelly device is reached",
            options: [
                {
                    type: 'dropdown',
                    label: 'Relay',
                    id: 'selectedRelay',
                    default: 0,
                    choices: [
                        { id: 0, label: "Relay 1" },
                        { id: 1, label: "Relay 2" },
                        { id: 2, label: "Relay 3" },
                        { id: 3, label: "Relay 4" },
                    ],
                },
            ],
            callback: async (feedback, context) => {
                const currentOverpowerState = this.getOverPowerState(feedback.options.selectedRelay);
                return currentOverpowerState;
            }
        }
    }
}

export { ShellyPro4PM };