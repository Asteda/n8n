import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

export class LdSimilarityEngine implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdSimilarityEngine',
		name: 'ldSimilarityEngine',
		icon: 'file:engrenage.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume LdSimilarityEngine API',
		defaults: {
			name: 'LdSimilarityEngine',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.

			{
				displayName: 'Number of threads',
				name: 'nbThreads',
				type: 'number',
				required: true,
				typeOptions: {
					maxValue: 10,
					minValue: 1,
					numberStepSize: 1,
				},
				default: 1,
				description: 'How many threads to calculate the similarity',
			},

			// lddata set = choix

			{
				displayName: 'DataSet Choice',
				name: 'datasetChoice',
				type: 'options',
				options: [
					{
						name: 'DBPedia_en',
						value: 'DBPedia_en',
					},
					{
						name: 'DBPedia_fr',
						value: 'DBPedia_fr',
					},
					{
						name: 'DBPedia_it',
						value: 'DBPedia_it',
					},
				],
				default: 'DBPedia_en', // The initially selected option
				description: 'The main dataset object for querying data',
			},

			// useindex bool

			{
				displayName: 'Use index',
				name: 'useIndex',
				type: 'boolean',
				default: true, // Initial state of the toggle
				description: 'Specifies wether true or false for index usage',
			},





		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [[]];
	}
}
