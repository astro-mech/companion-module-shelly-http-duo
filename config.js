import {Regex} from '@companion-module/base'


export const configFields = [
	{
		type: 'textinput',
		id: 'targetIp',
		label: 'Target IP',
		default: "192.168.33.1",
		width: 6,
		regex: Regex.IP,
	},
	{
		type: 'number',
		id: 'pollingInterval',
		label: 'Polling interval (ms)',
		tooltip: 'How often Companion will read the latest data out of the Shelly device (for feedbacks, 100ms - 5s)',
		default: 300,
		min: 100,
		max: 5000,
		width: 6,
	},
	{
		type: 'static-text',
		id: 'info',
		width: 12,
		value: 'Please select the correct Shelly product from the dropdown menu, ' +
				'before setting up any buttons - this is because the different products ' + 
				'have different actions and feedbacks. <br> <i>Changing the product after ' + 
				'buttons have been setup can break things!</i>'
	},
	{
		type: 'dropdown',
		id: 'shellyProduct',
		label: 'Shelly Product',
		width: 8,
		default: 101,
		choices: [
			{ id: 101, label: 'Shelly 1' },
			{ id: 102, label: 'Shelly 2.5 Relay Mode' },
			{ id: 103, label: 'Shelly 2.5 Roller Mode' },
			{ id: 104, label: 'Shelly Dimmer 1/2' },
			{ id: 105, label: 'Shelly RGBW2 (Color Mode)' },
			{ id: 106, label: 'Shelly RGBW2 (White Mode)' },
			{ id: 107, label: 'Shelly Duo' }
		],
	},
]
