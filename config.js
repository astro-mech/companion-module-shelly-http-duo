import {Regex} from '@companion-module/base'


export const configFields = [
	{
		type: 'textinput',
		id: 'targetIp',
		label: 'Target IP',
		default: "192.168.178.40",
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
		width: 6,
		default: 101,
		choices: [
			{ id: 101, label: 'Shelly 1' },
			{ id: 201, label: 'Shelly Plus 1' },
			{ id: 202, label: 'Shelly Plus 1PM' },
			{ id: 203, label: 'Shelly Plus 2PM Relay Mode' },
			{ id: 204, label: 'Shelly Plus 2PM Roller Mode' },
			{ id: 102, label: 'Shelly 2.5 Relay Mode' },
			{ id: 103, label: 'Shelly 2.5 Roller Mode' },
			{ id: 205, label: 'Shelly Pro 1' },
			{ id: 206, label: 'Shelly Pro 1PM' },
			{ id: 207, label: 'Shelly Pro 2' },
			{ id: 208, label: 'Shelly Pro 2PM Relay Mode' },
			{ id: 209, label: 'Shelly Pro 2PM Roller Mode' },
			{ id: 210, label: 'Shelly Pro 3' },
			{ id: 211, label: 'Shelly Pro 4PM' },
			{ id: 104, label: 'Shelly Dimmer 1/2' },
			// { id: 6, label: 'Shelly Plug' },
			// { id: 10, label: 'Shelly Plus Plug' },
			{ id: 105, label: 'Shelly RGBW2 (Color Mode)' },
			{ id: 106, label: 'Shelly RGBW2 (White Mode)' },
		],
	},
]
