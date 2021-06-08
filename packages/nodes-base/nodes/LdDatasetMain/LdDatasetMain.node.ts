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
		icon: 'file:database-icon.svg',
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
			{
				displayName: 'Base resource URL',
				name: 'baseResourceURL',
				type: 'string',
				required: true,
				default:'http://dbpedia.org/resource/',
				description:'The URI prefixes.',
			},


		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		console.log('Exécution du noeud LdDatasetMain');
		return [this.helpers.returnJsonArray({

			name: this.getNodeParameter('datasetChoice', 0),

			prefixes: {
				nsPrefixMap:
					{
						xsd: this.getNodeParameter('xsd', 0),
						rdfs: this.getNodeParameter('rdfs', 0),
						dbpedia: this.getNodeParameter('dbpedia', 0),
						dbpediaowl: this.getNodeParameter('dbpedia-owl', 0),
						rdf: this.getNodeParameter('rdf', 0),

					},
			},

			link: this.getNodeParameter('link', 0),
			defaultGraph: this.getNodeParameter('defaultGraph', 0),
			baseResourceURL : this.getNodeParameter('baseResourceURL', 0),

		})];


	}
}
