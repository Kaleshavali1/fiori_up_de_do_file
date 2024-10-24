sap.ui.define([
    "sap/m/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader",
	"sap/m/MessageBox"
],
function (MobileLibrary, Controller, Item, JSONModel, Uploader,MessageBox) {
    "use strict";

    return Controller.extend("com.fiori.fiori.controller.fiori", {
        // Assuming this is part of your controller
        onInit: function () {
  // Call the function to fetch data
  const url = "https://port4004-workspaces-ws-9bd5s.us10.trial.applicationstudio.cloud.sap/media/MediaFile";
  const that = this;
  fetch(url)
	  .then(response => {
		  if (!response.ok) {
			  throw new Error('Network response was not ok ' + response.statusText);
		  }
		  return response.json();
	  })
	  .then(data => {
		  console.log(data.value);
		  var oJSONModel = new JSONModel();
		  oJSONModel.setData(data.value);
		  // console.log(oJSONModel,"hii");
		  that.getView().setModel(oJSONModel, "mediafile")
	  })
	  .catch(error => {
		  console.error('There was a problem with the fetch operation:', error);
	  });
			
			var sPath = sap.ui.require.toUrl("http://localhost:4004/media/MediaFile");
				var oUploadSet = this.byId("UploadSet");

			 this.getView().setModel(new JSONModel(sPath));

			// Modify "add file" button
			oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			oUploadSet.getDefaultFileUploader().setTooltip("");
			oUploadSet.getDefaultFileUploader().setIconOnly(true);
			oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
			oUploadSet.attachUploadCompleted(this.onUploadCompleted.bind(this));
			
			
		},
        

       



		onselect(){
			var oUploadSet = this.byId("table0");
		},
		onDelete: function () {
			const oUploadSet = this.getView().byId("table0");
			const aSelectedItems = oUploadSet.getSelectedItems();
		
			// Remove each selected item from the UploadSet
			aSelectedItems.forEach(oItem => {
				oUploadSet.removeItem(oItem);
			});
		},
        onAfterItemAdded: async function (oEvent) {
           
            const oUploadSet = this.byId("UploadSet");
            // const i18n = this.getModel("i18n").getResourceBundle();
            const oItem = oEvent.getParameter("item");
			const oDataModel = oUploadSet.getModel();
           
			// const sServiceUrl = oDataModel.sServiceUrl;
			
			// const oContext = this.getView().getBindingContext(); // Use this to get the binding context
			// const sHeaderId = oContext ? oContext.getObject().id : null; // Safely access ID
           
            // const CSRFToken = oDataModel.getHttpHeaders()["X-CSRF-Token"]
            const oUploadData = {
                mediaType: oItem.getMediaType(),
                fileName: oItem.getFileName(),
				size: oItem.getFileObject().size,
				// size: oItem.getFileObject().size // Adding file size
				url: oItem.url  // Adding the URL if oItem has a method or property for URL
            };
            const oSettings = {
                url: `/media/MediaFile`,
                method: "POST",
                headers: {
                    "Content-type": "application/json",
					
                },
                data: JSON.stringify(oUploadData)
            };

          try{
			const result =await $.ajax(oSettings);
			const id = result.id;
                    const url = `/media/MediaFile/${id}/content`;
                    oItem.setUploadUrl(url);
					oUploadSet.setHttpRequestMethod("PUT");
                    oUploadSet.removeAllHeaderFields()
                    oUploadSet.addHeaderField(new Item({
                        key: 'X-CSRF-Token',
                        text: CSRFToken
                    }));
                    oUploadSet.uploadItem(oItem);
                }
                catch(error){
                    console.log("fileUploadErr", error.responseJSON?.error?.message || "upload failed");
                }
        },

		
	onUploadSelectedButton: function () {
		var oUploadSet = this.byId("UploadSet");

		oUploadSet.getItems().forEach(function (oItem) {
			if (oItem.getListItem().getSelected()) {
				oUploadSet.uploadItem(oItem);
			}
		});
	},
	onDeleteSelect: function () {
	
		const oUploadSet = this.getView().byId("UploadSet");
		const aSelectedItems = oUploadSet.getSelectedItems();
	
		// Remove each selected item from the UploadSet
		aSelectedItems.forEach(oItem => {
			oUploadSet.removeItem(oItem);
		});
					
	},
	onDownloadSelectedButton: function () {
		var oUploadSet = this.byId("UploadSet");
 
		oUploadSet.getItems().forEach(function (oItem) {
			if (oItem.getListItem().getSelected()) {
				oItem.download(true);
			}
		});
	},
	onSelectionChange: function() {
		var oUploadSet = this.byId("UploadSet");
		// If there's any item selected, sets version button enabled
		if (oUploadSet.getSelectedItems().length > 0) {
			if (oUploadSet.getSelectedItems().length === 1) {
				this.byId("versionButton").setEnabled(true);
			} else {
				this.byId("versionButton").setEnabled(false);
			}
		} else {
			this.byId("versionButton").setEnabled(false);
		}
	},
	onVersionUpload: function(oEvent) {
		var oUploadSet = this.byId("UploadSet");
		this.oItemToUpdate = oUploadSet.getSelectedItem()[0];
		oUploadSet.openFileDialog(this.oItemToUpdate);
	},
	onUploadCompleted: function(oEvent) {
		// this.oItemToUpdate = null;
		// this.byId("versionButton").setEnabled(false);
		// // add item to the model
		// var oItem = oEvent.getParameter("item");
		// var oModel = this.getView().getModel();
		// var aItems = oModel.getProperty("/media/MediaFile");
		// var oItemData = this._getItemData(oItem);
		// aItems.unshift(oItemData);
		// oModel.setProperty("/media/MediaFile", aItems);
		// oModel.refresh();
		var oUploadSet = this.byId("UploadSet");
		oUploadSet.removeAllIncompleteItems();
		oUploadSet.getBinding("items").refresh();

	},
	onAfterItemRemoved: function(oEvent) {
		// remove item from the model
		var oItem = oEvent.getParameter("item");
		var oModel = this.getView().getModel();
		var aItems = oModel.getProperty("http://localhost:4004/media/MediaFile");
		var oItemData = oItem?.getBindingContext()?.getObject();
		var iIndex = aItems.findIndex((item) => {
			return item.id == oItemData?.id;
		});
		if (iIndex > -1) {
			aItems.splice(iIndex, 1);
			oModel.setProperty("http://localhost:4004/media/MediaFile", aItems);
		}
	},
	_getItemData: function(oItem) {
		const iId = Math.floor(Math.random() * 1000000);
		const oFileObject = oItem.getFileObject();
		return {
			id: iId,
			fileName: oItem?.getFileName(),
			uploaded: new Date(),
			uploadedBy: "John Doe",
			mediaType: oFileObject.type,
			// URL to the uploaded file from blob.
			url: oItem?.getUrl() ? oItem?.getUrl() : URL.createObjectURL(oFileObject),
			statuses: [
				{
					"title": "Uploaded By",
					"text": "Jane Burns",
					"active": true
				},
				{
					"title": "Uploaded On",
					"text": "Today",
					"active": false
				}
			]
		};
	}
	
});
});
// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/m/MessageBox"
// ],
//     /**
//      * @param {typeof sap.ui.core.mvc.Controller} Controller
//      */

   
//     function (Controller, MessageBox) {
//         "use strict";

