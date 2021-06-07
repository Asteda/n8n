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

export class LdDatasetMain implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdDatasetMain',
		name: 'ldDatasetMain',
		icon: 'file:gear-red.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume LdSimilarity API',
		defaults: {
			name: 'LdDatasetMain',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
		],
		properties: [

			{
				displayName: 'nsPrefixMap: xsd',
				name: 'xsd',
				type: 'string',
				required: true,
				default:'http://www.w3.org/2001/XMLSchema#',
				description:'',
			},
			{
				displayName: 'nsPrefixMap: rdfs',
				name: 'rdfs',
				type: 'string',
				required: true,
				default:'http://www.w3.org/2000/01/rdf-schema#',
				description:'',
			},
			{
				displayName: 'nsPrefixMap: dbpedia',
				name: 'dbpedia',
				type: 'string',
				required: true,
				default:'http://dbpedia.org/resource/',
				description:'',
			},

			{
				displayName: 'nsPrefixMap: dbpedia-owl',
				name: 'dbpedia-owl',
				type: 'string',
				required: true,
				default:'http://dbpedia.org/ontology/',
				description:'',
			},
			{
				displayName: 'nsPrefixMap: rdf',
				name: 'rdf',
				type: 'string',
				required: true,
				default:'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
				description:'',
			},
			{
				displayName: 'Link',
				name: 'link',
				type: 'string',
				required: true,
				default:'http://dbpedia.org/sparql',
				description:'',
			},
			{
				displayName: 'Default graph',
				name: 'defaultGraph',
				type: 'string',
				required: true,
				default:'http://dbpedia.org',
				description:'',
			},


		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		console.log('Exécution du noeud LdDatasetMain');
		return [this.helpers.returnJsonArray({

			xsd: this.getNodeParameter('xsd', 0),
			rdfs: this.getNodeParameter('rdfs', 0),
			dbpedia: this.getNodeParameter('dbpedia', 0),
			dbpediaowl: this.getNodeParameter('dbpedia-owl', 0),
			rdf: this.getNodeParameter('rdf', 0),
			link: this.getNodeParameter('link', 0),
			defaultGraph: this.getNodeParameter('defaultGraph', 0),

		})];


	}
}
