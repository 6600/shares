// build by owo frame!
// Wed Jun 12 2019 22:36:43 GMT+0800 (GMT+08:00)

"use strict";

window.owo = {
  // 页面数据和方法
  script: {
    "home": {
      "data": {},
      "created": function created() {
        var _this = this;

        this.getData('/show1').then(function (data) {
          var chart1 = echarts.init(document.getElementById('chart1'));
          chart1.setOption({
            series: [{
              name: '概况',
              type: 'pie',
              radius: '60%',
              data: data,
              label: {
                position: 'inside',
                color: '#495A80',
                "formatter": '{b}: {d}%'
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }],
            color: ['#9966CC', '#EAF048', '#F6D6FF']
          });
        });
        this.getData('/distribution').then(function (data) {
          var chart2 = echarts.init(document.getElementById('chart2'));
          var chartConfig = {
            xAxis: {
              show: false
            },
            yAxis: {},
            legend: {
              top: 30,
              left: 5
            },
            grid: {
              left: 30,
              top: 120,
              bottom: 20,
              right: 30
            },
            tooltip: {
              formatter: function formatter(obj) {
                var value = obj.value;
                return "".concat(value[2], ": ").concat(value[1], "%");
              }
            },
            series: []
          };

          for (var key in data) {
            chartConfig.series.push({
              symbolSize: 5,
              name: key,
              data: data[key],
              type: 'scatter' // markLine: {
              //   data : [
              //     {type : 'average', name: '平均值'}
              //   ]
              // }

            });
          }

          chart2.setOption(chartConfig);
        });
        this.getData('/transactionAve').then(function (data) {
          var chart2 = echarts.init(document.getElementById('chart3')); // console.log(data[0])

          chart2.setOption({
            xAxis: {
              type: 'category',
              axisTick: {
                show: false
              },
              data: ['买/卖1', '买/卖2', '买/卖3', '买/卖4', '买/卖5']
            },
            legend: {
              left: 0,
              top: 35,
              data: ['平均买价', '平均卖价', '平均买数', '平均卖数']
            },
            yAxis: [{
              type: 'value',
              scale: true,
              name: '平均价格',
              max: 20,
              min: 12
            }, {
              type: 'value',
              scale: true,
              name: '平均手数',
              max: 4000,
              min: 0
            }],
            grid: {
              left: 30,
              top: 100,
              bottom: 20,
              right: 50
            },
            series: [{
              name: '平均买价',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
              data: data[0]
            }, {
              name: '平均卖价',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
              data: data[2]
            }, {
              name: '平均买数',
              type: 'line',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              yAxisIndex: 1,
              data: data[1]
            }, {
              name: '平均卖数',
              type: 'line',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              yAxisIndex: 1,
              data: data[3]
            }],
            color: ['#9966CC', '#00FF80', '#495A80', '#f17c67']
          });

          _this.getChart4();
        });
      },
      "getChart4": function getChart4() {
        var _this2 = this;

        this.getData('/VPB').then(function (data) {
          var chart4 = echarts.init(document.getElementById('chart4'));
          chart4.setOption({
            xAxis: {
              type: 'value',
              name: '市盈率',
              max: 50,
              min: 0
            },
            yAxis: {
              type: 'value',
              name: '市净率',
              max: 1,
              min: 0.6
            },
            grid: {
              left: 30,
              top: 60,
              bottom: 20,
              right: 60
            },
            tooltip: {
              formatter: function formatter(obj) {
                var value = obj.value;
                return "".concat(value[2], ":<br/>\u5E02\u51C0\u7387: ").concat(value[1], "<br/>\u5E02\u76C8\u7387: ").concat(value[0], "<br/>\u5E73\u5747\u6210\u672C: ").concat(value[3].toFixed(4));
              }
            },
            series: [{
              symbolSize: function symbolSize(data) {
                return (-data[3] * 100 + 10).toFixed(2);
              },
              data: data,
              type: 'scatter'
            }],
            color: ['#00FF80']
          });
          setTimeout(function () {
            _this2.getChart5();
          }, 0);
        });
      },
      "getChart5": function getChart5() {
        var _this3 = this;

        this.getData('/SB').then(function (data) {
          var chart5 = echarts.init(document.getElementById('chart5'));
          chart5.setOption({
            series: [{
              name: '买入/卖出意愿',
              type: 'pie',
              radius: '60%',
              data: data,
              label: {
                position: 'inside',
                "formatter": '{b}: {d}%'
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }],
            color: ['#f17c67', '#495A80']
          });
          setTimeout(function () {
            _this3.wmjyl();
          }, 0);
        });
      },
      "getData": function getData(url) {
        return new Promise(function (resolve, reject) {
          var ajax = new XMLHttpRequest(); //步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端

          ajax.open('get', url); //步骤三:发送请求

          ajax.send(); //步骤四:注册事件 onreadystatechange 状态改变就会调用

          ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
              resolve(JSON.parse(ajax.responseText).data);
            }
          };
        });
      },
      "wmjyl": function wmjyl() {
        this.getData('/wmjyl').then(function (data) {
          // console.log(data)
          var chart6 = echarts.init(document.getElementById('chart6'));
          chart6.setOption({
            xAxis: {
              type: 'category',
              data: ['买', '卖']
            },
            grid: {
              left: 50,
              top: 40,
              bottom: 20,
              right: 20
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              barWidth: 15,
              data: [data[1], data[3]],
              type: 'bar'
            }],
            color: ['#009fe9']
          }); // 占比饼状图

          var chart7 = echarts.init(document.getElementById('chart7'));
          chart7.setOption({
            series: [{
              name: '五笔买卖占比',
              type: 'pie',
              radius: '60%',
              data: [{
                name: "卖",
                value: data[2]
              }, {
                name: "买",
                value: data[0]
              }],
              label: {
                position: 'inside',
                "formatter": '{b}: {d}%'
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }],
            color: ['#f17c67', '#495A80']
          });
        });
      }
    }
  },
  // 页面默认入口
  entry: "home"
};

