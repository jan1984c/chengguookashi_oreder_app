var url = "https://docs.google.com/spreadsheets/d/14HBXe4Q-LVVwtjf3c8OeHZcZPjOqVSZDplnWSDiLTqw/edit#gid=0";

var pricelist = [];
var activitylist = [];
var discountlist = [];
var coupon_check = 0;


function doGet(){
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Renders");
  var list = ws.getRange(2,1,ws.getRange("A2").getDataRegion().getLastRow() -1 ,ws.getRange("A1").getDataRegion().getLastColumn()).getValues();

  var qunOptioin = list.map(function(r){return '<option>' + r[7] + '</option>';}).join(''); 
  pricelist = list.map(function(r){return r[2] ;}); 

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
    var couponlist = list.map(function(r){return r[3]});
    activitylist = list.map(function(r){return r[4]});
    discountlist = list.map(function(r){return r[5]});
    coupon_number = Number(coupon_number);
    coupon_check = couponlist.indexOf(coupon_number);

if (coupon_check > -1){
  return "OK";
  } else {
    return "Fail";
  }
}

function calculate(info){
  var summary = info.pri_1*info.qun_1 + info.pri_2*info.qun_2 + info.pri_3*info.qun_3;
  // var summary = 1;
  var box_num = Number(info.qun_1) + Number(info.qun_2) + Number(info.qun_3);
  // var box_num = 2;
  // var t1 = Number(info.coupon);
  couponcheck(info.coupon);
  
  //折扣計算
  if (coupon_check > -1 ){
    if (discountlist[coupon_check] > 0){
      summary = Number(summary*discountlist[coupon_check]);
    } else {
      summary = Number(summary + discountlist[coupon_check]*box_num);
    }
  } else {
    if (box_num > 1 && box_num <3){
        summary = Number(summary*0.95); //兩盒95折優惠
    } else if (box_num > 3) {
        summary = Number(summary*0.85); //四盒85折優惠
      } else {
        summary = summary;
      }
    } 
  // 運費計算;
  if (box_num < 3 ){ 
    var result = summary + 160; //兩盒裝運費
    }  else if (box_num < 5){
    var result = summary + 225; //四盒裝運費
  }
  else {
    var result = summary + " 請在Line上確認運費ˋ";
  }
  return result;
}


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}