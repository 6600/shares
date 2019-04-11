"use strict";function _typeof(obj){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj;};}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};}return _typeof(obj);}// 对象合并方法
function assign(a,b){var newObj={};for(var key in a){newObj[key]=a[key];}for(var key in b){newObj[key]=b[key];}return newObj;}// 运行页面所属的方法
function runPageFunction(pageName,entryDom){// ozzx-name处理
window.ozzx.domList={};pgNameHandler(entryDom);// 判断页面是否有自己的方法
var newPageFunction=window.ozzx.script[pageName];if(!newPageFunction)return;// console.log(newPageFunction)
// 如果有created方法则执行
if(newPageFunction.created){// 注入运行环境
newPageFunction.created.apply(assign(newPageFunction,{$el:entryDom,data:newPageFunction.data,activePage:window.ozzx.activePage,domList:window.ozzx.domList}));}// 判断页面是否有下属模板,如果有运行所有模板的初始化方法
for(var key in newPageFunction.template){var templateScript=newPageFunction.template[key];if(templateScript.created){// 获取到当前配置页的DOM
// 待修复,临时获取方式,这种方式获取到的dom不准确
var domList=entryDom.getElementsByClassName('ox-'+key);if(domList.length!==1){console.error('我就说会有问题吧!');console.log(domList);}// 为模板注入运行环境
templateScript.created.apply(assign(newPageFunction.template[key],{$el:domList[0].children[0],data:templateScript.data,activePage:window.ozzx.activePage,domList:window.ozzx.domList}));}}}// ozzx-name处理
function pgNameHandler(tempDom){// 判断是否存在@name属性
var pgName=tempDom.attributes['@name'];if(pgName){// console.log(pgName.textContent)
// 隐藏元素
tempDom.hide=function(){this.style.display='none';};window.ozzx.domList[pgName.textContent]=tempDom;}// 判断是否有点击事件
var clickFunc=tempDom.attributes['@click'];if(clickFunc){tempDom.onclick=function(event){var clickFor=this.attributes['@click'].textContent;// 判断页面是否有自己的方法
var newPageFunction=window.ozzx.script[window.ozzx.activePage];// console.log(this.attributes)
// 判断是否为模板
var templateName=this.attributes['template'];if(templateName){// 如果模板注册到newPageFunction中，那么证明模板没有script那么直接使用eval执行
if(newPageFunction.template){newPageFunction=newPageFunction.template[templateName.textContent];}else{eval(this.attributes['@click'].textContent);return;}}// 取出参数
var parameterArr=[];var parameterList=clickFor.match(/[^\(\)]+(?=\))/g);if(parameterList&&parameterList.length>0){// 参数列表
parameterArr=parameterList[0].split(',');// 进一步处理参数
for(var i=0;i<parameterArr.length;i++){var parameterValue=parameterArr[i].replace(/(^\s*)|(\s*$)/g,"");// console.log(parameterValue)
// 判断参数是否为一个字符串
if(parameterValue.charAt(0)==='"'&&parameterValue.charAt(parameterValue.length-1)==='"'){parameterArr[i]=parameterValue.substring(1,parameterValue.length-1);}if(parameterValue.charAt(0)==="'"&&parameterValue.charAt(parameterValue.length-1)==="'"){parameterArr[i]=parameterValue.substring(1,parameterValue.length-1);}// console.log(parameterArr[i])
}clickFor=clickFor.replace('('+parameterList+')','');}else{// 解决 @click="xxx()"会造成的问题
clickFor=clickFor.replace('()','');}// console.log(newPageFunction)
// 如果有方法,则运行它
if(newPageFunction[clickFor]){// 绑定window.ozzx对象
// console.log(tempDom)
// 待测试不知道这样合并会不会对其它地方造成影响
newPageFunction.$el=this;newPageFunction.$event=event;newPageFunction.domList=window.ozzx.domList;newPageFunction[clickFor].apply(newPageFunction,parameterArr);}else{// 如果没有此方法则交给浏览器引擎尝试运行
eval(this.attributes['@click'].textContent);}};}// 递归处理所有子Dom结点
for(var i=0;i<tempDom.children.length;i++){var childrenDom=tempDom.children[i];// console.log(childrenDom)
pgNameHandler(childrenDom);}}// 便捷获取被命名的dom元素
function $dom(domName){return ozzx.domList[domName];}// 跳转到指定页面
function $go(pageName,inAnimation,outAnimation,param){ozzx.state.animation={in:inAnimation,out:outAnimation};var paramString='';if(param&&_typeof(param)=='object'){paramString+='?';// 生成URL参数
for(var paramKey in param){paramString+=paramKey+'='+param[paramKey]+'&';}// 去掉尾端的&
paramString=paramString.slice(0,-1);}window.location.href=paramString+"#"+pageName;}// 页面资源加载完毕事件
function ready(){var page=ozzx.entry;window.ozzx.activePage=page;// 更改$data链接
$data=ozzx.script[page].data;var entryDom=document.getElementById('ox-'+page);if(entryDom){runPageFunction(page,entryDom);}else{console.error('找不到页面入口! 设置的入口为: '+page);}}/*
 * 传递函数给whenReady()
 * 当文档解析完毕且为操作准备就绪时，函数作为document的方法调用
 */var whenReady=function(){//这个函数返回whenReady()函数
var funcs=[];//当获得事件时，要运行的函数
var ready=false;//当触发事件处理程序时,切换为true
//当文档就绪时,调用事件处理程序
function handler(e){if(ready)return;//确保事件处理程序只完整运行一次
//如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
if(e.type==='onreadystatechange'&&document.readyState!=='complete'){return;}//运行所有注册函数
//注意每次都要计算funcs.length
//以防这些函数的调用可能会导致注册更多的函数
for(var i=0;i<funcs.length;i++){funcs[i].call(document);}//事件处理函数完整执行,切换ready状态, 并移除所有函数
ready=true;funcs=null;}//为接收到的任何事件注册处理程序
if(document.addEventListener){document.addEventListener('DOMContentLoaded',handler,false);document.addEventListener('readystatechange',handler,false);//IE9+
window.addEventListener('load',handler,false);}else if(document.attachEvent){document.attachEvent('onreadystatechange',handler);window.attachEvent('onload',handler);}//返回whenReady()函数
return function whenReady(fn){if(ready){fn.call(document);}else{funcs.push(fn);}};}();whenReady(ready);window.ozzx={script:{"home":{"data":{},"created":function created(){var _this=this;this.getData('/show1').then(function(data){var chart1=echarts.init(document.getElementById('chart1'));chart1.setOption({series:[{name:'概况',type:'pie',radius:'60%',data:data,label:{position:'inside',color:'#495A80',"formatter":'{b}: {d}%'},itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:'rgba(0, 0, 0, 0.5)'}}}],color:['#9966CC','#EAF048','#F6D6FF']});});this.getData('/distribution').then(function(data){var chart2=echarts.init(document.getElementById('chart2'));var chartConfig={xAxis:{show:false},yAxis:{},legend:{top:30,left:5},grid:{left:30,top:120,bottom:20,right:30},tooltip:{formatter:function formatter(obj){var value=obj.value;return"".concat(value[2],": ").concat(value[1],"%");}},series:[]};for(var key in data){chartConfig.series.push({symbolSize:5,name:key,data:data[key],type:'scatter'// markLine: {
//   data : [
//     {type : 'average', name: '平均值'}
//   ]
// }
});}chart2.setOption(chartConfig);});this.getData('/transactionAve').then(function(data){var chart2=echarts.init(document.getElementById('chart3'));// console.log(data[0])
chart2.setOption({xAxis:{type:'category',axisTick:{show:false},data:['买/卖1','买/卖2','买/卖3','买/卖4','买/卖5']},legend:{left:0,top:35,data:['平均买价','平均卖价','平均买数','平均卖数']},yAxis:[{type:'value',scale:true,name:'平均价格',max:20,min:12},{type:'value',scale:true,name:'平均手数',max:4000,min:0}],grid:{left:30,top:100,bottom:20,right:50},series:[{name:'平均买价',type:'bar',label:{normal:{show:true,position:'inside'}},data:data[0]},{name:'平均卖价',type:'bar',label:{normal:{show:true,position:'inside'}},data:data[2]},{name:'平均买数',type:'line',label:{normal:{show:true,position:'top'}},yAxisIndex:1,data:data[1]},{name:'平均卖数',type:'line',label:{normal:{show:true,position:'top'}},yAxisIndex:1,data:data[3]}],color:['#9966CC','#00FF80','#495A80','#f17c67']});_this.getChart4();});},"getChart4":function getChart4(){var _this2=this;this.getData('/VPB').then(function(data){var chart4=echarts.init(document.getElementById('chart4'));chart4.setOption({xAxis:{type:'value',name:'市盈率',max:100,min:0},yAxis:{type:'value',name:'市净率',max:1,min:0.6},grid:{left:30,top:60,bottom:20,right:60},tooltip:{formatter:function formatter(obj){var value=obj.value;return"".concat(value[2],":<br/>\u5E02\u51C0\u7387: ").concat(value[1],"<br/>\u5E02\u76C8\u7387: ").concat(value[0],"<br/>\u5E73\u5747\u6210\u672C: ").concat(value[3].toFixed(4));}},series:[{symbolSize:function symbolSize(data){return(-data[3]*100+10).toFixed(2);},data:data,type:'scatter'}],color:['#00FF80']});setTimeout(function(){_this2.getChart5();},0);});},"getChart5":function getChart5(){var _this3=this;this.getData('/SB').then(function(data){var chart5=echarts.init(document.getElementById('chart5'));chart5.setOption({series:[{name:'内盘/外盘',type:'pie',radius:'60%',data:data,label:{position:'inside',"formatter":'{b}: {d}%'},itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:'rgba(0, 0, 0, 0.5)'}}}],color:['#f17c67','#495A80']});setTimeout(function(){_this3.wmjyl();},0);});},"getData":function getData(url){return new Promise(function(resolve,reject){var ajax=new XMLHttpRequest();//步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
ajax.open('get',url);//步骤三:发送请求
ajax.send();//步骤四:注册事件 onreadystatechange 状态改变就会调用
ajax.onreadystatechange=function(){if(ajax.readyState==4&&ajax.status==200){resolve(JSON.parse(ajax.responseText).data);}};});},"wmjyl":function wmjyl(){this.getData('/wmjyl').then(function(data){// console.log(data)
var chart6=echarts.init(document.getElementById('chart6'));chart6.setOption({xAxis:{type:'category',data:['买','卖']},grid:{left:50,top:40,bottom:20,right:20},yAxis:{type:'value'},series:[{barWidth:15,data:[data[1],data[3]],type:'bar'}],color:['#009fe9']});// 占比饼状图
var chart7=echarts.init(document.getElementById('chart7'));chart7.setOption({series:[{name:'五笔买卖占比',type:'pie',radius:'60%',data:[{name:"买",value:data[0]},{name:"卖",value:data[2]}],label:{position:'inside',"formatter":'{b}: {d}%'},itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:'rgba(0, 0, 0, 0.5)'}}}],color:['#f17c67','#495A80']});});}}},tool:{},entry:"home",state:{},global:{}};// 便捷的获取工具方法
var $tool=ozzx.tool;var $data={};function switchPage(oldUrlParam,newUrlParam){var oldPage=oldUrlParam.split('&')[0];var newPage=newUrlParam.split('&')[0];// 查找页面跳转前的page页(dom节点)
// console.log(oldUrlParam)
// 如果源地址获取不到 那么一般是因为源页面为首页
if(oldPage===undefined){oldPage=ozzx.entry;}var oldDom=document.getElementById('ox-'+oldPage);if(oldDom){// 隐藏掉旧的节点
oldDom.style.display='none';}// 查找页面跳转后的page
var newDom=document.getElementById('ox-'+newPage);// console.log(newDom)
if(newDom){// 隐藏掉旧的节点
newDom.style.display='block';}else{console.error('页面不存在!');return;}window.ozzx.activePage=newPage;// 更改$data链接
$data=ozzx.script[newPage].data;runPageFunction(newPage,newDom);}