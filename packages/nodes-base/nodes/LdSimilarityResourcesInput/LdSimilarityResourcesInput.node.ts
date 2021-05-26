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

export class LdSimilarityResourcesInput implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdSimilarityResourcesInput',
		name: 'ldSimilarityResourcesInput',
		icon: 'file:engrenage.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume LdSimilarityResourcesInput API',
		defaults: {
			name: 'LdSimilarityResourcesInput',
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
				displayName: 'URL Resource 1',
				name: 'url1',
				type: 'string',
				required: true,
				default:'',
				description:'URL of the first resource',
			},

			{
				displayName: 'URL Resource 2',
				name: 'url2',
				type: 'string',
				required: true,
				default:'',
				description:'URL of the second resource',
			},

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [[]];
	}
}
