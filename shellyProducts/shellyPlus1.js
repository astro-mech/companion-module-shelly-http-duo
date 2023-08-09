import got from 'got'
import { ShellyMaster } from './shellyMaster.js';


class ShellyPlus1 extends ShellyMaster {
    static getRelayState() {
        if (this.lastStatus == null) return null;
        return this.lastStatus['switch:0'].output;
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
        }
    }
}

export { ShellyPlus1 };
