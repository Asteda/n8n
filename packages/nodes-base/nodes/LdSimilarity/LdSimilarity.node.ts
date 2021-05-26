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

export class LdSimilarity implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdSimilarity',
		name: 'ldSimilarity',
		icon: 'file:engrenage.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume LdSimilarity API',
		defaults: {
			name: 'LdSimilarity',
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
				displayName: 'Type of Similarity',
				name: 'similarityType',
				type: 'options',
				options: [
					{
						name: 'First type',
						value: 'type1',
					},
					{
						name: 'Second type',
						value: 'type2',
					},
					{
						name: 'Third type',
						value: 'type3',
					},
				],
				default: 'type1', // The initially selected option
				description: 'Type of algorithm to calculate the similarity',
			},




		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [[]];
	}
}
