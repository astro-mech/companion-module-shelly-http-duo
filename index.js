import { InstanceBase, runEntrypoint, InstanceStatus, combineRgb } from '@companion-module/base'
import { configFields } from './config.js'
import { upgradeScripts } from './upgrade.js'
import { Shelly1 } from './shellyProducts/shelly1.js';
import { ShellyPlus1PM } from './shellyProducts/ShellyPlus1PM.js';
import { ShellyPlus1 } from './shellyProducts/shellyPlus1.js';
import { ShellyPlus2PMRelay, ShellyPlus2PMRoller } from './shellyProducts/shellyPlus2PM.js';
import { ShellyRGBW2Color } from './shellyProducts/shellyRGBW2.js';
import { ShellyRGBW2White } from './shellyProducts/shellyRGBW2.js';
import { ShellyDimmer } from './shellyProducts/shellyDimmer.js';
import { ShellyPro1 } from './shellyProducts/shellyPro1.js';
import { ShellyPro1PM } from './shellyProducts/shellyPro1PM.js';
import { ShellyPro2PMRelay, ShellyPro2PMRoller } from './shellyProducts/shellyPro2PM.js';
import { ShellyPro3 } from './shellyProducts/shellyPro3.js';
import { ShellyPro4PM } from './shellyProducts/shellyPro4PM.js';
import { Shelly25Relay , Shelly25Roller} from './shellyProducts/shelly25.js';

import got from 'got'
import { ShellyMaster } from './shellyProducts/shellyMaster.js';
import { ShellyPro2 } from './shellyProducts/shellyPro2.js';

class ShellyInstance extends InstanceBase {

	setupPollingInterval() {
		if (this.config.pollingInterval > 0) {
			this.pollTimer = setInterval(async () => {
				try {
					var res = null;
					// Get request for Shelly Plus/Pro products
					if(this.config.shellyProduct > 200) {
						res = await got.get("http://" + this.config.targetIp + "/rpc/Shelly.GetStatus", null)
					}
					// Get request for older products
					else {
						res = await got.get("http://" + this.config.targetIp + "/status", null)
					}

					this.lastStatus = JSON.parse(res.body);
					ShellyMaster.lastStatus = this.lastStatus;
					this.updateStatus(InstanceStatus.Ok);
					this.checkFeedbacks();
				}
				catch (error) {
					this.updateStatus(InstanceStatus.Disconnected);
				}

			}, this.config.pollingInterval)
		}
	}

	configUpdated(config) {
		this.config = config
		ShellyMaster.targetIp = this.config.targetIp;
		this.initActions(this.config.shellyProduct)
		this.initFeedbacks(this.config.shellyProduct)
		this.subscribeFeedbacks();
		clearInterval(this.pollTimer);
		this.pollTimer = null;
		this.setupPollingInterval();
	}

	init(config) {
		this.config = config
		ShellyMaster.targetIp = this.config.targetIp;
		this.initPresets();
		this.updateStatus(InstanceStatus.Ok)
		this.initActions(this.config.shellyProduct)
		this.initFeedbacks(this.config.shellyProduct)
		this.setupPollingInterval();
	}

	getConfigFields() {
		return configFields;
	}

	async destroy() {
		clearInterval(this.pollTimer);
		this.pollTimer = null;
	}

	initActions(product) {
		switch (product) {
			case 101: this.setActionDefinitions(Shelly1.actions); break;
			case 201: this.setActionDefinitions(ShellyPlus1.actions); break;
			case 202: this.setActionDefinitions(ShellyPlus1PM.actions); break;
			case 203: this.setActionDefinitions(ShellyPlus2PMRelay.actions); break;
			case 204: this.setActionDefinitions(ShellyPlus2PMRoller.actions); break;
			case 102: this.setActionDefinitions(Shelly25Relay.actions); break;
			case 103: this.setActionDefinitions(Shelly25Roller.actions); break;
			case 205: this.setActionDefinitions(ShellyPro1.actions); break;
			case 206: this.setActionDefinitions(ShellyPro1PM.actions); break;
			case 207: this.setActionDefinitions(ShellyPro2.actions); break;
			case 208: this.setActionDefinitions(ShellyPro2PMRelay.actions); break;
			case 209: this.setActionDefinitions(ShellyPro2PMRoller.actions); break;
			case 210: this.setActionDefinitions(ShellyPro3.actions); break;
			case 211: this.setActionDefinitions(ShellyPro4PM.actions); break;
			case 104: this.setActionDefinitions(ShellyDimmer.actions); break;
			case 105: this.setActionDefinitions(ShellyRGBW2Color.actions); break;
			case 106: this.setActionDefinitions(ShellyRGBW2White.actions); break;
			default: this.setActionDefinitions({});
		}
	}

	initFeedbacks(product) {
		switch (product) {
			case 101: this.setFeedbackDefinitions(Shelly1.feedbacks); break;
			case 201: this.setFeedbackDefinitions(ShellyPlus1.feedbacks); break;
			case 202: this.setFeedbackDefinitions(ShellyPlus1PM.feedbacks); break;
			case 203: this.setFeedbackDefinitions(ShellyPlus2PMRelay.feedbacks); break;
			case 204: this.setFeedbackDefinitions(ShellyPlus2PMRoller.feedbacks); break;
			case 102: this.setFeedbackDefinitions(Shelly25Relay.feedbacks); break;
			case 103: this.setFeedbackDefinitions(Shelly25Roller.feedbacks); break;
			case 205: this.setFeedbackDefinitions(ShellyPro1.feedbacks); break;
			case 206: this.setFeedbackDefinitions(ShellyPro1PM.feedbacks); break;
			case 207: this.setFeedbackDefinitions(ShellyPro2.feedbacks); break;
			case 208: this.setFeedbackDefinitions(ShellyPro2PMRelay.feedbacks); break;
			case 209: this.setFeedbackDefinitions(ShellyPro2PMRoller.feedbacks); break;
			case 210: this.setFeedbackDefinitions(ShellyPro3.feedbacks); break;
			case 211: this.setFeedbackDefinitions(ShellyPro4PM.feedbacks); break;
			case 104: this.setFeedbackDefinitions(ShellyDimmer.feedbacks); break;
			case 105: this.setFeedbackDefinitions(ShellyRGBW2Color.feedbacks); break;
			case 106: this.setFeedbackDefinitions(ShellyRGBW2White.feedbacks); break;
			default: this.setFeedbackDefinitions({});
		}
	}

	initPresets() {
		const presets = {};
		presets['test'] = {
			type: 'button',
			category: 'Relay',
			name: 'Test Preset',
			style: {
				text: 'Ch1 off',
				size: '18',
				color: combineRgb(255,255,255),
				bgcolor: combineRgb(32,32,32)
			},
			steps: [
				{
					down: [
						{
							actionId: 'Toggle',
						}
					]
				}
			],
			feedbacks: [
				{
					feedbackId: 'Relay State',
					style: {
						bgcolor: combineRgb(255,32,32)
					}
				}
			]
		}
		this.setPresetDefinitions(presets);
	}

	pollTimer = null;
}

runEntrypoint(ShellyInstance)