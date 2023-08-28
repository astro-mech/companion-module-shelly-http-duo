import got from 'got'
import { ShellyMaster } from './shellyMaster.js';


class ShellyPro3 extends ShellyMaster {

    static getRelayState(relayNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus['switch:' + relayNumber].output;
    }

    static async toggleRelay(relayNumber) {
        if (relayNumber < 0 || relayNumber > 2) return false;
        const response = await got.get("http://" + this.targetIp + "/relay/" + relayNumber + "?turn=toggle", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOn(relayNumber) {
        if (relayNumber < 0 || relayNumber > 2) return false;
        const response = await got.get("http://" + this.targetIp + "/relay/" + relayNumber + "?turn=on", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOff(relayNumber) {
        if (relayNumber < 0 || relayNumber > 2) return false;
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
                    ],
                },
            ],
            callback: async (action, context) => {
                this.turnOnRelay(action.options.selectedRelay);
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
                    ],
                },
            ],
            callback: async (action, context) => {
                this.turnOffRelay(action.options.selectedRelay);
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
                    ],
                }
            ],
            callback: async (feedback, context) => {
                return this.getRelayState(feedback.options.selectedRelay);
            }
        }
    }
}

export { ShellyPro3 };