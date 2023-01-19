var url = "https://docs.google.com/spreadsheets/d/14HBXe4Q-LVVwtjf3c8OeHZcZPjOqVSZDplnWSDiLTqw/edit#gid=0";

function doGet(){
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Renders");
  var list = ws.getRange(2,1,ws.getRange("A2").getDataRegion().getLastRow() -1 ,ws.getRange("A1").getDataRegion().getLastColumn()).getValues();

  var qunOptioin = list.map(function(r){return '<option>' + r[7] + '</option>';}).join(''); 
  var pricelist = list.map(function(r){return r[2] ;}); 

  var temp = HtmlService.createTemplateFromFile("index");

  temp.quantity = qunOptioin;
  temp.price = pricelist;
  temp.icon = "local_offer";
  
  return temp.evaluate();
}

function couponcheck(coupon_number){
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Renders");
  var list = ws.getRange(2,1,ws.getRange("A2").getDataRegion().getLastRow() -1 ,ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
    var couponlist = list.map(function(r){{return r[3]}});
    var activitylist = list.map(function(r){{return r[4]}});
    coupon_number = Number(coupon_number);

    var check = couponlist.indexOf(coupon_number);

if (check > -1){
  return "OK";
  } else {
    return "Fail";
  }
}


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}