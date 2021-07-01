import {IExecuteFunctions,} from 'n8n-core';

import {INodeExecutionData, INodeType, INodeTypeDescription,} from 'n8n-workflow';

import {OptionsWithUri,} from 'request';

export class LdsMicroMeasureAggregation implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LdsMicroMeasureAggregation',
		name: 'ldsMicroMeasureAggregation',
		icon: 'file:calculator.svg',
		group: ['transform'],
		version: 1,
		description: 'Aggregate values for LdsMicroMeasure',
		defaults: {
			name: 'LdsMicroMeasureAggregation',
			color: '#1A82e2',
		},
		inputs: ['main'],
		inputNames: ['LdsMicroMeasure'],
		outputs: ['main'],
		credentials: [
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.

			{
				displayName: 'Aggregation',
				name: 'aggregation',
				type: 'options',
				options: [
					{
						name: 'Min',
						value: 'min',
					},
					{
						name: 'Max',
						value: 'max',
					},
					{
						name: 'Average',
						value: 'avg',
					},
				],
				default: 'avg',
				description: 'Type of aggregation operation to apply',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		// récupérer les valeurs entrées par l'utilisateur


		// récupérer les valeurs en input et les sauvegarder pour les ajouter à la sortie

		let previousData;
		try { // dataset : parameters
			previousData = this.getInputData(0);
			if (typeof previousData === 'undefined') throw new Error('');
		}
		catch(error) {
			throw new Error('Data are missing, maybe you forgot to add a LdsMicroMeasure before this one');
		}
		const returnData = [];

		// tslint:disable-next-line:no-any
		function findMin(a: any[]) {
			let min=a[0];
			for(let i=0; i<a.length; i++) if(a[i] < min) min = a[i];
			return min;
		}
		// tslint:disable-next-line:no-any
		function findMax(a: any[]) {
			let max=a[0];
			for(let i=0; i<a.length; i++) if(a[i] > max) max = a[i];
			return max;
		}

		// tslint:disable-next-line:no-any
		function findAvg(a: any[]) {
			let avg=0;
			for(let i=0; i<a.length; i++) avg += a[i];
			avg /= a.length;
			return avg;
		}

		let value=0;
		const valeurs: number[] = [];
		const aggregtype = this.getNodeParameter('aggregation', 0) as string;
		for(let i=0; i<previousData.length; i++) {
			valeurs.push(previousData[i].json.score as number);

		}
		switch(aggregtype) {
			case 'min': value = findMin(valeurs); break;
			case 'max': value = findMax(valeurs); break;
			case 'avg': value = findAvg(valeurs); break;
			default: value=0;
		}
		returnData.push({
			'value': value,
		});


		return [this.helpers.returnJsonArray(returnData)];


	}

}
