import { LightningElement, track, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import Reviews__c from '@salesforce/schema/Reviews__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ReviewForm extends LightningElement {
@track selectedRole;
@track showGrid = false;

roleOptions = [
    { label: 'L1', value: 'L1' },
    { label: 'L2', value: 'L2' },
    { label: 'L3', value: 'L3' },
];
formFields = {} 

handleRoleChange(event) {
    const { name, value } = event.target
    this.formFields[name] = value
    this.showGrid = true;
}


handleInputChange(event) {
    const { name, value } = event.target
    this.formFields[name] = value
    console.log('values>>'+this.formFields);
}

handleSubmit() {
    const complianceWeightage = parseInt(this.formFields.Compliance_Weightage__c) || 0;
    const coreResponsibilityWeightage = parseInt(this.formFields.Core_Responsibilty_weightage__c) || 0;
    const valueCreationWeightage = parseInt(this.formFields.Value_Creation_weightage__c) || 0;
    const continuousImprovementWeightage = parseInt(this.formFields.Continuos_improvement_Weightage__c) || 0;

    const totalWeightage = complianceWeightage + coreResponsibilityWeightage + valueCreationWeightage + continuousImprovementWeightage;

    if (totalWeightage === 100) {
        const recordInput = { apiName: Reviews__c.objectApiName, fields: this.formFields };

        createRecord(recordInput).then(result => {
            this.showToast('Success!!', `Contact created with ID ${result.id}`);
            // this.template.querySelector('form.createForm').reset();
            // this.formFields = {};
        }).catch(error => {
            this.showToast('Error Creating record', error.body.message, 'error');
        });
    } else {
        this.showToast('Error', 'The total weightage must be 100.', 'error');
    }
}

showToast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({
        title,
        message,
        variant: variant || 'success'
    }))
}
}
