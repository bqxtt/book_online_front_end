//基于axios封装的请求模块

import axios from 'axios'
import JSONbig from 'json-bigint'
//创建一个 axios 实例

const request = axios.create({
  baseURL: 'http://139.9.140.136:8080/',//请求的基本地址
  //定义后端返回的原始数据处理
  //参数 data 就是后端返回的原始数据（未经处理的json格式对象）
  transformResponse: [(data) => {
    //data json格式的字符串
    //后端返回的数据可能不是json格式字符串
    //如果不是的话，那么JSONBig.parse 调用就会报错
    //所以我们使用try-catch来捕获异常
    try {
      //如果转换成功，则直接把结果返回,
      //注意，用户接收article的id变成了一个bigInt处理过的对象，
      //使用时，需要.toString(),拿出来大数
      //  console.log("原始data：",data)
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      return data
    }
  }],
})

//请求拦截器(请求在发送出去之前的操作)
request.interceptors.request.use(
  //任何请求都会经过这里
  //config 是当前请求相关的配置信息对象
  //config 是可以修改的 ，可以打印看一看
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    console.log('请求拦截-是否存储在localstory中:', user)
    //如果有用户登录信息，则统一设置token
    if (user) {
      config.headers.Authorization = `${user.token}`
      // console.log('2===:',config)
    }
    //然后我们可以在允许请求发送出之前定制同意业务处理
    //例如：统一设置token
    //当这里 return config 之后请求才会真正的发送出去
    console.log("发送请求：", config)
    // config.headers.ContentType = 'application/json;charset=utf-8'
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
//响应拦截器

//导出请求方法
export default request
//谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.XXX
// request({
//   method:,
//   url:''
// })
