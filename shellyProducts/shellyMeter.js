import { ShellyMaster } from './shellyMaster.js';

class ShellyMeter extends ShellyMaster {
    //Consumed power [W]
    static getPowerConsumption(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[channelNumber].power;
    }
    //Total energy consumed [Wm]
    static getTotalPowerConsumption(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[channelNumber].total;
    }
    //Total energy consumed [Wh]
    static getTotalPowerConsumptionWh(channelNumber) {
        return (this.getTotalPowerConsumption(channelNumber) / 60).toFixed(2);
    }
    //Whether an overpower condition turned the channel OFF
/*    static getIsOverPower(channelNumber) {
        if (this.lastStatus == null) return null;
        return this.lastStatus.meters[channelNumber].overpower;
    }
*/
    //Get the current power information
    static getMeter(channelNumber) {
        if (this.lastStatus == null) return null;
        return (
            "pc: " +
            this.getPowerConsumption(channelNumber) +
            " W\nc1: " +
            this.lastStatus.meters[channelNumber].counters[0].toFixed(2) +
            " Wm\nc2: " +
            this.lastStatus.meters[channelNumber].counters[1].toFixed(2) +
            " Wm\nc3: " +
            this.lastStatus.meters[channelNumber].counters[2].toFixed(2) +
            " Wm\ntp: " +
            this.getTotalPowerConsumptionWh(channelNumber) +
            " Wh"
        )
    }
}

export { ShellyMeter };