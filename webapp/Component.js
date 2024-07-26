/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "edidownloadapp/model/models",
       
       
       
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("edidownloadapp.Component", {
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
                var CryptoJspath=sap.ui.require.toUrl("edidownloadapp/model/crypto-js.min.js")
               var Jquerypath=sap.ui.require.toUrl("edidownloadapp/model/jquery.min.js")
               var Aespath=sap.ui.require.toUrl("edidownloadapp/model/aes.min.js")

                jQuery.sap.includeScript(CryptoJspath);
                jQuery.sap.includeScript(Jquerypath);
                jQuery.sap.includeScript(Aespath);

                
                  // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);