"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

if (!owo) {
  console.error('没有找到owo核心!');
} // 注册owo默认变量
// 框架状态变量


owo.state = {}; // 框架全局变量

owo.global = {}; // 全局方法变量

owo.tool = {}; // 事件推送方法

var $emit = function $emit(eventName) {
  var event = owo.state.event[eventName];
  var argumentsList = [];

  for (var ind = 1; ind < arguments.length; ind++) {
    argumentsList.push(arguments[ind]);
  }

  event.forEach(function (element) {
    // 注入运行环境运行
    element.fun.apply(_owo.assign(element.script, {
      $el: element.dom,
      activePage: window.owo.activePage
    }), argumentsList);
  });
}; // 便捷的获取工具方法


var $tool = owo.tool;
var $data = {}; // 框架核心函数

var _owo = {}; // 对象合并方法

_owo.assign = function (a, b) {
  var newObj = {};

  for (var key in a) {
    newObj[key] = a[key];
  }

  for (var key in b) {
    newObj[key] = b[key];
  }

  return newObj;
}; // 针对低版本IE浏览器做兼容处理


if (!document.getElementsByClassName) {
  document.getElementsByClassName = function (className, element) {
    var children = (element || document).getElementsByTagName('*');
    var elements = new Array();

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var classNames = child.className.split(' ');

      for (var j = 0; j < classNames.length; j++) {
        if (classNames[j] == className) {
          elements.push(child);
          break;
        }
      }
    }

    return elements;
  };
}

_owo.runCreated = function (pageFunction, entryDom) {
  // 注入运行环境运行
  pageFunction.created.apply(_owo.assign(pageFunction, {
    $el: entryDom,
    data: pageFunction.data,
    activePage: window.owo.activePage
  }));
};

_owo.registerEvent = function (pageFunction, entryDom) {
  // 判断是否包含事件监听
  if (pageFunction.event) {
    if (!window.owo.state.event) window.owo.state.event = {};

    for (var iterator in pageFunction.event) {
      if (!window.owo.state.event[iterator]) window.owo.state.event[iterator] = [];
      window.owo.state.event[iterator].push({
        dom: entryDom,
        pageName: window.owo.activePage,
        fun: pageFunction.event[iterator],
        script: pageFunction
      });
    }
  }
}; // 运行页面所属的方法


