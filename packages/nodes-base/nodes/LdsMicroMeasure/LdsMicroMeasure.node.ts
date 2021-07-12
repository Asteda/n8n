import {IExecuteFunctions,} from 'n8n-core';

import {INodeExecutionData, INodeType, INodeTypeDescription,} from 'n8n-workflow';

import {OptionsWithUri,} from 'request';

export class LdsMicroMeasure implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdsMicroMeasure',
		name: 'ldsMicroMeasure',
		icon: 'file:gear-icon.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume LdsSimilarity API for micro measures',
		defaults: {
			name: 'LdsMicroMeasure',
			color: '#1A82e2',
		},
		inputs: ['main', 'main'],
		inputNames: ['LdsDataset', 'LdsMicroMeasure'],
		outputs: ['main'],
		credentials: [
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.

			{
				displayName: 'Resource 1',
				name: 'url1',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the first concept',
			},

			{
				displayName: 'Resource 2',
				name: 'url2',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the second concept',
			},

			{
				displayName: 'Property',
				name: 'propertyName',
				type: 'string',
				required: true,
				default:'',
				description:'Name of the property to be considered during the calculation',
			},

			{
				displayName: 'Type of atomic measure',
				name: 'measure_atomic',
				type: 'options',
				options: [
					{
						name: 'Numeric',
						value: 'int',
						description: 'Compare two numbers and get the difference in percentage.',
					},
					{
						name: 'Levenshtein',
						value: 'levenshtein',
						description: 'The Levenshtein distance between two words is the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into the other.',
					},
					{
						name: 'Normalized Levenshtein',
						value: 'normalizedLevenshtein',
						description: 'This distance is computed as levenshtein distance divided by the length of the longest string.',
					},
					/*{
						name: 'Weighted Levenshtein',
						value: 'weightedLevenshtein',
						description: 'An implementation of Levenshtein that allows to define different weights for different character substitutions.',
					},*/
					{
						name: 'Damerau-Levenshtein',
						value: 'damerauLevenshtein',
						description: 'Damerau-Levenshtein distance with transposition is the minimum number of operations needed to transform one string into the other, where an operation is defined as an insertion, deletion, or substitution of a single character, or a transposition of two adjacent characters.',
					},
					{
						name: 'Optimal String Alignment',
						value: 'optimalStringAligment',
						description: 'Computes the number of edit operations needed to make the strings equal under the condition that no substring is edited more than once, whereas the true Damerau–Levenshtein presents no such restriction.',
					},
					{
						name: 'Jaro-Winkler',
						value: 'jaroWinkler',
						description: 'The Jaro–Winkler distance metric is designed and best suited for short strings such as person names, and to detect typos.',
					},
					{
						name: 'Longest Common Subsequence',
						value: 'longestCommonSubsequence',
						description: 'Consists in finding the longest subsequence common to two sequences. It differs from problems of finding common substrings: unlike substrings, subsequences are not required to occupy consecutive positions within the original sequences.',
					},
					{
						name: 'Metric Longest Common Subsequence',
						value: 'metricLongestCommonSubsequence',
						description: 'Distance metric based on Longest Common Subsequence.',
					},
					{
						name: 'N-Gram',
						value: 'nGram',
						description: 'The algorithm uses affixing with special character \'\\n\' to increase the weight of first characters. The normalization is achieved by dividing the total similarity score the original length of the longest word.',
					},
					{
						name: 'Q-Gram',
						value: 'qGram',
						description: 'Approximate string-matching with q-grams and maximal matches',
					},
					{
						name: 'Cosine similarity',
						value: 'cosineSimilarity',
						description: 'The similarity between the two strings is the cosine of the angle between these two vectors representation.',
					},
					{
						name: 'Jaccard index',
						value: 'jaccardIndex',
						description: 'Metric distance. Like Q-Gram distance, the input strings are first converted into sets of n-grams, but this time the cardinality of each n-gram is not taken into account. Each input string is simply a set of n-grams.',
					},
					{
						name: 'Sorensen-Dice coefficient',
						value: 'sorensenDiceCoefficient',
						description: 'Similar to Jaccard index.',
					},
					{
						name: 'Ratcliff-Obershelp',
						value: 'ratcliffObershelp',
						description: 'Ratcliff-Obershelp Pattern Recognition is a string-matching algorithm for determining the similarity of two strings.',
					},
				],
				default: 'levenshtein',
				description: 'Type of atomic measure to apply on the property',
			},

			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				required: true,
				typeOptions: {
					maxValue: 1,
					minValue: 0,
					numberStepSize: 0.01,
				},
				default: 0.5,
				description: 'Indicate the weight of this measure. This value acts like a coefficient.',
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
						description: 'This option can helps displaying the zeros values in Google Sheet. This ' +
							'has no impact on aggregation calculations.',
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

		// récupérer les valeurs entrées par l'utilisateur
		const formatString = this.getNodeParameter('format_numbers', 0) !== 'numeric';

		// récupérer les valeurs en input et les sauvegarder pour les ajouter à la sortie

		// tslint:disable-next-line:no-any
		let previousData: string | any[] = [];
		let parameters;
		try { // dataset : parameters
			parameters = this.getInputData(0);
			if (typeof parameters === 'undefined') throw new Error('');
		}
		catch(error) {
			throw new Error('Dataset parameters are missing. Maybe you forgot to add a LdsDataset node before this one.');
		}
		let usePreviousData=true;
		try { // input file : items
			previousData = this.getInputData(1);
			if (typeof previousData === 'undefined') throw new Error('');
		}
		catch(error) {
			usePreviousData=false;
		}

		// calculer la valeur de similarité avec l'api LDS (requête POST)
		// pour l'instant on renvoie une valeur aléatoire



		const sendData = {
			headers: {
				'Accept': 'application/json',
			},
			method: 'POST',
			body: {
				'ldDatasetMain': parameters[0].json,
				'resources': [{
					resource1: this.getNodeParameter('url1', 0) as string,
					resource2: this.getNodeParameter('url2', 0) as string,
					property: this.getNodeParameter('propertyName', 0) as string,
				}],
				'options': {
					weight: this.getNodeParameter('weight', 0) as number,
					measureType: this.getNodeParameter('measure_atomic', 0) as string,
				},
			},
			uri: 'https://wysiwym-api.herokuapp.com/microMeasure',
			json: true,
		};

		//console.log(sendData);

		const responseData = await this.helpers.request(sendData);

		// fusionner l'input et le résultat, puis faire la sortie

		//log(responseData);
		const returnData = [];

		if(usePreviousData === true) {
			for(let i=0; i<previousData.length; i++) {
				returnData.push({
					resource1: previousData[i].json.resource1,
					resource2: previousData[i].json.resource2,
					score: previousData[i].json.score,
					weight: previousData[i].json.weight,
				});
			}
		}

		if(responseData.status === 'error') {
			throw new Error('Error ' + responseData.code + ' : ' + responseData.message);
		}
		else if (responseData.status === 'success') {
			returnData.push({
				resource1: this.getNodeParameter('url1', 0) as string,
				resource2: this.getNodeParameter('url2', 0) as string,
				score: (formatString) ? responseData.data[0].score as string : responseData.data[0].score as number,
				weight: this.getNodeParameter('weight', 0) as number,
			});

		}

/*
		if(formatString) {
			console.log('format string');
		}
		returnData.push({
			resource1: this.getNodeParameter('url1', 0) as string,
			resource2: this.getNodeParameter('url2', 0) as string,
			score: (formatString) ? Math.random().toString() : Math.random(),
			weight: this.getNodeParameter('weight', 0) as number,
		});*/
		return [this.helpers.returnJsonArray(returnData)];




	}

}
