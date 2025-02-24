import { LightningElement, track } from 'lwc';
import saveInspectionSheet from '@salesforce/apex/CreateInspectionSheet.saveInspectionSheetRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import modal from '@salesforce/resourceUrl/PPM_Size';
import myImage from '@salesforce/resourceUrl/Haulbrooke';
import { NavigationMixin } from 'lightning/navigation';


export default class CreateInspectionSheet extends NavigationMixin(LightningElement) {
    myImageUrl = myImage;
     @track isModalOpen = true;
     @track isSignatureAdded = false;
    @track showSignaturePad = false;

    signaturePad;
    drawing = false;
    @track inspectionSheetRecord = {
        Shop_Name__c: '',
        Name_Of_Motor_Carrier__c: '',
        Date__c: '',
        WFS_PO__c: '',
        Mileage__c: '',
        Unit__c: '',
        VIN__c: '', APM_Dry_Service__c: '', BPM_Wet_Service__c: '', Inspect_Air_Cleaners_and_Advise__c: '', Grease_All_Fittings_and_Fifth_Wheel__c: '', Check_and_Fill_All_Fluids__c: '', Adjust_Brakes_As_Needed__c: '', Check_Regular_Coolant__c: '', Glad_Hands__c: '', Service_Brakes__c: '', Parking_Brake__c: '', Brake_Drums_or_Rotors__c: '',
         Hoses_Spacing_Chaffing__c: '', Brake_Tubing__c: '', Tractor_Protection_Valve__c: '',
         Air_Compressor__c: '', Electric_Brakes__c: '', Hydraulic_Brakes__c: '', Vacuum_Systems__c: '', Pintle_Hooks__c: '', Saddle_Mounts__c: '', Sliding_Mechanism__c: '', Fifth_Wheel_Locks_Adjustment__c: '', Not_Leaking__c: '',
        Won_t_burn__c: '', Wipers__c: '', WindShield__c: '', No_Visible_Leaks__c: '', Filler_Cap_Not_Missing__c: '', Tank_Securely_Attached__c: '',
        All_Devices__c: '', Conspicuity_Tape__c: '', Protection_Against_Shifting_Cargo__c: '', Condition_Of_Loading__c: '', Steering_Wheel_Free_Play__c: '', Steering_Column__c: '', 
        Front_Axie_Beam_Components__c: '', Steering_Gear_Box__c: '', Pitman_Arm__c: '', Power_Steering__c: '', Ball_and_Socket_Joints__c: '', Tie_Rods_and_Drag_Links__c: '', Steering_System__c: '', Nuts__c: '', Frame_Members__c: '', Tire_and_Wheel_Clearance__c: '', Adjustable_Axle_Assemblies__c: '', Damage__c: '', Electrical__c: '', Box_Skin__c: '', U_Bolts_Torque_50_llb_ft__c: '', Inspect_Welds_For_Cracking__c: '', Door_Roller_Inspect_and_Lube__c: '', Hinge_Inspect_and_Lube__c: '', Door_Operation_Seals__c: '', Springs_Air_Bags_Height__c: '', Spring_Hangers__c: '', Front_U_Bolt_Torque_270_360_lb_ft__c: '', Rear_U_Bolt_Torque_420_500_lb_ft__c: '', Torque_Radius_or_Tracking_Components__c: '', Inspect_Replace_Cabin_Air_Filter__c: '', Lock_or_Side_Ring__c: '', Welds__c: '', Wheels_and_Rims__c: '', Studs_and_Lug_Nuts__c: '', Wheel_Bearings__c: '', Axle_Seals__c: '', Mudflaps__c: '', Triangles__c: '', Extinguisher__c: '', Placards_Holders__c: '', Horn__c: '', Steering_Axle__c: '', All_Other_Tires__c: '', Completed__c: '', Does_the_DOT_Inspection_Decal_Expire__c: '', Completed_DOT_Inspection__c: '', DOT_Inspection_Expiration_Date__c: '', Does_the_State_Inspection_Decal_Expire__c: '', Completed_State_Inspection__c: '', State_Inspection_Sticker_Expiration_Date__c: '', Comments__c: '', Digital_Signature__c: '', Printed_Name_of_Inspector__c: '', Signature_of_Inspector__c: '', LF_Tires__c: '', LF_Brakes__c: '', LFO_Tires__c: '', LFO_Brakes__c: '', LFI_Tires__c: '', LFI_Brakes__c: '', LRO_Tires__c: '', LRO_Brakes__c: '', LRI_Tires__c: '', LRI_Brakes__c: '', RF_Tires__c: '', RF_Brakes__c: '', RFO_Tires__c: '', RFO_Brakes__c: '', RFI_Tiers__c: '', RFI_Breaks__c: '', RRO_Tires__c: '', RRO_Breaks__c: '', RRI_Tires__c: '', RRI_Brakes__c: ''
    };

    handleInputChange(event) {
        const fieldName = event.target.dataset.field; 
        const isCheckbox = event.target.type === 'checkbox'; 
        this.inspectionSheetRecord[fieldName] = isCheckbox ? event.target.checked : event.target.value;
    }