//         return Controller.extend("com.fiori.fiori.controller.fiori", {
//             onInit: function () {
//                 const oModel = new sap.ui.model.odata.v2.ODataModel("/media/MediaFile", {
//                     json: true,
//                     defaultBindingMode: "TwoWay"
//                 });
//                 sap.ui.getCore().setModel(oModel);
//             },

//             _getBaseURL: function () {
//                 var oBaseUrl = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
//                 return jQuery.sap.getModulePath(oBaseUrl)
//             },

//             /**
//              * on File Change
//              */
//             onFileChange: function (oEvent) {
//                 var file = oEvent.getParameters("files").files[0];
//                 this.file = file;
//             },
//             uploadUrl: "/media/MediaFiles", // Replace with your backend URL
//             itemAdded: function (oEvent) {
//                 const oItem = oEvent.getParameter("item");
//                 // Here, handle the item after it's added
//             },
//             uploadComplete: function (oEvent) {
//                 const oResponse = oEvent.getParameter("response");
//                 // Handle upload completion
//             },
//             /**
//              * On File Upload
//              */
//             onUploadFile: function () {
//                 var oUploadSet = this.byId("__fileUploader");
//                 //Upload image
//                 var reader = new FileReader();
//                 reader.onload = function (oEvent) {
//                     // get an access to the content of the file
//                     this.content = oEvent.currentTarget.result;
//                     this.createfile();
//                 }.bind(this);
//                 reader.readAsDataURL(this.file);

//             },

//             /**
//              *  Create Operation to create an entry in CAP
//              */
//             createfile: function () {
//                 var that = this;
//                 // Data for CAP to create entry
//                 var oImageData = {
//                     "content": this.content,
//                     "mediaType": this.file.type,
//                     "fileName": this.file.name
//                 };
//                 var oCAPModel = this.getOwnerComponent().getModel("oCAPModel");
//                 var sURL = "/MediaFile";
//                 //Create call for CAP OData Service
//                 oCAPModel.create(sURL, oImageData, {
//                     success: function (oData, oResponse) {
//                         var id = oData.id;
//                         var sMsg = "File Uploaded Successfully for ID: " + id;
//                         MessageBox.success(sMsg);
//                     },
//                     error: function (jqXHR, textStatus) {

//                     },
//                 });
//             },


//         });
//     });