import got from 'got'
import { ShellyMaster } from './shellyMaster.js';


class ShellyPlus1PM extends ShellyMaster {
    static getRelayState() {
        if (this.lastStatus == null) return null;
        return this.lastStatus['switch:0'].output;
    }
    static getPowerConsumption() {
        if (this.lastStatus == null) return null;
        return this.lastStatus['switch:0'].apower;
    }
    static getOverPowerState() {
        if (this.lastStatus == null) return null;
        if (this.lastStatus['switch:0'].errors != null && this.lastStatus['switch:0'].errors.includes('overpower')) {
            return true;
        } else return false;
    }


    static async toggleRelay() {
        const response = await got.get("http://" + this.targetIp + "/relay/0?turn=toggle")
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOn() {
        const response = await got.get("http://" + this.targetIp + "/relay/0?turn=on")
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOff() {
        const response = await got.get("http://" + this.targetIp + "/relay/0?turn=off")
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
    }

    static feedbacks = {
        relayState: {
            type: 'boolean',
            name: 'Relay State',
            description: "Change the button based on the current Shelly relay state",
            options: [
                {
                    type: 'checkbox',
                    label: 'Invert',
                    tooltip: 'If checked, this feedback gets enabled when the relay is off',
                    id: 'invertRelayState',
                    default: false
                }
            ],
            callback: async (feedback, context) => {
                var currentRelayState = this.getRelayState();
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
            options: [],
            callback: async (feedback, context) => {
                const currentPowerConsumption = this.getPowerConsumption();
                return { text: currentPowerConsumption + " W" }
            }
        },
        overPower: {
            type: 'boolean',
            name: 'Overpower',
            description: "Triggers when the overpower value in the shelly device is reached",
            options: [],
            callback: async (feedback, context) => {
                const currentOverpowerState = this.getOverPowerState();
                return currentOverpowerState;
            }
        }
    }
}

export { ShellyPlus1PM };
