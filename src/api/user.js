import request from '@/utils/request'

export function login(data) {
  console.log('data')
  console.log(data)
  return request({
    url: 'http://localhost:80/kakei/kakei-api/public/api/login',
    method: 'post',
    data
  })
}

export function apiurl() {
  return request({
    url: '/vue-admin-template/user/apiurl',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