_owo.handlePage = function (pageName, entryDom) {
  _owo.handleEvent(entryDom, null, entryDom); // 判断页面是否有自己的方法


  var newPageFunction = window.owo.script[pageName];
  if (!newPageFunction) return; // console.log(newPageFunction)
  // 如果有created方法则执行

  if (newPageFunction.created) {
    _owo.runCreated(newPageFunction, entryDom);
  } // 注册事件监听


  _owo.registerEvent(newPageFunction, entryDom); // 判断页面是否有下属模板,如果有运行所有模板的初始化方法


  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key];

    if (templateScript.created) {
      // 获取到当前配置页的DOM
      // 待修复,临时获取方式,这种方式获取到的dom不准确
      var domList = document.querySelectorAll('[template="' + key + '"]'); // 有时候在更改html时会将某些块进行删除

      if (domList.length == 0) {
        console.info('无法找到页面组件:' + key);
      } // console.log(domList.length)


      for (var ind = 0; ind < domList.length; ind++) {
        _owo.runCreated(templateScript, domList[ind]); // 注册事件监听


        _owo.registerEvent(templateScript, domList[ind]);
      }
    }
  }
}; // owo-name处理


_owo.handleEvent = function (tempDom, templateName, entryDom) {
  // console.log(templateName)
  var activePage = window.owo.script[owo.activePage];

  if (tempDom.attributes) {
    for (var ind = 0; ind < tempDom.attributes.length; ind++) {
      var attribute = tempDom.attributes[ind]; // 判断是否为owo的事件
      // ie不支持startsWith

      if (attribute.name[0] == '@') {
        var eventName = attribute.name.slice(1);
        var eventFor = attribute.textContent;

        switch (eventName) {
          case 'show':
            {
              // 初步先简单处理吧
              var temp = eventFor.replace(/ /g, ''); // 取出条件

              var condition = temp.split("==");

              if (activePage.data[condition[0]] != condition[1]) {
                tempDom.style.display = 'none';
              }

              break;
            }

          default:
            {
              // 处理事件 使用bind防止闭包
              tempDom["on" + eventName] = function (event) {
                // 因为后面会对eventFor进行修改所以使用拷贝的
                var eventForCopy = this; // 判断页面是否有自己的方法

                var newPageFunction = window.owo.script[window.owo.activePage]; // console.log(this.attributes)

                if (templateName) {
                  // 如果模板注册到newPageFunction中，那么证明模板没有script那么直接使用eval执行
                  if (newPageFunction.template) {
                    newPageFunction = newPageFunction.template[templateName];
                  }
                } // 待优化可以单独提出来
                // 取出参数


                var parameterArr = [];
                var parameterList = eventForCopy.match(/[^\(\)]+(?=\))/g);

                if (parameterList && parameterList.length > 0) {
                  // 参数列表
                  parameterArr = parameterList[0].split(','); // 进一步处理参数

                  for (var i = 0; i < parameterArr.length; i++) {
                    var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, ""); // console.log(parameterValue)
                    // 判断参数是否为一个字符串

                    if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
                      parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
                    }

                    if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
                      parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
                    } // console.log(parameterArr[i])

                  }

                  eventForCopy = eventForCopy.replace('(' + parameterList + ')', '');
                } else {
                  // 解决 @click="xxx()"会造成的问题
                  eventForCopy = eventForCopy.replace('()', '');
                } // console.log(newPageFunction)
                // 如果有方法,则运行它


                if (newPageFunction[eventForCopy]) {
                  // 绑定window.owo对象
                  // console.log(tempDom)
                  // 待测试不知道这样合并会不会对其它地方造成影响
                  newPageFunction.$el = entryDom;
                  newPageFunction.$event = event;
                  newPageFunction[eventForCopy].apply(newPageFunction, parameterArr);
                } else {
                  // 如果没有此方法则交给浏览器引擎尝试运行
                  eval(eventForCopy);
                }
              }.bind(eventFor);
            }
        }
      }
    }
  }

  if (tempDom.children) {
    // 递归处理所有子Dom结点
    for (var i = 0; i < tempDom.children.length; i++) {
      var childrenDom = tempDom.children[i]; // console.log(childrenDom)

      var newTemplateName = templateName;

      if (tempDom.attributes['template'] && tempDom.attributes['template'].textContent) {
        newTemplateName = tempDom.attributes['template'].textContent;
      } // 待修复，逻辑太混乱了


      var _temp = tempDom.attributes['template'] ? tempDom : entryDom;

      if (newTemplateName === owo.entry) {
        _owo.handleEvent(childrenDom, null, _temp);
      } else {
        _owo.handleEvent(childrenDom, newTemplateName, _temp);
      }
    }
  } else {
    console.info('元素不存在子节点!');
    console.info(tempDom);
  }
}; // 跳转到指定页面