    handlePicklistChange(event) {
    const field = event.target.dataset.field; // Get the field name from the data attribute
    const selectedValue = event.target.dataset.value; // Get the selected value from the data attribute
    const isChecked = event.target.checked; // Check the current checked state

    // Get all checkboxes for this field
    const checkboxes = this.template.querySelectorAll(`[data-field="${field}"]`);

    if (isChecked) {
        // Ensure only one checkbox is selected per field group
        checkboxes.forEach((checkbox) => {
            checkbox.checked = (checkbox.dataset.value === selectedValue);
        });

        // Update the `inspectionSheetRecord` state
        this.inspectionSheetRecord[field] = selectedValue;
        console.log(`Updated ${field} to ${selectedValue}`);
    } else {
        // If the checkbox is unchecked, clear the field value
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        // Reset the `inspectionSheetRecord` state
        this.inspectionSheetRecord[field] = null;
        console.log(`Cleared ${field}`);
    }
}

    initSignatureCanvas() {
        console.log('OUTPUT : init signature canvas method called');
        var canvas, ctx, flag = false,
            prevX = 0,
            currX = 0,
            prevY = 0,
            currY = 0,
            dot_flag = false;

        var x = "#0000FF",
            y = 2,
            w, h;
        canvas = this.template.querySelector('canvas');
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        w = canvas.width * ratio;
        h = canvas.height * ratio;
        ctx = canvas.getContext("2d");

        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);
        // Set up touch events for mobile, etc
        canvas.addEventListener("touchstart", function (e) {
            var touch = e.touches[0];
            console.log('touch start:=' + touch);
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
            e.preventDefault();
        }, false);
        canvas.addEventListener("touchend", function (e) {
            var mouseEvent = new MouseEvent("mouseup", {});
            canvas.dispatchEvent(mouseEvent);
        }, false);
        canvas.addEventListener("touchmove", function (e) {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
            e.preventDefault();

        }, false);

        // Get the position of a touch relative to the canvas
        function getTouchPos(canvasDom, touchEvent) {
            var rect = canvasDom.getBoundingClientRect();
            return {
                x: touchEvent.touches[0].clientX - rect.left,
                y: touchEvent.touches[0].clientY - rect.top
            };
        }

        function findxy(res, e) {
            const rect = canvas.getBoundingClientRect();
            if (res == 'down') {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - rect.left;
                currY = e.clientY - rect.top;

                flag = true;
                dot_flag = true;
                if (dot_flag) {
                    ctx.beginPath();
                    ctx.fillStyle = x;
                    ctx.fillRect(currX, currY, 2, 2);
                    ctx.closePath();
                    dot_flag = false;
                }
            }
            if (res == 'up' || res == "out") {
                flag = false;
            }
            if (res == 'move') {
                if (flag) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - rect.left;
                    currY = e.clientY - rect.top;
                    draw(canvas, ctx);
                }
            }
        }
        function draw() {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.strokeStyle = x;
            ctx.lineWidth = y;
            ctx.stroke();
            ctx.closePath();
        }

    }

    // Toggle Signature Pad
    toggleSignaturePad(event) {
        this.isSignatureAdded = event.target.checked;
        this.showSignaturePad = event.target.checked;
        if (this.showSignaturePad) {
            setTimeout(() => {
                this.initSignatureCanvas();
            }, 0);
        }
    }

    // Close Signature Modal
    closeSignaturePad() {
        this.showSignaturePad = false;
        this.isSignatureAdded = false;
    }

    // Clear Signature
    clearSignature() {
        const canvas = this.template.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Save Signature
    saveSignature() {
        const canvas = this.template.querySelector('canvas');
        const signatureData = canvas.toDataURL('image/png');
        this.inspectionSheetRecord.Digital_Signature__c = `<img src="${signatureData}" />`;
        this.showSignaturePad = false;
    }


    validateFields() {
    const validations = [
        {
            field: 'Mileage__c',
            condition: (value) => !value || /^[0-9]+$/.test(value),
            errorMessage: 'Mileage must contain only numeric values or be left empty.'
        },
        {
            field: 'Unit__c',
            condition: (value) => !value || /^[0-9]+$/.test(value),
            errorMessage: 'Unit must contain only numeric values or be left empty.'
        }/*,
       {
            field: 'Digital_Signature__c',
            condition: (value) => value ,
            errorMessage: 'Mechanic signature is required.',
            required: true
        }*/

    ];

    for (const { field, condition, errorMessage } of validations) {
        if (field in this.inspectionSheetRecord) {
            const value = this.inspectionSheetRecord[field];
            if (!condition(value)) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Validation Error',
                        message: errorMessage,
                        variant: 'error',
                    })
                );
                return false;
            }
        }
    }

    return true;
}



    handleSave() {
        if (!this.validateFields()) {
        return;
        }

        saveInspectionSheet({ objIn: this.inspectionSheetRecord })
            .then((result) => {
                const recordId = result;
                console.log('Testing Record Id == > ' + recordId);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!',
                        message: 'Inspection Sheet created successfully.',
                        variant: 'success',
                    })
                );
                 this.clearFormFields();
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: recordId, // Ensure your Apex method returns the record ID
                        objectApiName: 'Inspection_Sheet__c', // Replace with the actual API name
                        actionName: 'view',
                    },
                });
              
            })
            
            .catch((error) => {
                // Show error toast
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }

   clearFormFields() {
    const inputFields = this.template.querySelectorAll('lightning-input');
    inputFields.forEach(field => {
        if (field.type === 'checkbox') {
            field.checked = false; // Reset checkbox
        } else {
            field.value = ''; // Reset text inputs
        }
    });
    }


  handleNavigateBack(event) {
    console.log("Dismissing modal", event.detail);
    this.clearFormFields();
    window.history.back();
    }



}
