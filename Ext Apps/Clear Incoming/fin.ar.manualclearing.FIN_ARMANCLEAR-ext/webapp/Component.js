jQuery.sap.declare("fin.ar.manualclearing.fin_armanclear-ext.Component");

// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "fin.ar.manualclearing",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/FIN_ARMANCLEAR"

	// we use a URL relative to our own component
	// extension application is deployed with customer namespace
});

//Original
fin.ar.manualclearing.Component.extend("fin.ar.manualclearing.fin_armanclear-ext.Component", {
	metadata: {
		manifest: "json"
	},
	
	init() {
		//Needed for fin.arp.lib.clearing library
		this.getMetadata()._sLibraryName = 'fin.ar.manualclearing';  
		if(this.getMetadata()._oMetadata) {  //In on-premise it's different path
			this.getMetadata()._oMetadata._sLibraryName = "fin.ar.manualclearing";		
		}
		
		fin.ar.manualclearing.Component.prototype.init.apply(this, arguments);

		sap.ui.require(["sap/fin/arp/lib/clearing/controller/AbstractClearingController"], function(Abs) {
			let fnOnAfterVariantInitialiseToBeClearedItems = Abs.prototype.onAfterVariantInitialiseToBeClearedItems;
			Abs.prototype.onAfterVariantInitialiseToBeClearedItems = function(){ 
				fnOnAfterVariantInitialiseToBeClearedItems.apply(this, arguments);

				//
				// let oInput = new sap.m.Input({
				// 	value: {				
				// 		path: 'ZZ_XREF2'
				// 	},
				// });		
				// this.getView().byId("toBeClearedItemsSmartTable")._oTableProvider._aTableViewMetadata[11].template = oInput;

				//Make it visible
				// this.getView().byId("toBeClearedItemsSmartTable")?.applyVariant({"columns":{"columnsItems":[{"columnKey": "ZZ_XREF2", "visible": true}] } });


				//
				//Set header date
				// this.getView().byId('header--Form')?.getFormContainers()[0].getFormElements()[0].getFields()[0].setValue( new Date('2023-01-01') );

				// this.zzOnXrefChange = function(oEvent) {
				// 	var oInput = oEvent.getSource();
				// 	this.zzValidateInput(oInput);
				// }

				// this.zzValidateInput = function(oInput) {
				// 	var sValueState = "None";
				// 	var bValidationError = false;

				// 	var oBinding = oInput.getBinding("value");
				// 	// let oProperty = oBinding.getModel()?.oMetadata?.mEntityTypes["APAROpenItem"]?.property.find(o=>o.name == oBinding.sPath);
				// 	let oProperty = oInput.data('zzProperty');
				// 	if(oBinding.getValue().length > oProperty?.maxLength) {
				// 		sValueState = "Error";
				// 		bValidationError = true;
				// 	}
		
				// 	oInput.setValueState(sValueState);
				// 	oInput.openValueStateMessage();
		
				// 	return bValidationError;						
				// }

				if(this.zzIsFormExtended)
					return;
				else
					this.zzIsFormExtended = true;

				this.zzGetFormContainer = function(sFieldName, sFieldLabel) {
					//Add into onAccount fragment
					let oVBox = new sap.m.VBox();
					let oProperty = this.getModel()?.oMetadata?.mEntityTypes["FAC_FINANCIALS_POSTING_SRV.FinsPostingAPARItem"]?.property.find(o=>o.name == sFieldName);
					let iMaxLength = parseInt(oProperty?.maxLength) || 20;
					let oInput2 = new sap.m.Input({
						"value": "{" + sFieldName + "}",
						"type": "Text",
						"maxLength": iMaxLength,
						"placeholder": "custom field",
						"valueStateText": "Max length is: " + oProperty?.maxLength || 20
						// "change": this.zzOnXrefChange.bind(this)							
					})
					oInput2.data('zzProperty', oProperty);

					let oLabel2 = new sap.m.Label({
						"text": sFieldLabel
					});
					oVBox.addItem(oLabel2);
					oVBox.addItem(oInput2);
					let aFields = [oVBox];


					var oFormElement = new sap.ui.layout.form.FormElement({
						"fields": aFields,				
					});
				
					var oFormContainer = new sap.ui.layout.form.FormContainer({ 
						formElements: [ oFormElement ]
					});

					return oFormContainer;
				}
 
				let oOnAccountForm = this.getView().byId('OnAccountForm');
				oOnAccountForm?.addFormContainer( this.zzGetFormContainer('Reference1IDByBusinessPartner', "Reference Key 1") );
				oOnAccountForm?.addFormContainer( this.zzGetFormContainer('Reference2IDByBusinessPartner', "Reference Key 2") );
				oOnAccountForm?.addFormContainer( this.zzGetFormContainer('Reference3IDByBusinessPartner', "Reference Key 3") );
				oOnAccountForm?.addFormContainer( this.zzGetFormContainer('Zz1Xref6Cob', "Pep Reference Key 6") );			
			};
		});
	}
});
