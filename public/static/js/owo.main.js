"use strict";function _typeof(obj){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj;};}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};}return _typeof(obj);}if(!owo){console.error('没有找到owo核心!');}// 注册owo默认变量
// 框架状态变量
owo.state={};// 框架全局变量
owo.global={};// 全局方法变量
owo.tool={};// 便捷的获取工具方法
var $tool=owo.tool;var $data={};// 框架核心函数
var _owo={};// 对象合并方法
_owo.assign=function(a,b){var newObj={};for(var key in a){newObj[key]=a[key];}for(var key in b){newObj[key]=b[key];}return newObj;};// 运行页面所属的方法
_owo.runPageFunction=function(pageName,entryDom){// owo-name处理
window.owo.domList={};_owo.pgNameHandler(entryDom);// 判断页面是否有自己的方法
var newPageFunction=window.owo.script[pageName];if(!newPageFunction)return;// console.log(newPageFunction)
// 如果有created方法则执行
if(newPageFunction.created){// 注入运行环境
newPageFunction.created.apply(_owo.assign(newPageFunction,{$el:entryDom,data:newPageFunction.data,activePage:window.owo.activePage,domList:window.owo.domList}));}// 判断页面是否有下属模板,如果有运行所有模板的初始化方法
for(var key in newPageFunction.template){var templateScript=newPageFunction.template[key];if(templateScript.created){// 获取到当前配置页的DOM
// 待修复,临时获取方式,这种方式获取到的dom不准确
var domList=entryDom.getElementsByClassName('o-'+key);if(domList.length!==1){console.error('我就说会有问题吧!');console.log(domList);}// 为模板注入运行环境
templateScript.created.apply(_owo.assign(newPageFunction.template[key],{$el:domList[0].children[0],data:templateScript.data,activePage:window.owo.activePage,domList:window.owo.domList}));}}};// owo-name处理
_owo.pgNameHandler=function(tempDom){// 判断是否存在@name属性
var pgName=tempDom.attributes['@name'];if(pgName){// console.log(pgName.textContent)
// 隐藏元素
tempDom.hide=function(){this.style.display='none';};window.owo.domList[pgName.textContent]=tempDom;}// 判断是否有点击事件
var clickFunc=tempDom.attributes['@click'];if(clickFunc){tempDom.onclick=function(event){var clickFor=this.attributes['@click'].textContent;// 判断页面是否有自己的方法
var newPageFunction=window.owo.script[window.owo.activePage];// console.log(this.attributes)
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
if(newPageFunction[clickFor]){// 绑定window.owo对象
// console.log(tempDom)
// 待测试不知道这样合并会不会对其它地方造成影响
newPageFunction.$el=this;newPageFunction.$event=event;newPageFunction.domList=window.owo.domList;newPageFunction[clickFor].apply(newPageFunction,parameterArr);}else{// 如果没有此方法则交给浏览器引擎尝试运行
eval(this.attributes['@click'].textContent);}};}// 递归处理所有子Dom结点
for(var i=0;i<tempDom.children.length;i++){var childrenDom=tempDom.children[i];// console.log(childrenDom)
_owo.pgNameHandler(childrenDom);}};// 便捷获取被命名的dom元素
function $dom(domName){return owo.domList[domName];}// 跳转到指定页面
function $go(pageName,inAnimation,outAnimation,param){owo.state.animation={in:inAnimation,out:outAnimation};var paramString='';if(param&&_typeof(param)=='object'){paramString+='?';// 生成URL参数
for(var paramKey in param){paramString+=paramKey+'='+param[paramKey]+'&';}// 去掉尾端的&
paramString=paramString.slice(0,-1);}window.location.href=paramString+"#"+pageName;}// 页面资源加载完毕事件
function ready(){var page=owo.entry;window.owo.activePage=page;// 更改$data链接
$data=owo.script[page].data;var entryDom=document.getElementById('o-'+page);if(entryDom){_owo.runPageFunction(page,entryDom);}else{console.error('找不到页面入口! 设置的入口为: '+page);}}/*
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
return function whenReady(fn){if(ready){fn.call(document);}else{funcs.push(fn);}};}();whenReady(ready);function switchPage(oldUrlParam,newUrlParam){var oldPage=oldUrlParam.split('&')[0];var newPage=newUrlParam.split('&')[0];// 查找页面跳转前的page页(dom节点)
// console.log(oldUrlParam)
// 如果源地址获取不到 那么一般是因为源页面为首页
if(oldPage===undefined){oldPage=owo.entry;}var oldDom=document.getElementById('o-'+oldPage);if(oldDom){// 隐藏掉旧的节点
oldDom.style.display='none';}// 查找页面跳转后的page
var newDom=document.getElementById('o-'+newPage);// console.log(newDom)
if(newDom){// 隐藏掉旧的节点
newDom.style.display='block';}else{console.error('页面不存在!');return;}window.owo.activePage=newPage;// 更改$data链接
$data=owo.script[newPage].data;_owo.runPageFunction(newPage,newDom);}