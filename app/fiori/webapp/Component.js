/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/fiori/fiori/model/models",
        "sap/ui/model/odata/v4/ODataModel"
    ],
    function (UIComponent, Device, models,ODataModel) {
        "use strict";

        return UIComponent.extend("com.fiori.fiori.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
               // set data model
               var oDataModel = new ODataModel(
                { serviceUrl: "https://port4004-workspaces-ws-9bd5s.us10.trial.applicationstudio.cloud.sap/media/"
            });
               console.log(oDataModel);
               this.setModel(oDataModel);
            }
        });
    }
);