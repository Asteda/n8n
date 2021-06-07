import {IExecuteFunctions,} from 'n8n-core';

import {INodeExecutionData, INodeType, INodeTypeDescription,} from 'n8n-workflow';

import {OptionsWithUri,} from 'request';

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
		inputs: ['main', 'main'],
		inputNames: ['DatasetMain', 'Input File'],
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
						name: 'Couple of concepts',
						value: 'uris',
					},
				],
				default: 'uris',
				required: true,
				description: 'Type of entry. If you chose the File mode, you must place a node before this one,' +
					' which gives some JSON data as Output.',
			},

			{
				displayName: 'Resource 1',
				name: 'url1',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the first concept',
				displayOptions: {
					show: {
						resource: [
							'uris',
						]	,
					},
				},
			},

			{
				displayName: 'Resource 2',
				name: 'url2',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the second concept',
				displayOptions: {
					show: {
						resource: [
							'uris',
						]	,
					},
				},
			},

			{
				displayName: 'Benchmark',
				name: 'benchmark',
				type: 'boolean',
				required: true,
				default:'false',
				description:'Turn on if you want to compare the results with the benchmarks.',
				displayOptions: {
					show: {
						resource: [
							'file',
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

		console.log('Exécution du noeud LdSimilarity');


		const resource = this.getNodeParameter('resource', 0) as string;
		const measureType = this.getNodeParameter('measureType', 0) as string;
		const numberOfThreads = this.getNodeParameter('nbThreads', 0) as number;
		const numberFormat = this.getNodeParameter('format_numbers', 0) as string;

		function buildOptions(res1: string, res2: string, measureType: string): OptionsWithUri {
			const url = 'https://wysiwym-api.herokuapp.com/similarity?' +
				'name=' + measureType +
				'&r1=' + res1 +
				'&r2=' + res2;
			return {
				headers: {
					'Accept': 'application/json',
				},
				method: 'GET',
				body: {},
				uri: url,
				json: true,
			};
		}

		/**
		 * Retourne les options pour la requête HTTP au service web LDS.
		 * @param file true si les données sont sous forme de fichier ; false sinon (couple unique d'URL)
		 * @param resources objet JSON contenant la liste des couples d'URL / le couple d'URL
		 * @param dataset paramètres du noeud LdDatasetMain
		 * @param options paramètres du noeud LdSimilarity
		 */
		function buildOptionsPOST(resources: object[], dataset: INodeExecutionData, options: object): OptionsWithUri {

			let url = 'https://wysiwym-api.herokuapp.com/similarity?' ;
			if(resources.length > 1) {
				url += 'mode=multiple';
			}
			else {
				// @ts-ignore
				url += 'mode=simple&res1=' + resources[0]['resource1'] + '&res2=' + resources[0]['resource1'];
			}

			const bodyOptions = {
				'LdDatasetMain': dataset.json,
				'resources': resources,
				'options': options,
			} ;

			const result = {
				headers: {
					'Accept': 'application/json',
				},
				method: 'POST',
				body: bodyOptions,
				uri: url,
				json: true,
			};

			console.log(result);
			console.log(bodyOptions);
			console.log(resources);
			console.log(bodyOptions['LdDatasetMain']);

			return result;
		}


		/* ===  partie pour les sources multiples (fichier contenant des couples d'URIs) === */

		if(resource === 'file') {
			console.log('** en mode File');

			const usesBenchmark = this.getNodeParameter('benchmark', 0) as boolean;


			let items;
			let parameters;

			try { // dataset : parameters
				parameters = this.getInputData(0);
			}
			catch(error) {
				throw new Error('Dataset parameters are missing. Maybe you forgot to add a LdDatasetMain node before this one.');
			}
			try { // input file : items
				items = this.getInputData(1);
			}
			catch(error) {
				throw new Error('Input File data are missing. Maybe you forgot to add a node before this one.');
			}
			// NB : si le dataset est manquant, les données iront dans la variable parameters, et le 2ème try/catch provoquera une erreur

			const returnData: INodeExecutionData[] = [];
			const length = items.length as unknown as number;
			let item: INodeExecutionData;

			console.log('** construction du résultat');

			const urisJSON = [];

			for (let itemIndex = 0; itemIndex < length; itemIndex++) {
				item = items[itemIndex];

				const uri1 = item.json.resource1 as string;
				const uri2 = item.json.resource2 as string;

				const options = buildOptions(uri1, uri2, measureType);
				const responseData = await this.helpers.request(options);


				const score = (numberFormat === 'string') ? responseData.score.toString() as string : responseData.score as number;

				if(usesBenchmark) {
					urisJSON.push({
						resource1: uri1,
						resource2: uri2,
						benchmark: item.json.benchmark,
					});
				}
				else {
					urisJSON.push({
						resource1: uri1,
						resource2: uri2,
					});
				}

				const newItem: INodeExecutionData = {
					json: {
						resource1: uri1,
						resource2: uri2,
						result: score,
					},
				};

				returnData.push(newItem);
			}


			const optionsUI = {
				benchmark: usesBenchmark,
				threads: this.getNodeParameter('nbThreads', 0),
				useIndex: this.getNodeParameter('useIndex', 0),
				measureType: this.getNodeParameter('measureType', 0),
			};


			const optionsPOST = buildOptionsPOST(urisJSON, parameters[0], optionsUI);


			if(usesBenchmark === true) {
				console.log('** utilisation du benchmark');
				const correlationNumber = 0.5;
				const correlation = (numberFormat === 'string') ? correlationNumber.toString() as string : correlationNumber as number;
				const newItem: INodeExecutionData = {
					json: {
						resource1: 'Correlation',
						resource2: '',
						result: correlation,
					},
				};
				returnData.push(newItem);
			}
			console.log('** fin du résultat');

			return this.prepareOutputData(returnData);

		}


		/* === partie pour les entrée en mode URIs === */

		else if (resource === 'uris') {

			console.log('** en mode URIs');

			// ici nous n'attentons qu'une entrée en inputData

			let parameters;
			try {
				parameters = this.getInputData(0); // paramètres datasetmain
			}
			catch(error) {
				throw new Error('Dataset parameters are missing. Maybe you forgot to add a LdDatasetMain node before this one.');
			}
			if(parameters.length === 0 || typeof parameters[0].json.name === 'undefined') {
				throw new Error('Dataset parameters invalid. Maybe you forgot to add a LdDatasetMain node before this one.');
			}

			console.log('** construction du résultat');

			const uri1 = this.getNodeParameter('url1', 0) as string;
			const uri2 = this.getNodeParameter('url2', 0) as string;

			const urisJSON = [{
				resource1: uri1,
				resource2: uri2,
			}];
			const optionsUI = {
				benchmark: false,
				threads: this.getNodeParameter('nbThreads', 0),
				useIndex: this.getNodeParameter('useIndex', 0),
				measureType: this.getNodeParameter('measureType', 0),
			};


			const options = buildOptions(uri1, uri2, measureType);
			const optionsPOST = buildOptionsPOST(urisJSON, parameters[0], optionsUI);
			const responseData = await this.helpers.request(options);
			//const responseData = await this.helpers.request(optionsPOST);

			const score = (numberFormat === 'string') ? responseData.score.toString() as string : responseData.score as number;

			console.log('** fin du résultat');

			return [this.helpers.returnJsonArray(
				{
					resource1: uri1,
					resource2: uri2,
					result : score,
			})];
		}


		return [this.helpers.returnJsonArray({
			resource1: measureType,
			resource2: numberOfThreads,
			result : 1,
		})];



	}

}
