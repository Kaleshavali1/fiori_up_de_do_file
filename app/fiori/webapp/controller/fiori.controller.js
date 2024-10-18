sap.ui.define([
    "sap/m/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader"
],
function (MobileLibrary, Controller, Item, JSONModel, Uploader) {
    "use strict";

    return Controller.extend("com.fiori.fiori.controller.fiori", {
        // Assuming this is part of your controller
        onInit: function () {
			var sPath = sap.ui.require.toUrl("https://port4004-workspaces-ws-9bd5s.us10.trial.applicationstudio.cloud.sap/media/MediaFile"),
				oUploadSet = this.byId("UploadSet");

			 this.getView().setModel(new JSONModel(sPath));

			// Modify "add file" button
			oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			oUploadSet.getDefaultFileUploader().setTooltip("");
			oUploadSet.getDefaultFileUploader().setIconOnly(true);
			oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
			oUploadSet.attachUploadCompleted(this.onUploadCompleted.bind(this));
			
		},
   
	onUploadSelectedButton: function () {
		var oUploadSet = this.byId("UploadSet");

		oUploadSet.getItems().forEach(function (oItem) {
			if (oItem.getListItem().getSelected()) {
				oUploadSet.uploadItem(oItem);
			}
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
		this.oItemToUpdate = null;
		this.byId("versionButton").setEnabled(false);
		// add item to the model
		var oItem = oEvent.getParameter("item");
		var oModel = this.getView().getModel();
		var aItems = oModel.getProperty("mainModel>/MediaFile");
		var oItemData = this._getItemData(oItem);
		aItems.unshift(oItemData);
		oModel.setProperty("mainModel>/MediaFile", aItems);
		oModel.refresh();
	},
	onAfterItemRemoved: function(oEvent) {
		// remove item from the model
		var oItem = oEvent.getParameter("item");
		var oModel = this.getView().getModel();
		var aItems = oModel.getProperty("mainModel>/MediaFile");
		var oItemData = oItem?.getBindingContext()?.getObject();
		var iIndex = aItems.findIndex((item) => {
			return item.id == oItemData?.id;
		});
		if (iIndex > -1) {
			aItems.splice(iIndex, 1);
			oModel.setProperty("mainModel>/MediaFile", aItems);
		}
	},
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