function getData(url) {
  return new Promise((resolve, reject) => {
    const ajax = new XMLHttpRequest();
    //步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
    ajax.open('get', url)
    //步骤三:发送请求
    ajax.send()
    //步骤四:注册事件 onreadystatechange 状态改变就会调用
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 &&ajax.status == 200) {
        resolve(JSON.parse(ajax.responseText).data)
      }
    }
  })
}