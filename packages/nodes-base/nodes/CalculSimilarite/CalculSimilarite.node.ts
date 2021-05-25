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

export class CalculSimilarite implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CalculSimilarite',
		name: 'calculSimilarite',
		icon: 'file:CalculSimilarite.svg',
		group: ['transform'],
		version: 1,
		description: 'Calculer similarité sémantique',
		defaults: {
			name: 'CalculSimilarite',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	return [[]];
}
}
