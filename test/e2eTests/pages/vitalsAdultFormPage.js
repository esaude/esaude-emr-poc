const Page = require('./page')

class VitalsAdultFormPage extends Page {

	constructor() {
		super({
			isLoaded: {
				element: '[name="aForm"]',
				urlPart: '/vitals/adult',
			},
		})

		this._initFields()
	}

	fillForm(data) {
		this.I.fillField(this.fields.temperature, data.temperature);
		this.I.fillField(this.fields.weight, data.weight);
		this.I.fillField(this.fields.height, data.height);
		this.I.fillField(this.fields.systolicBloodPressure, data.systolicBloodPressure);
		this.I.fillField(this.fields.diastolicBloodPressure, data.diastolicBloodPressure);
		this.I.fillField(this.fields.cardiacFrequency, data.cardiacFrequency);
		this.I.fillField(this.fields.respiratoryRate, data.respiratoryRate);
	}

	next() {
		this.I.click('[name="aForm"] button');
	}

	verifyForm(data) {
		this.I.see(data.temperature);
		this.I.see(data.weight);
		this.I.see(data.height);
		this.I.see(data.systolicBloodPressure);
		this.I.see(data.diastolicBloodPressure);
		this.I.see(data.cardiacFrequency);
		this.I.see(data.respiratoryRate);
	}

	_initFields() {
		const getFieldData = (fieldName) => `input[name="${fieldName}"]`

		this.fields = {
			temperature: getFieldData('Temperatura'),
			weight: getFieldData('Peso'),
			height: getFieldData('Altura'),
			systolicBloodPressure: getFieldData('PressoArterialSistolica'),
			diastolicBloodPressure: getFieldData('PressoArterialDiastolica'),
			cardiacFrequency: getFieldData('FrequenciaCardiaca'),
			respiratoryRate: getFieldData('FrequenciaRespiratria'),
		};
	}
}

module.exports = new VitalsAdultFormPage()
