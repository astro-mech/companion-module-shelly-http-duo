import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { configFields } from './config.js'
import { upgradeScripts } from './upgrade.js'
import { Shelly1 } from './shellyProducts/shelly1.js';
import { ShellyRGBW2Color } from './shellyProducts/shellyRGBW2.js';
import { ShellyRGBW2White } from './shellyProducts/shellyRGBW2.js';
import { ShellyDimmer } from './shellyProducts/shellyDimmer.js';
import { Shelly25Relay, Shelly25Roller } from './shellyProducts/shelly25.js';
import { ShellyDuo } from './shellyProducts/shellyDuo.js';
import { ShellyMaster } from './shellyProducts/shellyMaster.js';
import got from 'got'

class ShellyInstance extends InstanceBase {

	setupPollingInterval() {
		if (this.config.pollingInterval > 0) {
			this.pollTimer = setInterval(async () => {
				try {
					var res = await got.get("http://" + this.config.targetIp + "/status", null)
					this.lastStatus = JSON.parse(res.body);
					ShellyMaster.lastStatus = this.lastStatus;
					this.updateStatus(InstanceStatus.Ok);
					this.checkFeedbacks();
					this.checkVariables();
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
		this.initVariables(this.config.shellyProduct)
		clearInterval(this.pollTimer);
		this.pollTimer = null;
		this.setupPollingInterval();
	}

	init(config) {
		this.config = config
		ShellyMaster.targetIp = this.config.targetIp;
		this.updateStatus(InstanceStatus.Ok)
		this.initActions(this.config.shellyProduct)
		this.initFeedbacks(this.config.shellyProduct)
		this.initVariables(this.config.shellyProduct)
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
			case 102: this.setActionDefinitions(Shelly25Relay.actions); break;
			case 103: this.setActionDefinitions(Shelly25Roller.actions); break;
			case 104: this.setActionDefinitions(ShellyDimmer.actions); break;
			case 105: this.setActionDefinitions(ShellyRGBW2Color.actions); break;
			case 106: this.setActionDefinitions(ShellyRGBW2White.actions); break;
			case 107: this.setActionDefinitions(ShellyDuo.actions); break;
			default: this.setActionDefinitions({});
		}
	}

	initFeedbacks(product) {
		switch (product) {
			case 101: this.setFeedbackDefinitions(Shelly1.feedbacks); break;
			case 102: this.setFeedbackDefinitions(Shelly25Relay.feedbacks); break;
			case 103: this.setFeedbackDefinitions(Shelly25Roller.feedbacks); break;
			case 104: this.setFeedbackDefinitions(ShellyDimmer.feedbacks); break;
			case 105: this.setFeedbackDefinitions(ShellyRGBW2Color.feedbacks); break;
			case 106: this.setFeedbackDefinitions(ShellyRGBW2White.feedbacks); break;
			case 107: this.setFeedbackDefinitions(ShellyDuo.feedbacks); break;
			default: this.setFeedbackDefinitions({});
		}
	}

	initVariables(product) {
		switch (product) {
			case 107: this.setVariableDefinitions(ShellyDuo.variables()); break;
			default: this.setVariableDefinitions([]);
		}
	}

	checkVariables() {
		switch (this.config.shellyProduct) {
			case 107: ShellyDuo.updateVariables(this);
		}
	}

	pollTimer = null;
}

runEntrypoint(ShellyInstance, upgradeScripts)