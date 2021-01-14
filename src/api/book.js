import request from '@/utils/request'
/**
 * 用户相关请求模块
 */
//全部图书列表
export const bookList = data => {
  return request({
    method: 'POST',
    url: '/book/list',
    //data 用来设置POST请求头
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}
//借阅图书
export const borrow = data => {
  return request({
    method: 'POST',
    url: '/book/borrow',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}

//个人所有借阅记录
export const allRecords = data => {
  return request({
    method: 'POST',
    url: '/book/record/all',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}

//个人待还借阅记录
export const recordBorrowed = data => {
  return request({
    method: 'POST',
    url: '/book/record/borrow',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}

//个人已还借阅记录
export const recordReturned = data => {
  return request({
    method: 'POST',
    url: '/book/record/return',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}

//个人还书
export const returned = data => {
  return request({
    method: 'POST',
    url: '/book/return',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}
/**
 * 管理员相关请求模块
 */

//管理员全部记录 /admin/book/record/all
export const adminAllRecords = data => {
  return request({
    method: 'POST',
    url: '/admin/book/record/all',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}

//管理员 已还记录
export const adminRecordReturned = data => {
  return request({
    method: 'POST',
    url: '/admin/book/record/return',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}

//管理员 待还记录
export const adminRecordBorrowed = data => {
  return request({
    method: 'POST',
    url: '/admin/book/record/borrow',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}

//管理员 新增图书
export const adminAdd = data => {
  return request({
    method: 'POST',
    url: '/admin/book/create',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}


//管理员 编辑图书
export const adminEdit = data => {
  return request({
    method: 'POST',
    url: '/admin/book/update',
    data,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}

//管理员 删除图书
export const adminDelete = book_id => {
  return request({
    method: 'DELETE',
    url: `/admin/book/delete/${book_id}`,
    headers: {
      'Content-Type': "application/json;charset=utf-8",
    }
  })
}
