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

function calculate(info){
  var summary = info.pri_1*info.qun_1 + info.pri_2*info.qun_2 + info.pri_3*info.qun_3;
  var box_num = info.qun_1 + info.qun_2 + info.qun_3;
  if (box_num <3){
    result = summary + 160; //兩盒裝運費
  } else if (box_num <5 || box_num >=3) {
    result = summary + 225; //四盒裝運費
  } else {
    result = summary + " 請連在Line 確認運費ˋ";
  }
  return result;
}


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}