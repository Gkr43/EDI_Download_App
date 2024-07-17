sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    
    
],
function (Controller,DateFormat,Filter) {
    "use strict";

    return Controller.extend("edidownloadapp.controller.View1", {
        onInit: function () {
           var oModel=this.getOwnerComponent().getModel();
           
           
           
           
            var that=this;
            oModel.read("/ZC_SD_INVOICES",{
                success:function(oData,OResponse){
                    debugger;
                    for(var i=0;i<oData.results.length;i++){
                        oData.results[i].selected=false;
                        oData.results[i].BLANK="";
                        var blDate = oData.results[i].BillingDocumentDate;
                        if(blDate){
                           // var date=parseInt(blDate.substring(blDate.indexOf("(")+1,blDate.indexOf(")")));
                            var oDateFormat = DateFormat.getDateInstance({
                                pattern: "dd-MMM-yyyy" ///ddmmyyyy
                            });
                           // var dateval= new Date(date);
                            oData.results[i].BillingDocumentDate1 = oDateFormat.format(blDate);
                        }
                      }
                    var json = new sap.ui.model.json.JSONModel(oData);
                    that.getView().setModel(json,"EdiModel");
                    that.byId("EDITabTtl_id").setText("EDI Records("+oData.results.length+")");

                },error:function(oErr){
                    debugger;
                }
            });
            
},
        formatDate(dateval,obj){
            if(dateval){
                var date=parseInt(dateval.substring(dateval.indexOf("(")+1,dateval.indexOf(")")));
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "dd-MMM-yyyy" ///ddmmyyyy
                });
                dateval = new Date(date);
                if(obj){
                    obj.BillingDocumentDate=oDateFormat.format(dateval);
                }
                return oDateFormat.format(dateval);
            }else{
                return "";
            }
            
        },
        onLiveChangeSearch:function(oEvt){
                var sValue= oEvt.getParameter('newValue');
                var oBinding = this.byId('EDIDWTabl_id').getBinding("rows");
                var aFilters=[];
                if(sValue){
                    aFilters.push(new Filter("BillingDocument","Contains", sValue));
                   
                }
                oBinding.filter(aFilters);
        },
        onGo:function(oEvt){
            var aFilters=[];
            var oBinding = this.byId('EDIDWTabl_id').getBinding("rows");
            var oDate = this.byId('DatePickId').getDateValue();
           // var date=parseInt(dateval.substring(dateval.indexOf("(")+1,dateval.indexOf(")")));
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "dd-MMM-yyyy" ///ddmmyyyy
            });
            
            var filDate= oDateFormat.format(oDate);
            if(oDate){
                aFilters.push(new Filter("BillingDocumentDate","EQ", filDate));
            }
            oBinding.filter(aFilters);
        },
        onSelect:function(oEvent){
                debugger;
                var rowIndex=oEvent.getParameter('rowIndex');
				var selectAll=oEvent.getParameter('selectAll');
				var data=this.getView().getModel('EdiModel').getData().results;
                if(selectAll){
                    for(var i=0;i<data.length;i++){
						data[i].selected=true;
					}
                }else if(rowIndex===-1){
                    for(var i=0;i<data.length;i++){
						data[i].selected=false;
					}
                }else{
                    var index=oEvent.getParameter('rowIndex');
                    var obj=oEvent.getSource().getModel('EdiModel').getData().results[index];
                    if(obj.selected===false){
                        obj.selected=true;
                    }else{
                        obj.selected=false;
                     }
                }
        },
        onDownload:function(){
            var content = this.getView().getModel('EdiModel').getData().results;
            var selItm=content.filter(function(e){if(e.selected){return e;}});
            
            if(selItm.length===0){
                sap.m.MessageToast.show('select atleast one line item');
                return;
            }
            for(var i=0;i<selItm.length;i++){
                
                var blDate = selItm[i].BillingDocumentDate;
                if(blDate){
                   // var date=parseInt(blDate.substring(blDate.indexOf("(")+1,blDate.indexOf(")")));
                    var oDateFormat = DateFormat.getDateInstance({
                        pattern: "yyyyMMdd" ///ddmmyyyy
                    });
                   // var dateval= new Date(date);
                   selItm[i].BillingDocumentDate = oDateFormat.format(blDate);
                }
              }
            var a = document.createElement("a");
         
           var result = selItm.map(function(a) {
            return [
               
               // a.BillingDocument,
               // a.BillingDocumentType,
                a.UnloadingPointName,
                a.AccountByCustomer,
                a.TaxNumber1,
                a.ConsumptionTaxCtrlCode,
                a.ConsumptionTaxCtrlCode1,
                a.MaterialByCustomer,
                a.PurchaseOrderByCustomer,
                a.UnderlyingPurchaseOrderItem,
                a.ReferenceDocNo,
                a.BillingDocumentDate,
                a.BillingQuantity,
                a.BASIC_RATE,
               // a.BillingQuantityUnit,
                a.TotalNetAmount,
                a.BLANK,
                a.BLANK,
                a.BLANK,
                a.BLANK,
                a.BLANK,
                a.BASIC_VALUE,
             //   a.TransactionCurrency,
                a.CGST_RATE,
                a.CGST_AMOUNT,
                a.SGST_RATE,
                a.SGST_AMOUNT,
                a.BLANK,
                a.BLANK,
                a.BLANK,
                a.BLANK,
                a.TOTALGROSSAMOUNT,
                a.EWayBill_No,
                a.EWayBill_Date,
                a.BLANK,
                a.BLANK,
                a.BLANK,
                a.qrtext,
                a.BLANK,
                a.BLANK,
                a.BLANK,
                a.BLANK,
               
                //a.customerproduct,
                //a.customerponumber,
                //a.customerpoitem,
                
            ];
        });
        
            var content=result.join('\n');
            // var arr=[];
            // for(var i=0;i<content.length;i++){
            //     var str=content[i]
            // }
            var contentType='text/plain';
            var fileName= "file.txt";
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();


            var reader = new FileReader();
                reader.onload = function (e) {
               // var crypto =   jQuery.sap.require("edidownloadapp.model.ams.js");
                var encrypted = CryptoJS.AES.encrypt(reader.result, content);
                var dataUrl = 'data:data:application/octet-stream,' + encrypted;
                var array1=[];
                array1.push('href=data:data:application/octet-stream,' + encrypted);

                var link = document.createElement("a");
                link.download = 'file' + '.encrypted';
                link.target = "_blank";

                // Construct the uri
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();

                // Cleanup the DOM
                document.body.removeChild(link);
                //delete link;
                };
                $('#thelist').append('FILES: ' + 'file' + '<br>')
                reader.readAsDataURL(file);
              


           
        }
    });
});
