/**
 * 用户相关请求模块
 */
import request from '@/utils/request'
//用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/user/login',
    //data 用来设置POST请求头
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
      //属性名和值都得看接口
      //属性名：Authorization，接口要求
      //属性值：Bearer空格token数据
      //以下字符拼接还可以时`Bearer ${user.token}`
      "Authorization": '111'
    }
  })
}

//用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/user/register',
    //data 用来设置POST请求头
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
      //属性名和值都得看接口
      //属性名：Authorization，接口要求
      //属性值：Bearer空格token数据
      //以下字符拼接还可以时`Bearer ${user.token}`
      "Authorization": '111'
    }
  })
}

// /user/info/update
//修改用户信息
export const updateInfo = data => {
  return request({
    method: 'POST',
    url: '/user/info/update',
    //data 用来设置POST请求头
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
      //属性名和值都得看接口
      //属性名：Authorization，接口要求
      //属性值：Bearer空格token数据
      //以下字符拼接还可以时`Bearer ${user.token}`
    }
  })
}

// ​/user​/info
//获取用户信息
export const getInfo = () => {
  return request({
    method: 'GET',
    url: '/user/info',
    headers: {
      'Content-Type': "application/json;charset=utf-8",
      //属性名和值都得看接口
      //属性名：Authorization，接口要求
      //属性值：Bearer空格token数据
      //以下字符拼接还可以时`Bearer ${user.token}`
    }
  })
}

/**
 *管理员相关接口
 */
//获取全部用户信息
export const adminAllUserInfo = data => {
  return request({
    method: 'POST',
    url: '/admin/user/list',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
      //属性名和值都得看接口
      //属性名：Authorization，接口要求
      //属性值：Bearer空格token数据
      //以下字符拼接还可以时`Bearer ${user.token}`
    }
  })
}
//删除用户
export const adminDeleteUserInfo = user_id => {
  return request({
    method: 'DELETE',
    url: `/admin/user/delete/${user_id}`,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
      //属性名和值都得看接口
      //属性名：Authorization，接口要求
      //属性值：Bearer空格token数据
      //以下字符拼接还可以时`Bearer ${user.token}`
    }
  })
}

