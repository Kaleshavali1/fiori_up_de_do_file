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
//   const url = "https://port4004-workspaces-ws-9bd5s.us10.trial.applicationstudio.cloud.sap/media/MediaFile";
//   const that = this;
//   fetch(url)
// 	  .then(response => {
// 		  if (!response.ok) {
// 			  throw new Error('Network response was not ok ' + response.statusText);
// 		  }
// 		  return response.json();
// 	  })
// 	  .then(data => {
// 		  console.log(data.value);
// 		  var oJSONModel = new JSONModel();
// 		  oJSONModel.setData(data.value);
// 		  // console.log(oJSONModel,"hii");
// 		  that.getView().setModel(oJSONModel, "mediafile")
// 	  })
// 	  .catch(error => {
// 		  console.error('There was a problem with the fetch operation:', error);
// 	  });
			
			// var sPath = sap.ui.require.toUrl("http://localhost:4004/media/MediaFile");
			// 	var oUploadSet = this.byId("UploadSet");

			//  this.getView().setModel(new JSONModel(sPath));
			 var oUploadSet = this.byId("UploadSet");
 
			// Modify "add file" button
			oUploadSet.getDefaultFileUploader().setButtonOnly(false);
			oUploadSet.getDefaultFileUploader().setTooltip("");
			oUploadSet.getDefaultFileUploader().setIconOnly(true);
			oUploadSet.getDefaultFileUploader().setIcon("sap-icon://attachment");
			// oUploadSet.attachUploadCompleted(this.onUploadCompleted.bind(this));
			
			
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
            
            const oItem = oEvent.getParameter("item");
            var file = oItem._oFileObject
        
            // Access the model from the upload set
            const oDataModel = oUploadSet.getModel();
        
            // // Store file metadata
            // this.fileName = oItem.getFileName();
            // this.mediaType = oItem.getMediaType();
            // this.size = oItem.getFileObject().size;
        
			// const reader = new FileReader();
       
            // reader.onload = async function (e)  {
            //     // Get binary data as an ArrayBuffer
            //     const binaryData = e.target.result;
            //     const byteArray = new Uint8Array(binaryData);
       
            //     const sServiceUrl = oDataModel.sServiceUrl;
       
            //     // Prepare upload data for POST request
            //     const oUploadData = {
            //         mediaType: this.mediaType,
            //         fileName: this.fileName,
            //         size: this.size,
            //     };
       
            //     try {
            //         // Perform the Fetch POST request to create the media record
            //         const postResponse = await fetch(`${sServiceUrl}/MediaFile`, {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify(oUploadData),
            //         });
       
            //         if (!postResponse.ok) {
            //             throw new Error("POST request failed.");
            //         }
       
            //         const postData = await postResponse.json();
            //         const mediaId = postData.d.id; // Get the ID of the newly created media
       
            //         // Now prepare to update the content with a PUT request
            //         const putResponse = await fetch(`${sServiceUrl}/MediaFile(${mediaId})/content`, {
            //             method: 'PUT',
            //             body: byteArray, // Updated content
            //         });
       
            //         if (!putResponse.ok) {
            //             throw new Error("PUT request failed.");
            //         }
       
            //         console.log("Media content updated successfully.");
            //         oDataModel.refresh(true);
            //     } catch (error) {
            //         console.log("fileUploadErr", error.message || "Upload failed.");
            //     }
            // };
            // reader.readAsArrayBuffer(oItem._oFileObject);
       
            // Read the file as an ArrayBuffer (triggers the onload event)
            // if (oItem._oFileObject) {
            //     reader.readAsArrayBuffer(oItem._oFileObject);
            // } else {
            //     console.log("No file object found");
            // }
            if (file) {
                // Create a FileReader instance
                var reader = new FileReader();

                console.log(file);
               
                // Define the onload event handler
                reader.onload = async function(event) {
                    // Get the binary data as an ArrayBuffer
                    var binaryData = event.target.result;
                   
                    // You can also convert it to a Uint8Array if needed
                    var byteArray = new Uint8Array(binaryData);
           
                    console.log(byteArray); // This is your file data in binary format
                    // Now you can use byteArray for further processing
                    // const sServiceUrl = oDataModel.sServiceUrl;
       
                    try {
                        // Perform the Fetch POST request to create the media record
                        const postResponse = await fetch(`https://port4004-workspaces-ws-9bd5s.us10.trial.applicationstudio.cloud.sap/media/MediaFile`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "fileName": file.name,
                                "mediaType": file.type,
                            }),
                        });
           
                        if (!postResponse.ok) {
                            throw new Error("POST request failed.");
                        }
           
                        const postData = await postResponse.json();
                        const mediaId = postData.id; // Get the ID of the newly created media
           
                        // Now prepare to update the content with a PUT request
                        const putResponse =  await fetch(`https://port4004-workspaces-ws-9bd5s.us10.trial.applicationstudio.cloud.sap/media/MediaFile(${mediaId})/content`, {
                            method: 'PUT',
                            body: byteArray, // Updated content
                        });
           
                        if (!putResponse.ok) {
                            throw new Error("PUT request failed.");
                        }
           
                        console.log("Media content updated successfully.");
                        oDataModel.refresh(true);
                    } catch (error) {
                        console.log("fileUploadErr", error.message || "Upload failed.");
                    }
                };
           
                // Read the file as an ArrayBuffer (triggers the onload event)
                reader.readAsArrayBuffer(file);
            }
            else {
                console.log("No file selected.");
            }
        },        
       
        // onAfterItemAdded: async function (oEvent) {
           
        //     const oUploadSet = this.byId("UploadSet");
        //     // const i18n = this.getModel("i18n").getResourceBundle();
        //     const oItem = oEvent.getParameter("item");
		// 	const oDataModel = oUploadSet.getModel();
		// 	// const sServiceUrl = oDataModel.sServiceUrl;
			
		// 	// const oContext = this.getView().getBindingContext(); // Use this to get the binding context
		// 	// const sHeaderId = oContext ? oContext.getObject().id : null; // Safely access ID
           
        //     // const CSRFToken = oDataModel.getHttpHeaders()["X-CSRF-Token"]
        //     const oUploadData = {
        //         // mediaType: oItem.getMediaType(),
		// 		 mediaType: oItem.getMediaType() || oItem.getFileObject().type,

		// 		// content: await this.readFileAsBinary(oItem.getFileObject()),
        //         fileName: oItem.getFileName(),
		// 		size: oItem.getFileObject().size,
		// 		// size: oItem.getFileObject().size // Adding file size
		// 		url: oItem.url  // Adding the URL if oItem has a method or property for URL
        //     };
        //     const oSettings = {
        //         url: `/media/MediaFile`,
        //         method: "POST",
        //         headers: {
        //             "Content-type": "application/json",
					
        //         },
        //         data: JSON.stringify(oUploadData)
        //     };

        //   try{
		// 	const result =await $.ajax(oSettings);
		// 	const id = result.id;
        //             const url = `/media/MediaFile/${id}/content`;
        //             oItem.setUploadUrl(url);
		// 			oUploadSet.setHttpRequestMethod("PUT");
        //             oUploadSet.removeAllHeaderFields()
        //             oUploadSet.addHeaderField(new Item({
        //                 key: 'X-CSRF-Token',
        //                 text: CSRFToken
        //             }));
        //             oUploadSet.uploadItem(oItem);
        //         }
        //         catch(error){
        //             console.log("fileUploadErr", error.responseJSON?.error?.message || "upload failed");
        //         }
        // },

		// Reusable helper method to extract ID from URL
        extractIdFromUrl: function (url) {
            const regex = /MediaFile\(([^)]+)\)/; // Regular expression to match the ID
            const match = url.match(regex);
            return match ? match[1] : null; // Return the ID or null if not found
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
	onAfterItemRemoved: async function (oEvent) {
		// remove item from the model
		const oRemovedItem = oEvent.getParameter("item"); // Get the item removed
            const sUrl = oRemovedItem.getProperty("url"); // Get the URL from the item
        
            // Extract the ID from the URL
            const mediaId = this.extractIdFromUrl(sUrl);
            if (!mediaId) {
                console.error("Unable to extract ID from URL:", sUrl);
                return;
            }
        
            try {
                const oUploadSet = this.byId("UploadSet");
                const sServiceUrl = oUploadSet.getModel().sServiceUrl;
        
                // Perform the DELETE request
                const deleteResponse = await fetch(`${sServiceUrl}/MediaFile(${mediaId})`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!deleteResponse.ok) {
                    throw new Error("Failed to delete media item from server.");
                }
                oUploadSet.removeItem(oRemovedItem);
                console.log("Media item successfully deleted from the server.");
        
            } catch (error) {
                console.error("Error deleting media item:", error.message);
            }
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