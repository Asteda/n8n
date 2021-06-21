import {IExecuteFunctions,} from 'n8n-core';

import {INodeExecutionData, INodeType, INodeTypeDescription,} from 'n8n-workflow';

import {OptionsWithUri,} from 'request';

export class LdSimilarity implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdSimilarity',
		name: 'ldSimilarity',
		icon: 'file:gear-icon.svg',
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
				displayName: 'Benchmark Name',
				name: 'benchmarkName',
				type: 'options',
				options: [
					{
						name: 'None',
						value: 'none',
					},
					{
						name: 'mc-30',
						value: 'mc30',
					},
					{
						name: 'rg-65',
						value: 'rg65',
					},
					{
						name: 'wordsim-353',
						value: 'wordsim353',
					},
				],
				displayOptions: {
					show: {
						benchmark: [
							true,
						],
					},
				},
				default: 'none',
				required: true,
				description: 'Benchmark\'s name.',
			},

			{
				displayName: 'Correlation Type',
				name: 'correlationType',
				type: 'options',
				options: [
					{
						name: 'Spearman',
						value: 'spearman',
					},
					{
						name: 'Pearson',
						value: 'pearson',
					},
				],
				displayOptions: {
					show: {
						benchmark: [
							true,
						],
					},
				},
				default: 'spearman',
				required: true,
				description: 'Type of correlation.',
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
		const numberFormat = this.getNodeParameter('format_numbers', 0) as string;

		const optionsUI = {
			benchmark: false,
			benchmarkName: '',
			correlationType: '',
			threads: this.getNodeParameter('nbThreads', 0),
			useIndex: this.getNodeParameter('useIndex', 0),
			measureType: this.getNodeParameter('measureType', 0),
		};

		/**
		 * Retourne les options pour la requête HTTP au service web LDS.
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

			return {
				headers: {
					'Accept': 'application/json',
				},
				method: 'POST',
				body: bodyOptions,
				uri: url,
				json: true,
			};
		}

		/**
		 * Renvoie un tableau d'objets JSON où les scores ont été transformés en format string.
		 * @param jsondata le tableau de données à transformer
		 */
		// tslint:disable-next-line:no-any
		function setScoreToString(jsondata: any) {
			for(let i=0; i<jsondata.length; i++) {
				if(jsondata[i].hasOwnProperty('score')) {
					// @ts-ignore
					jsondata[i].score = jsondata[i].score.toString();
				}
			}
			return jsondata;
		}


		/* ===  partie pour les sources multiples (fichier contenant des couples d'URIs) === */

		if(resource === 'file') {
			console.log('** en mode File');

			let items;
			let parameters;

			try { // dataset : parameters
				parameters = this.getInputData(0);
				if (typeof parameters === 'undefined') throw new Error('');
			}
			catch(error) {
				throw new Error('Dataset parameters are missing. Maybe you forgot to add a LdDatasetMain node before this one.');
			}
			try { // input file : items
				items = this.getInputData(1);
				if (typeof items === 'undefined') throw new Error('');
			}
			catch(error) {
				throw new Error('Input File data are missing. Maybe you forgot to add a node before this one.');
			}
			// NB : si le dataset est manquant, les données iront dans la variable parameters, et le 2ème try/catch provoquera une erreur

			const length = items.length as unknown as number;
			let item: INodeExecutionData;

			console.log('** construction du résultat');

			const urisJSON = [];
			const usesBenchmark = this.getNodeParameter('benchmark', 0) as boolean;
			for (let itemIndex = 0; itemIndex < length; itemIndex++) {
				item = items[itemIndex];

				const uri1 = item.json.resource1 as string;
				const uri2 = item.json.resource2 as string;
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

			}

			optionsUI.benchmark = usesBenchmark;
			if(usesBenchmark) {
				optionsUI.benchmarkName = this.getNodeParameter('benchmarkName',0) as string;
				optionsUI.correlationType = this.getNodeParameter('correlationType',0) as string;
			}

			console.log(optionsUI);

			const optionsPOST = buildOptionsPOST(urisJSON, parameters[0], optionsUI);
			const responseData = await this.helpers.request(optionsPOST);

			console.log('** fin du résultat');

			console.log(optionsUI);

			/* Traitement du résultat */

			if(responseData.status === 'error') {
				// cas erreur
				throw new Error('Error ' + responseData.code + ' : ' + responseData.message);
			}
			else if(responseData.status === 'success') {
				// cas succès
				if(numberFormat === 'string') {
					return this.prepareOutputData(setScoreToString(responseData.data));
				}
				else {
					return this.prepareOutputData(responseData.data);
				}
			}

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

			/* Construction des paramètres à envoyer à LDS */
			const urisJSON = [{
				resource1: this.getNodeParameter('url1', 0) as string,
				resource2: this.getNodeParameter('url2', 0) as string,
			}];

			const optionsPOST = buildOptionsPOST(urisJSON, parameters[0], optionsUI);
			const responseData = await this.helpers.request(optionsPOST);

			/* Traitement du résultat */
			console.log('** fin du résultat');
			if(responseData.status === 'error') {
				// cas erreur
				throw new Error('Error ' + responseData.code + ' : ' + responseData.message);
			}
			else if(responseData.status === 'success') {
				// cas succès
				const score = (numberFormat === 'string') ? responseData.data.score.toString() as string : responseData.score as number;
				return [this.helpers.returnJsonArray(
					{
						resource1: responseData.data.resource1,
						resource2: responseData.data.resource2,
						'score' : score,
					})];
			}


		}

		return [this.helpers.returnJsonArray({
			resource1: 'missing',
			resource2: 'missing',
			score : 1,
		})];






	}

}
