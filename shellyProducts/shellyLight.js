import got from 'got';
import { ShellyMaster } from './shellyMaster.js';

class ShellyLight extends ShellyMaster {
    /*
        Common for all Shelly bulbs
    */
    //Power status, on | off | toggle
    static async power(channelNumber, powerAction) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?turn=" + powerAction, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getPower(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].ison;
    }
    //Brightness, 0..100 %
    static async brightness(channelNumber, brightness) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?brightness=" + brightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async brightnessChange(channelNumber, delta) {
        if (this.lastStatus == null) return false;
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?brightness=" + (this.lastStatus.lights[channelNumber].brightness + delta), null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getBrightness(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].brightness;
    }
    //Color temperature, 2700..6500 K
    static async temp(channelNumber, temperature) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?temp=" + temperature, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async tempChange(channelNumber, delta) {
        if (this.lastStatus == null) return false;
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?temp=" + (this.lastStatus.lights[channelNumber].temp + delta), null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getTemp(channelNumber) {     //(derived from white)
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].temp;
    }
    //One-shot transition, 0..5000 [ms]
    //*** seems not to work currently, device returns always 0 ***
/*    static async setTransition(channelNumber, transitionTime) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?transition=" + transitionTime, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getTransition(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].transition;
    }
*/

    //Get the current state of the light channel
    static getLight(channelNumber) {
        if (this.lastStatus == null) return null;
        //        return "on = " + this.getIsOn(channelNumber) + "\nbr = " + this.getBrightness(channelNumber) + " %\nwh = " + this.getWhite(channelNumber) + " %\nte = " + this.getTemp(channelNumber) + " K\ntr = " + this.getTransition(channelNumber) + " ms"
        return (
            "on: " +
            this.lastStatus.lights[channelNumber].ison +
            "\nbr: " +
            this.lastStatus.lights[channelNumber].brightness +
            " %\nwl: " +
            this.lastStatus.lights[channelNumber].white +
            " %\nct: " +
            this.lastStatus.lights[channelNumber].temp +
            " K" /*+
            " \ntr: " +
            this.lastStatus.lights[channelNumber].transition +
            " ms"*/
        )
    }

    /*
        White Shelly bulbs
    */
    //White level, 0..100 %
    static async white(channelNumber, whiteLevel) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?white=" + whiteLevel, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async whiteChange(channelNumber, delta) {
        if (this.lastStatus == null) return false;
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?white=" + (this.lastStatus.lights[channelNumber].white + delta), null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getWhite(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].white;
    }

    /*
        Color Shelly bulbs
    */

}

export { ShellyLight };
