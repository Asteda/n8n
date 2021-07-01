import {IExecuteFunctions,} from 'n8n-core';

import {INodeExecutionData, INodeType, INodeTypeDescription,} from 'n8n-workflow';

import {OptionsWithUri,} from 'request';

export class LdsMicroMeasure implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdsMicroMeasure',
		name: 'ldsMicroMeasure',
		icon: 'file:gear-icon.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume LdsSimilarity API for micro measures',
		defaults: {
			name: 'LdsMicroMeasure',
			color: '#1A82e2',
		},
		inputs: ['main'],
		inputNames: ['LdsDataset'],
		outputs: ['main'],
		credentials: [
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.

			{
				displayName: 'Resource 1',
				name: 'url1',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the first concept',
			},

			{
				displayName: 'Resource 2',
				name: 'url2',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the second concept',
			},

			{
				displayName: 'Property',
				name: 'propertyName',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the property to be considered during the calculation',
			},

			{
				displayName: 'Type of atomic measure',
				name: 'measure_atomic',
				type: 'options',
				options: [
					{
						name: 'Measure 1',
						value: 'measure1',
					},
					{
						name: 'Measure 2',
						value: 'measure2',
					},
				],
				default: 'measure1',
				description: 'Type of atomic measure to apply on the property',
			},

			{
				displayName: 'Output format for numbers',
				name: 'format_numbers',
				type: 'options',
				options: [
					{
						name: 'Numeric',
						value: 'numeric',
					},
					{
						name: 'String',
						value: 'string',
					},
				],
				default: 'numeric',
				description: 'The output format for the result value of similarity score. <br />' +
					'String format can be preferred for the Google Sheets output (Google Sheets doesn\'t <br />' +
					'report the value when it is zero, and this option forces Google Sheets node to <br />' +
					'write the zero value), whereas numeric format can be preferred for the CSV output, <br />' +
					'for example.',
			},

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		return [this.helpers.returnJsonArray({
			resource1: 'missing',
			resource2: 'missing',
			score : 1,
		})];


	}

}
