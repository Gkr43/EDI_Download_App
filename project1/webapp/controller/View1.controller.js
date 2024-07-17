sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("project1.controller.View1", {

        onGenerateGateEntry: function () {
            var oView = this.getView();
            var oModel = oView.getModel();

            // Get user input values
            var sEdiNumber = oView.byId("ediNumberInput").getValue();
            var sPlant = oView.byId("plantInput").getValue();

            // Validate user input
            if (!sEdiNumber || isNaN(sEdiNumber) || !sPlant) {
                MessageBox.error("Please enter valid numeric values for EDI Number and fill in the Plant.");
                return;
            }

            // Convert EDI number to integer
            sEdiNumber = parseInt(sEdiNumber, 10);

            // Check for duplicate EDI number
            this._checkDuplicateEdiNumber(sEdiNumber, sPlant, oModel);
        },

        _checkDuplicateEdiNumber: function (ediNumber, plant, oModel) {
            var that = this;

            // Read existing entries to check for duplicate EDI_NUMBER_1
            oModel.read("/YY1_EDI_INITIAL", {
                success: function (oData) {
                    // Check if any existing entry has the same EDI_NUMBER_1
                    var isDuplicate = oData.results.some(function (item) {
                        return parseInt(item.EDI_NUMBER_1, 10) === ediNumber;
                    });

                    if (isDuplicate) {
                        MessageBox.error("EDI number " + ediNumber + " already has a gate entry.");
                    } else {
                        // If no duplicate, determine the next sequence number and create the entry
                        that._determineNextSequenceNumberAndCreateEntry(ediNumber, plant, oModel, oData.results);
                    }
                },
                error: function (oError) {
                    MessageBox.error("Error checking for duplicate EDI number: " + oError.message);
                }
            });
        },

        _determineNextSequenceNumberAndCreateEntry: function (ediNumber, plant, oModel, existingEntries) {
            var nextSequenceNumber = 10000000000; // Default initial sequence number

            if (existingEntries.length > 0) {
                // Extract and parse the GATE_ENTRY_1 values as integers
                var gateEntries = existingEntries.map(item => parseInt(item.GATE_ENTRY_1, 10));

                // Calculate the maximum existing gate entry number and increment it
                var maxGateEntryNumber = Math.max(...gateEntries);
                nextSequenceNumber = maxGateEntryNumber + 1;
            }

            // Proceed to create the new gate entry with the calculated sequence number
            this._createGateEntry(ediNumber, plant, nextSequenceNumber);
        },

        _createGateEntry: function (ediNumber, plant, gateEntryNumber) {
            var oModel = this.getView().getModel();
        
            // Prepare the payload for the new entry
            var oNewEntry = {
                EDI_NUMBER_1: ediNumber.toString(), // Send EDI_NUMBER as a string
                GATE_ENTRY_1: gateEntryNumber.toString(), // Use the calculated sequence for GATE_ENTRY_1
                PLANT: plant
            };
        
            // Create the new gate entry
            oModel.create("/YY1_EDI_INITIAL", oNewEntry, {
                success: function () {
                    MessageBox.success("Gate Entry generated successfully", {
                        onClose: function () {
                            // Refresh the page after the message box is closed
                            location.reload();
                        }
                    });
                },
                error: function (oError) {
                    MessageBox.error("Error creating gate entry: " + oError.message);
                }
            });
        }
    });
});