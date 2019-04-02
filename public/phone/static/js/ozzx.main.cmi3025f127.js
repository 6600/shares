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
var templateName=this.attributes['template'];// console.log(templateName)
if(templateName){newPageFunction=newPageFunction.template[templateName.textContent];}// 取出参数
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
paramString=paramString.slice(0,-1);}window.location.href=paramString+"#"+pageName;}// 获取URL #后面内容
function getarg(url){var arg=url.split("#");return arg[1];}// 页面资源加载完毕事件
window.onload=function(){// 取出URL地址判断当前所在页面
var pageArg=getarg(window.location.hash);// 从配置项中取出程序入口
var page=pageArg?pageArg.split('?')[0]:ozzx.entry;if(page){var entryDom=document.getElementById('ox-'+page);if(entryDom){// 显示主页面
entryDom.style.display='block';window.ozzx.activePage=page;// 更改$data链接
$data=ozzx.script[page].data;runPageFunction(page,entryDom);}else{console.error('入口文件设置错误,错误值为: ',entryDom);}}else{console.error('未设置程序入口!');}};// url发生改变事件
window.onhashchange=function(e){var oldUrlParam=getarg(e.oldURL);// 如果旧页面不存在则为默认页面
if(!oldUrlParam)oldUrlParam=ozzx.entry;var newUrlParam=getarg(e.newURL);// 如果没有跳转到任何页面则跳转到主页
if(newUrlParam===undefined){newUrlParam=ozzx.entry;}// 如果没有发生页面跳转则不需要进行操作
// 切换页面特效
switchPage(oldUrlParam,newUrlParam);};window.ozzx={script:{"one":{"data":{},"created":function created(){document.title='大盘涨跌-饼状图';getData('/show1').then(function(data){var chart=echarts.init(document.getElementById('chart'));chart.setOption({series:[{name:'概况',type:'pie',radius:'50%',data:data,label:{color:'#495A80',"formatter":'{b}: {d}%'},itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:'rgba(0, 0, 0, 0.5)'}}}],color:['#9966CC','#EAF048','#F6D6FF']});});}},"two":{"data":{},"created":function created(){document.title='大盘涨跌-饼状图';getData('/transactionAve').then(function(data){ozzx.global.chart=echarts.init(document.getElementById('two'));ozzx.global.chart.setOption({yAxis:{inverse:true,type:'category',axisTick:{show:false},axisLabel:{rotate:-90},data:['买/卖1','买/卖2','买/卖3','买/卖4','买/卖5']},xAxis:[{type:'value',scale:true,name:'平均价格',axisLabel:{rotate:-90},nameRotate:-90,max:20,min:12},{type:'value',scale:true,axisLabel:{rotate:90},nameRotate:-90,name:'平均手数',max:4000,min:0}],grid:{left:30,top:50,bottom:30,right:30},series:[{name:'平均买价',type:'bar',label:{normal:{show:true,rotate:-90,position:'inside'}},data:data[0]},{name:'平均卖价',type:'bar',label:{normal:{show:true,rotate:-90,position:'inside'}},data:data[2]},{name:'平均买数',type:'line',label:{normal:{show:true,rotate:-90,position:'top'}},xAxisIndex:1,data:data[1]},{name:'平均卖数',type:'line',label:{normal:{show:true,rotate:-90,position:'top'}},xAxisIndex:1,data:data[3]}],color:['#9966CC','#00FF80','#495A80','#f17c67']});});},"turn":function turn(){ozzx.global.chart.dispose();$go('two');}},"three":{"data":{},"created":function created(){document.title='买入/卖出意愿图';getData('/SB').then(function(data){var chart=echarts.init(document.getElementById('three'));chart.setOption({series:[{name:'内盘/外盘',type:'pie',radius:'60%',data:data,label:{position:'inside',"formatter":'{b}: {d}%'},itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:'rgba(0, 0, 0, 0.5)'}}}],color:['#f17c67','#495A80']});});}}},tool:{},entry:"one",state:{},global:{}};// 便捷的获取工具方法
var $tool=ozzx.tool;var $data={};function switchPage(oldUrlParam,newUrlParam){var oldPage=oldUrlParam.split('&')[0];var newPage=newUrlParam.split('&')[0];// 查找页面跳转前的page页(dom节点)
// console.log(oldUrlParam)
// 如果源地址获取不到 那么一般是因为源页面为首页
if(oldPage===undefined){oldPage=ozzx.entry;}var oldDom=document.getElementById('ox-'+oldPage);if(oldDom){// 隐藏掉旧的节点
oldDom.style.display='none';}// 查找页面跳转后的page
var newDom=document.getElementById('ox-'+newPage);// console.log(newDom)
if(newDom){// 隐藏掉旧的节点
newDom.style.display='block';}else{console.error('页面不存在!');return;}window.ozzx.activePage=newPage;// 更改$data链接
$data=ozzx.script[newPage].data;runPageFunction(newPage,newDom);}