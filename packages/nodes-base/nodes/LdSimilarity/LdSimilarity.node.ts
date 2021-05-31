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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'URIs',
						value: 'uris',
					},
				],
				default: 'uris',
				required: true,
				description: 'Resource to consume',
			},

			{
				displayName: 'URL Resource 1',
				name: 'url1',
				type: 'string',
				required: true,
				default:'',
				description:'URL of the first resource',
				displayOptions: {
					show: {
						resource: [
							'uris',
						]	,
					},
				},
			},

			{
				displayName: 'URL Resource 2',
				name: 'url2',
				type: 'string',
				required: true,
				default:'',
				description:'URL of the second resource',
				displayOptions: {
					show: {
						resource: [
							'uris',
						]	,
					},
				},
			},

			{
				displayName: 'JSON data',
				name: 'jsondata',
				type: 'json',
				required: true,
				default:'',
				description:'Indicate the JSON data to calculate the similarity. You can use, for example, the output' +
					'of the Google Sheet node. The format of these JSON data must be ' +
					'<pre>[ { "resource1": "..." , "resource2": "..." },  ... ]</pre>.',
				displayOptions: {
					show: {
						resource: [
							'file',
						]	,
					},
				},
			},

			{
				displayName: 'SpreadSheet ID Input',
				name: 'sheetIdInput',
				type: 'string',
				required: true,
				default:'',
				description:'ID of the Google Sheet document to get the resources (you can get it between' +
					'"/d/" and "/edit" in the URL file)',
				displayOptions: {
					show: {
						resource: [
							'files',
						]	,
					},
				},
			},

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

			{
				displayName: 'Type of measure',
				name: 'measureType',
				type: 'options',
				options: [ // les types sont parmi le tableau ici https://github.com/FouadKom/lds/blob/master/doc/Similarity_Measures_Configuration_Parameters.md
					{
						name: 'LDSD_d',
						value: 'LDSD_d',
					},
					{
						name: 'LDSD_dw',
						value: 'LDSD_dw',
					},
					{
						name: 'LDSD_i',
						value: 'LDSD_i',
					},
					{
						name: 'LDSD_iw',
						value: 'LDSD_iw',
					},
					{
						name: 'LDSD_cw',
						value: 'LDSD_cw',
					},
					{
						name: 'TLDSD',
						value: 'TLDSD',
					},
					{
						name: 'WLDSD',
						value: 'WLDSD',
					},
					{
						name: 'Resim',
						value: 'Resim',
					},
					{
						name: 'TResim',
						value: 'TResim',
					},
					{
						name: 'WResim',
						value: 'WResim',
					},
					{
						name: 'WTResim',
						value: 'WTResim',
					},
					{
						name: 'PICSS',
						value: 'PICSS',
					},
					{
						name: 'EPICS',
						value: 'EPICS',
					},
					{
						name: 'LODS (SimP submeasure)',
						value: 'LODS-SimP',
					},
					{
						name: 'LODS (SimI submeasure)',
						value: 'LODS-SimI',
					},

				],
				default: 'Resim', // The initially selected option
				description: 'Type of measure',
			},

			{
				displayName: 'SpreadSheet ID Output',
				name: 'sheetIdOutput',
				type: 'string',
				required: true,
				default:'',
				description:'ID of the Google Sheet document to write the result (you can get it between' +
					'"/d/" and "/edit" in the URL file) <br/> This file MUST have 3 columns : resource1, resource2, result.',
			},


		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		//let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const measureType = this.getNodeParameter('measureType', 0) as string;
		const numberOfThreads = this.getNodeParameter('nbThreads', 0) as number;

		if(resource === 'files') {
			// code pour les sources multiples
		}
		else if (resource === 'uris') {
			const uri1 = this.getNodeParameter('url1', 0) as string;
			const uri2 = this.getNodeParameter('url2', 0) as string;
			return [this.helpers.returnJsonArray({
				resource1: uri1,
				resource2: uri2,
				result : Math.random(),
			})];
		}

		/*const options: OptionsWithUri = {
			headers: {
				'Accept': 'application/json',
				//'Authorization': `Bearer ${credentials.apiKey}`,
			},
			method: 'PUT',
			body: {

			},
			uri: `https://api.sendgrid.com/v3/marketing/contacts`,
			json: true,
		};*/

		//responseData = await this.helpers.request(options);



		//return [this.helpers.returnJsonArray(responseData)];

		return [this.helpers.returnJsonArray({
			resource1: measureType,
			resource2: numberOfThreads,
			result : Math.random(),
		})];



	}
}