function $go(pageName, inAnimation, outAnimation, param) {
  owo.state.animation = {
    "in": inAnimation,
    "out": outAnimation
  };
  var paramString = '';

  if (param && _typeof(param) == 'object') {
    paramString += '?'; // 生成URL参数

    for (var paramKey in param) {
      paramString += paramKey + '=' + param[paramKey] + '&';
    } // 去掉尾端的&


    paramString = paramString.slice(0, -1);
  }

  window.location.href = paramString + "#" + pageName;
}

function $change(key, value) {
  // 更改对应的data
  owo.script[owo.activePage].data[key] = value; // 当前页面下@show元素列表

  var showList = document.getElementById('o-' + owo.activePage).querySelectorAll('[\\@show]');
  showList.forEach(function (element) {
    // console.log(element)
    var order = element.attributes['@show'].textContent; // console.log(order)
    // 去掉空格

    order = order.replace(/ /g, '');

    if (order == key + '==' + value) {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  });
} // 页面资源加载完毕事件


_owo.ready = function () {
  var page = owo.entry;
  window.owo.activePage = page; // 更改$data链接

  $data = owo.script[page].data;
  var entryDom = document.getElementById('o-' + page);

  if (entryDom) {
    _owo.handlePage(page, entryDom);
  } else {
    console.error('找不到页面入口! 设置的入口为: ' + page);
  } // 设置状态为dom准备完毕


  window.owo.state.isRrady = true; // 判断是否有需要运行的其他方法

  if (window.owo.state.created != undefined) {
    window.owo.state.created.forEach(function (element) {
      // 运行对应的方法
      element();
    });
  }
};
/*
 * 传递函数给whenReady()
 * 当文档解析完毕且为操作准备就绪时，函数作为document的方法调用
 */


_owo.whenReady = function () {
  //这个函数返回whenReady()函数
  var funcs = []; //当获得事件时，要运行的函数

  var ready = false; //当触发事件处理程序时,切换为true
  //当文档就绪时,调用事件处理程序

  function handler(e) {
    if (ready) return; //确保事件处理程序只完整运行一次
    //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好

    if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
      return;
    } //运行所有注册函数
    //注意每次都要计算funcs.length
    //以防这些函数的调用可能会导致注册更多的函数


    for (var i = 0; i < funcs.length; i++) {
      funcs[i].call(document);
    } //事件处理函数完整执行,切换ready状态, 并移除所有函数


    ready = true;
    funcs = null;
  } //为接收到的任何事件注册处理程序


  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false);
    document.addEventListener('readystatechange', handler, false); //IE9+

    window.addEventListener('load', handler, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', handler);
    window.attachEvent('onload', handler);
  } //返回whenReady()函数


  return function whenReady(fn) {
    if (ready) {
      fn.call(document);
    } else {
      funcs.push(fn);
    }
  };
}();

_owo.whenReady(_owo.ready);

function switchPage(oldUrlParam, newUrlParam) {
  var oldPage = oldUrlParam.split('&')[0];
  var newPage = newUrlParam.split('&')[0]; // 查找页面跳转前的page页(dom节点)
  // console.log(oldUrlParam)
  // 如果源地址获取不到 那么一般是因为源页面为首页

  if (oldPage === undefined) {
    oldPage = owo.entry;
  }

  var oldDom = document.getElementById('o-' + oldPage);

  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none';
  } // 查找页面跳转后的page


  var newDom = document.getElementById('o-' + newPage); // console.log(newDom)

  if (newDom) {
    // 隐藏掉旧的节点
    newDom.style.display = 'block';
  } else {
    console.error('页面不存在!');
    return;
  }

  window.owo.activePage = newPage; // 更改$data链接

  $data = owo.script[newPage].data;

  _owo.handlePage(newPage, newDom);
}