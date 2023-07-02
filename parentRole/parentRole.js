    // imports are used for different purposes like use different functions of salesforce, fetch Apex class
// ,displaying toast messages , fetching the custom object from salesforce
//  and accessing user profile information.
import { LightningElement, wire } from 'lwc'; 
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import FetchRole from '@salesforce/apex/roleHandling.FetchRole';
import Employees__c from '@salesforce/schema/Employees__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import  getUserProfile from '@salesforce/apex/UserProfile.getUserProfile';

// Lightning Web Component class called RoleHandlingComponent and exports it as the default export

export default class RoleHandlingComponent extends LightningElement {

//These properties are used to store data and handle user interactions within the component.
    role;
    reviewData;
    showGrid = false;

    roleOptions = [
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' },
        { label: 'L3', value: 'L3' },
    ];

    formFields = {} 

// getUserProfile Apex method to retrieve the user profile information. 
userProfileName='';
@wire(getUserProfile)
wiredData(userProfile)
{
const {data,error}=userProfile;
if(data)
{
this.userProfileName=data;
console.log('userProfileName--'+this.userProfileName);
}
}
// Logic: If System Admin logged in then Self Rating and self comment blocks are disabled
get employeeReviewReadOnly()
{
if(this.userProfileName=='')
{
return true;
}
else if(this.userProfileName=='Employee')
{
return false;
}
else
{
return true;
}

} 
//Logic: If Employee logged in then Manager Rating and Manger comment blocks are disabled
get ManagerReviewReadOnly()
{
if(this.userProfileName=='')
{
return true;
}
else if(this.userProfileName=='System Administrator')
{
return false;
}
else
{
return true;
}

} 


//This method is triggered when the role selection is changed and its sets the role value in the Role__c field.
    handleRoleChange(event) {
        this.role = event.target.value;
        const { name, value } = event.target
        this.formFields[name] = value
        this.showGrid = true;
    }

//It retrieves the record data specified by the recordId, which is bound to the
// reviewData property. The fields parameter specifies the fields to be fetched from 
//the record. 
    @wire(getRecord, { recordId: '$reviewData', fields: ['Reviews__c.Core_Responsibilty__c', 'Reviews__c.Value_Creation__c',
     'Reviews__c.Continuos_improvement__c', 'Reviews__c.Compliance__c', 
    'Reviews__c.Core_Responsibilty_weightage__c', 'Reviews__c.Value_Creation_weightage__c',
     'Reviews__c.Continuos_improvement_Weightage__c', 'Reviews__c.Compliance_Weightage__c'] })

//The result of the wire service is stored in the wiredReviewData property.   

    wiredReviewData;


//This method is called when the review data needs to be fetched based
// on the selected role. It calls the FetchRole Apex method and passes the role property as a parameter.
    fetchReviewData() {
        FetchRole({ role: this.role })
            .then(result => {
                this.reviewData = result.Id;
            })
            .catch(error => {
                // Handle error
            });
    }

//This method is triggered when there is an input change in the form fields.

    handleInputChange(event) {
        const { name, value } = event.target
        this.formFields[name] = value
        console.log('values>>'+this.formFields);
    }

//This method will triggered when the form is submitted.
// It creates a new record using the createRecord function from the lightning/uiRecordApi module.

    handleSubmit() {
    
        const recordInput = { apiName:  Employees__c.objectApiName, fields:this.formFields };
        
        createRecord(recordInput).then(result => {
            this.showToast('Success!!', `contact created with is ${result.id}`)
            //this.template.querySelector('form.createForm').reset()
            //this.formFields = {}
        }).catch(error => {
            this.showToast('Error Creating record', error.body.message, 'error')
        })
        }

//This method is responsible for dispatching a toast event to display a message to the user.
        showToast(title, message, variant) {
            this.dispatchEvent(new ShowToastEvent({
                title,
                message,
                variant: variant || 'success'
            }))
        }

}