import got from 'got'
import { ShellyMaster } from './shellyMaster.js';


class Shelly1 extends ShellyMaster {
    static getRelayState() {
        if (this.lastStatus == null) return null;
        return this.lastStatus.relays[0].ison;
    }
    static async toggleRelay() {
        const response = await got.get("http://" + this.targetIp + "/relay/0?turn=toggle", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOn() {
        const response = await got.get("http://" + this.targetIp + "/relay/0?turn=on", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async turnOff() {
        const response = await got.get("http://" + this.targetIp + "/relay/0?turn=off", null)
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
            options: [],
            callback: async (feedback, context) => {
                return this.getRelayState(this.lastStatus);
            }
        }

    }
}

export { Shelly1 };
