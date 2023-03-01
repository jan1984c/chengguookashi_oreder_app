var url = "https://docs.google.com/spreadsheets/d/14HBXe4Q-LVVwtjf3c8OeHZcZPjOqVSZDplnWSDiLTqw/edit#gid=0";

var pricelist = [];
var activitylist = [];
var discountlist = [];
var sourcelist = [];
var coupon_check = 0;
var coupon_activity = "";
var coupon_source = "";
// var order_flower = 0;
// var order_maple = 0;
// var order_cat = 0;
// var order_num = 0;
// var order_sum = 0;


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

  var check = temp.evaluate();
  var displayWeb = check.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  
  return displayWeb;
}

function couponcheck(coupon_number){
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Renders");
  var list = ws.getRange(2,1,ws.getRange("A2").getDataRegion().getLastRow() -1 ,ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
    var couponlist = list.map(function(r){return r[3]});
    activitylist = list.map(function(r){return r[4]});
    discountlist = list.map(function(r){return r[5]});
    sourcelist = list.map(function(r){return r[6]});
    coupon_number = Number(coupon_number);
    coupon_check = couponlist.indexOf(coupon_number);
    coupon_activity = activitylist[coupon_check];
    coupon_source = sourcelist[coupon_check];

if (coupon_check > -1){
  return "OK";
  } else {
    return "Fail";
  }
}

function calculate_1(info){
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Activity");
  var list = ws.getRange(3,1,ws.getRange("A2").getDataRegion().getLastRow() -1 ,ws.getRange("A1").getDataRegion().getLastColumn()).getValues();

  var flower_pri = 0;
  var result = {};
  var box_num = Number(info.qun_2) + Number(info.qun_3);
  var summary = info.pri_2*info.qun_2 + info.pri_3*info.qun_3;
  order_num = box_num;

  //春櫻禮盒優惠

  //計算春櫻禮盒內容
    if (info.qun_1 > 0) {
      result.activity_flower = "春櫻禮盒優惠";
    }
    if (info.qun_1 == 1){
      flower_pri = info.qun_1*info.pri_1*list[1][2];
    }
    if (info.qun_1 == 2){
      flower_pri = info.qun_1*info.pri_1*list[1][3];
    }
    if (info.qun_1 ==3) {
      flower_pri = info.qun_1*info.pri_1*list[1][4];
    }
    if (info.qun_1 > 3) {
      flower_pri = info.qun_1*info.pri_1*list[1][5];
      }
    result.flower_pri = flower_pri;
  //計算其他禮盒內容
        result.activity = "標準折扣";
    if (box_num > 1 && box_num <3){
        summary = Number(summary*0.95); //兩盒95折優惠
        result.discout = "0.95";
    } else if (box_num > 3) {
        summary = Number(summary*0.85); //四盒85折優惠
        result.discout = "0.85";
      } else {
        summary = summary;
        result.discout = "無優惠";
      }

  summary = Math.round(summary + flower_pri);
  box_num = box_num + Number(info.qun_1);    

    // 運費計算;
  if (box_num < 3 ){ 
    result.sum = summary + 160; //兩盒裝運費
    result.ship = 160;
    }  else if (box_num < 5){
    result.sum = summary + 225; //四盒裝運費
    result.ship = 225;
  }
  else {
    result.ship = "待定";
    result.sum = summary + " 請在Line上確認運費";
  }
  order_sum = result.sum;
  return result;

 
}

function calculate(info){

  var result = {};
  var summary = info.pri_1*info.qun_1 + info.pri_2*info.qun_2 + info.pri_3*info.qun_3;
  // var summary = 1;
  var box_num = Number(info.qun_1) + Number(info.qun_2) + Number(info.qun_3);
  order_num = box_num; //update varable
  // var box_num = 2;
  // var t1 = Number(info.coupon);
  couponcheck(info.coupon);

  //折扣計算
  if (coupon_check > -1 ){
    result.discout = String(discountlist[coupon_check]);
    result.activity = coupon_activity;

    if (discountlist[coupon_check] > 0){
      summary = Number(summary*discountlist[coupon_check]);
    } else {
      summary = Number(summary + discountlist[coupon_check]*box_num);
    }
  } else {
    result.activity = "標準折扣";
    if (box_num > 1 && box_num <3){
        summary = Number(summary*0.95); //兩盒95折優惠
        result.discout = "0.95";
    } else if (box_num > 3) {
        summary = Number(summary*0.85); //四盒85折優惠
        result.discout = "0.85";
      } else {
        summary = summary;
        result.discout = "無優惠";
      }
    } 
  // 運費計算;
  if (box_num < 3 ){ 
    result.sum = summary + 160; //兩盒裝運費
    result.ship = 160;
    }  else if (box_num < 5){
    result.sum = summary + 225; //四盒裝運費
    result.ship = 225;
  }
  else {
    result.sum = summary + " 請在Line上確認運費";
  }
  order_sum = result.sum;
  return result;
}


function uploaddata(order_data){
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Order");
  
  couponcheck(order_data.coupon_number);

  var order_no = "New";
  var order_source =coupon_source;
  var order_name= order_data.order_name;
  var order_note = order_data.note;
  var order_address = order_data.address;
  var order_phone = order_data.phone;
  var order_email = order_data.email;
  var order_flower = order_data.order_flower;
  var order_maple = order_data.order_maple;
  var order_cat = order_data.order_cat;
  var order_num = order_data.order_num;
  var order_sum = order_data.order_sum;
  ws.appendRow([order_no, new Date(), order_source, order_name, order_flower, order_maple, order_cat, order_num, "", order_sum, "", "",  order_note, order_name, order_address, order_phone, order_email, ""]);

  // send an email
  var subject = "有人在誠菓手作網站送出訂單喔!";
  var body = "we'll get back to you";
  var htmlTemplate = HtmlService.createTemplateFromFile("email");
  var flower_gift = "";
  var maple_gift = "";
  var cat_gift = "";

  if (order_flower > 0) {
    flower_gift = "春櫻禮盒" + "*" + order_flower;
  }
  if (order_maple > 0) {
    maple_gift = "楓紅禮盒" + "*" + order_maple;
  }
  if (order_cat > 0) {
    cat_gift = "貓族禮盒" + "*" + order_cat;
  }

  htmlTemplate.name = order_name;
  htmlTemplate.flower = flower_gift;
  htmlTemplate.maple = maple_gift;
  htmlTemplate.cat = cat_gift;  
  var htmlBody = htmlTemplate.evaluate().getContent();
  GmailApp.sendEmail("Geogia10323@gmail.com  ", subject, body, {htmlBody: htmlBody});
}


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}