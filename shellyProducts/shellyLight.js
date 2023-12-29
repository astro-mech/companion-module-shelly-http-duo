import got from 'got';
import { combineRgb } from '@companion-module/base';
import { ShellyMaster } from './shellyMaster.js'

export const Colors = {
    white: combineRgb(255, 255, 255),
    black: combineRgb(0, 0, 0),
    red: combineRgb(255, 0, 0),          //STOP,HALT,BREAK,KILL and similar terminating functions + Active program on switchers
    green: combineRgb(0, 204, 0),        //TAKE,GO,PLAY, and similar starting functions. + Active Preview on switchers
    yellow: combineRgb(255, 255, 0),     //PAUSE,HOLD,WAIT and similar holding functions + active Keyer on switchers
    blue: combineRgb(0, 51, 204),        //Active AUX on switchers
    purple: combineRgb(255, 0, 255),     //Presets that need user configuration after they have been draged onto a button
    warmWhite: 0xEFEBD8,
    neutralWhite: 0xFCFAF6,
    coldWhite: 0xE3E4ED,
}


export class ShellyLight extends ShellyMaster {
    /*  Attributes:
        ison 	    bool 	Whether the channel is turned ON or OFF
        power       number 	Consumed power, W
        total       number 	Total energy consumed in Watt-minute

        brightness 	number 	Brightness, 0..100
        white       number 	White level, 0..100
        temp 	    number 	Color temperature, 2700/3000..6500K

        mode 	    string 	Currently configured mode
        red 	    number 	Red brightness, 0..255, applies in mode="color"
        green 	    number 	Green brightness, 0..255, applies in mode="color"
        blue 	    number 	Blue brightness, 0..255, applies in mode="color"
        white 	    number 	White brightness, 0..255, applies in mode="color"
        gain 	    number 	Gain for all channels, 0..100, applies in mode="color"
        effect 	    number 	Currently applied effect, description
    */
   // Power getter and setter
    static getPowerState(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[0].ison;
    }
    static async setPowerState(channelNumber, action) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?turn=" + action, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getPowerConsumption(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[0].power;
    }
    static getTotalPowerConsumption(channelNumber) {
        if (this.lastStatus == null) return null;
        return (this.lastStatus.meters[0].total / 60).toFixed(2);
    }

    // Helper functions
    static valueInRange(value, minValue, maxValue) {
        return Math.max(Math.min(value, maxValue), minValue)
    }

    // Brightness, color temperature and light getter and setter (white bulbs)
    static getWhiteBrightness(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].brightness;
    }
    static async setWhiteBrightness(channelNumber, brightness) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?brightness=" + brightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async changeWhiteBrightness(channelNumber, delta) {
        if (this.lastStatus == null) return false;
        let newBrightness = this.valueInRange(this.lastStatus.lights[channelNumber].brightness + delta, 0, 100);
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?brightness=" + newBrightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getColorTemperature(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].temp;
    }
    static async setColorTemperature(channelNumber, colorTemperature) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?temp=" + colorTemperature, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async changeColorTemperature(channelNumber, delta, minColorTemp, maxColorTemp) {
        if (this.lastStatus == null) return false;
        let newColorTemp = this.valueInRange(this.lastStatus.lights[channelNumber].temp + delta, minColorTemp, maxColorTemp);
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?temp=" + newColorTemp, null)
        if (response.statusCode == 200) return true;
        else return false;
    }

    // Light getter and setter (white bulbs)
    static getWhiteLight(channelNumber) {
        if (this.lastStatus == null) return null;
        return {
            power: this.getPowerState(channelNumber),
            colorTemperature: this.getColorTemperature(channelNumber),
            brightness: this.getWhiteBrightness(channelNumber),
        }
    }
    static async setWhiteLight(channelNumber, power, colorTemperature, brightness) {
        const response = await got.get("http://" + this.targetIp +
            "/light/" + channelNumber +
            "?turn=" + power +
            "&temp=" + ((colorTemperature != '') ? colorTemperature : this.getColorTemperature(channelNumber)) +
            "&brightness=" + ((brightness != '') ? brightness : this.getBrightness(channelNumber))
            , null)
        if (response.statusCode == 200) return true;
        else return false;
    }

    // Mode, Brightness and color temperature getter and setter (color bulbs)
    static getColorMode(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].mode;
    }
    static async setColorMode(channelNumber, mode) {
        let newMode;
        if (mode == 'toggle') {
            if (this.getColorMode(channelNumber) == 'white') {
                newMode = 'color'
            } else {
                newMode = 'white'
            }
        } else {
            newMode = mode
        }
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?mode=" + newMode, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getColorBrightness(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.lights[channelNumber].gain;
    }
    static async setColorBrightness(channelNumber, brightness) {
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?gain=" + brightness, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async changeColorBrightness(channelNumber, delta) {
        if (this.lastStatus == null) return false;
        const newGain = Math.max(Math.min(this.lastStatus.lights[0].gain + delta, 100), 0);
        const response = await got.get("http://" + this.targetIp + "/light/" + channelNumber + "?gain=" + newGain, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static getBrightness(channelNumber) {
        if (this.lastStatus == null) return false;
        if (this.getColorMode(channelNumber) == 'color') {
            return this.getColorBrightness(channelNumber)
        } else {
            return this.getWhiteBrightness(channelNumber)
        }
    }
    static async setBrightness(channelNumber, brightness) {
        if (this.lastStatus == null) return false;
        if (this.getColorMode(channelNumber) == 'color') {
            return this.setColorBrightness(channelNumber, brightness)
        } else {
            return this.setWhiteBrightness(channelNumber, brightness)
        }
    }
    static async changeBrightness(channelNumber, delta) {
        if (this.lastStatus == null) return false;
        if (this.getColorMode(channelNumber) == 'color') {
            return this.changeColorBrightness(channelNumber, delta)
        } else {
            return this.changeWhiteBrightness(channelNumber, delta)
        }
    }

    // Color getter and setter (color bulbs)
    static getColor(channelNumber) {
        if (this.lastStatus == null) return null;
        return {
            red: this.lastStatus.lights[channelNumber].red,
            green: this.lastStatus.lights[channelNumber].green,
            blue: this.lastStatus.lights[channelNumber].blue,
            white: this.lastStatus.lights[channelNumber].white,
            //brightness: this.lastStatus.lights[channelNumber].brightness,
        }
    }
    static async setColor(channelNumber, red, green, blue, white/*, gain*/) {
        const response = await got.get("http://" + this.targetIp + "/color/" + channelNumber + "?red=" + red + "&green=" + green + "&blue=" + blue + "&white=" + white/* + "&gain=" + gain*/, null)
        if (response.statusCode == 200) return true;
        else return false;
    }
    static async changeColor(channelNumber, deltaRed, deltaGreen, deltaBlue, deltaWhite/*, deltaGain*/) {
        if (this.lastStatus == null) return false;
        const red = Math.max(Math.min(this.lastStatus.lights[channelNumber].red + deltaRed, 255), 0);
        const green = Math.max(Math.min(this.lastStatus.lights[channelNumber].green + deltaGreen, 255), 0);
        const blue = Math.max(Math.min(this.lastStatus.lights[channelNumber].blue + deltaBlue, 255), 0);
        const white = Math.max(Math.min(this.lastStatus.lights[channelNumber].white + deltaWhite, 255), 0);
        //const gain = Math.max(Math.min(this.lastStatus.lights[channelNumber].gain + deltaGain, 100), 0);
        const response = await got.get("http://" + this.targetIp + "/color/" + channelNumber + "?red=" + red + "&green=" + green + "&blue=" + blue + "&white=" + white/* + "&gain=" + gain*/, null)
        if (response.statusCode == 200) return true;
        else return false;
    }

    // Light getter and setter (color bulbs)
    static getColorLight(channelNumber) {
        if (this.lastStatus == null) return null;
        const varColor = this.getColor(channelNumber);
        return {
            power: this.getPowerState(channelNumber),
            mode: this.getColorMode(channelNumber),
            colorTemperature: this.getColorTemperature(channelNumber),
            red: varColor.red,
            green: varColor.green,
            blue: varColor.blue,
            white: varColor.white,
            brightness: this.getBrightness(channelNumber),
        }
    }
    static async setColorLight(channelNumber, power, mode, colorTemperature, red, green, blue, white, brightness) {
        console.log(
            'getColorLight() > lightpower=' + power +
            ' / mode: ' + mode +
            ' / colorTemperature: ' + colorTemperature +
            ' / red: ' + red +
            ' / green: ' + green +
            ' / blue: ' + blue +
            ' / white: ' + white +
            ' / brightness: ' + brightness);
        const feedUrl =
            "http://" + this.targetIp +
            "/light/" + channelNumber +
            "?turn=" + power +
            "&mode=" + mode +
            "&temp=" + ((colorTemperature >= 0) ? colorTemperature : this.getColorTemperature(channelNumber)) +
            "&red=" + ((red >= 0) ? red : this.getColor(channelNumber).red) +
            "&green=" + ((green >= 0) ? green : this.getColor(channelNumber).green) +
            "&blue=" + ((blue >= 0) ? blue : this.getColor(channelNumber).blue) +
            "&white=" + ((white >= 0) ? white : this.getColor(channelNumber).white) +
            "&brightness=" + ((brightness >= 0) ? brightness : this.getBrightness(channelNumber));
        console.log('feedUrl > ' + feedUrl);
        const response = await got.get(feedUrl, null);
        console.log(
            'getColorLight() > lightpower=' + power +
            ' / mode: ' + mode +
            ' / colorTemperature: ' + colorTemperature +
            ' / red: ' + red +
            ' / green: ' + green +
            ' / blue: ' + blue +
            ' / white: ' + white +
            ' / brightness: ' + brightness +
            ' / response: ' + response.statusCode);
        if (response.statusCode == 200) return true;
        else return false;
    }

}
