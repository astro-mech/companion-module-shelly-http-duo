import got from 'got'
import { ShellyMaster } from './shellyMaster.js';


class Shelly25Roller extends ShellyMaster {
    static getRollerPosition() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.rollers[0].current_pos;
    }
    static getPowerConsumption() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.rollers[0].power;
    }
    static getRollerState() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.rollers[0].state;
    }

    static async open() {
        const response = await got.get("http://" + this.targetIp + "/roller/0?go=open", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async close() {
        const response = await got.get("http://" + this.targetIp + "/roller/0?go=close", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async stop() {
        const response = await got.get("http://" + this.targetIp + "/roller/0?go=stop", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async goToPosition(position) {
        const response = await got.get("http://" + this.targetIp + "/roller/0?go=to_pos&roller_pos=" + position, null)
        if (response.statusCode == 200) return true;
        else return false;
    }

    static actions = {
        open: {
            name: 'Open',
            options: [],
            callback: async (action, context) => {
                this.open();
            },
        },
        close: {
            name: 'Close',
            options: [],
            callback: async (action, context) => {
                this.close();
            },
        },
        stop: {
            name: 'Stop',
            options: [],
            callback: async (action, context) => {
                this.stop();
            },
        },
        topos: {
            name: 'To Position',
            options: [
                {
                    type: 'number',
                    label: 'Roller Position (0-100%)',
                    id: 'rollerPos',
                    min: 0,
                    max: 100,
                    default: 50,
                    required: true
                }
            ],
            callback: async (action, context) => {
                this.goToPosition(action.options.rollerPos);
            },
        },
    }

    static feedbacks = {
        rollerPosition: {
            type: 'advanced',
            name: 'Roller position',
            description: "Change the button text to the current Shelly Roller position",
            options: [],
            callback: async (feedback, context) => {
                const currentRollerPos = this.getRollerPosition();
                if (currentRollerPos == null) {
                    return { text: "Pos lost" }
                }
                else {
                    return { text: currentRollerPos + " %" }
                }
            }
        },
        powerConsumption: {
            type: 'advanced',
            name: 'Power consumption',
            description: "Change the button text to the current Shelly Roller power consumption in Watts",
            options: [],
            callback: async (feedback, context) => {
                const currentPowerConsumption = this.getPowerConsumption();
                return { text: currentPowerConsumption + " W" }
            }
        },
        rollerState: {
            type: 'advanced',
            name: 'Roller state',
            description: "Change the button text to the current Shelly Roller state",
            options: [],
            callback: async (feedback, context) => {
                const currentRollerState = this.getRollerState();
                return { text: currentRollerState }
            }
        },
    }
}

class Shelly25Relay extends ShellyMaster {
    static getRelayState(relayNumber) {
        if (relayNumber < 0 || relayNumber > 1) return null;
        if (this.lastStatus == null) return null;
        return this.lastStatus.relays[relayNumber].ison;
    }
    static getPowerConsumption(relayNumber) {
        if (relayNumber < 0 || relayNumber > 1) return null;
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[relayNumber].power;
    }
    static getOverPowerState(relayNumber) {
        if (relayNumber < 0 || relayNumber > 1) return null;
        return this.lastStatus.relays[relayNumber].overpower;
    }

    static async toggleRelay(relayNumber) {
        if (relayNumber < 0 || relayNumber > 1) return false;
        const response = await got.get("http://" + this.targetIp + "/relay/" + relayNumber + "?turn=toggle", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOn(relayNumber) {
        if (relayNumber < 0 || relayNumber > 1) return false;
        const response = await got.get("http://" + this.targetIp + "/relay/" + relayNumber + "?turn=on", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOff(relayNumber) {
        if (relayNumber < 0 || relayNumber > 1) return false;
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
                    ],
                }
            ],
            callback: async (feedback, context) => {
                return this.getRelayState(feedback.options.selectedRelay);
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

export { Shelly25Roller, Shelly25Relay };