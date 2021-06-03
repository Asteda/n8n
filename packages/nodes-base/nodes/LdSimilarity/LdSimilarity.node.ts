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
				description: 'Resource to consume. If you chose the File mode, you must place a node before this one,' +
					' which gives some JSON data as Output.',
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

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		//let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const measureType = this.getNodeParameter('measureType', 0) as string;
		const numberOfThreads = this.getNodeParameter('nbThreads', 0) as number;

		if(resource === 'file') {
			// code pour les sources multiples

			const items = this.getInputData();

			const returnData: INodeExecutionData[] = [];
			const length = items.length as unknown as number;
			let item: INodeExecutionData;

			for (let itemIndex = 0; itemIndex < length; itemIndex++) {
				item = items[itemIndex];



				const newItem: INodeExecutionData = {
					json: {
						resource1: item.json.resource1,
						resource2: item.json.resource2,
						result: 1,
					},
				};

				returnData.push(newItem);
			}

			return this.prepareOutputData(returnData);
/*
*/
		}
		else if (resource === 'uris') {
			const uri1 = this.getNodeParameter('url1', 0) as string;
			const uri2 = this.getNodeParameter('url2', 0) as string;

			const url = 'https://wysiwym-api.herokuapp.com/similarity?name=' + measureType + '&r1=' + uri1 + '&r2=' + uri2;

			const options: OptionsWithUri = {
				headers: {
					'Accept': 'application/json',
				},
				method: 'GET',
				body: {
				},
				uri: url,
				json: true,
			};

			const responseData = await this.helpers.request(options);


			return [this.helpers.returnJsonArray(
				{
					resource1: uri1,
					resource2: uri2,
					result : responseData.score,
			})];
		}

		return [this.helpers.returnJsonArray({
			resource1: measureType,
			resource2: numberOfThreads,
			result : 1,
		})];



	}
}
