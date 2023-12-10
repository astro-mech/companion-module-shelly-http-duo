import got from 'got'
import { ShellyMaster } from './shellyMaster.js';

// astro-mech: new common class for shelly lights
class ShellyLight extends ShellyMaster {
    //Command to turn on
    static async turnOn(channelNumber) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?turn=on", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    //Command to turn off
    static async turnOff(channelNumber) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?turn=off", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    //Command to toggle
    static async turnToggle(channelNumber) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?turn=toggle", null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    //Whether the channel is turned ON or OFF
    static getIsOn(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].ison;
    }
    //Brightness, 0..100
    static async setBrightness(channelNumber, brightness) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?brightness=" + brightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getBrightness(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].brightness;
    }
    //White level, 0..100
    static async setWhite(channelNumber, whiteLevel) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?white=" + whiteLevel, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getWhite(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].white;
    }
    //Color temperature, 2700..6500K (derived from white)
    static async setTemp(channelNumber, temp) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?temp=" + temp, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getTemp(channelNumber) {     //(derived from white)
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].temp;
    }
    //One-shot transition, 0..5000 [ms]
    static async setTransition(channelNumber, transitionTime) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?transition=" + transitionTime, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getTransition(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].transition;
    }
}

export { ShellyLight };