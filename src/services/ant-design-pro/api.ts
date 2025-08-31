import { request } from '@umijs/max'

// 获取当前的用户
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {})
  })
}

// 退出登录接口
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {})
  })
}

// 登录接口
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 此处后端没有提供注释
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取规则列表
export async function rule(
  params: {
    current?: number
    pageSize?: number
  },
  options?: { [key: string]: any }
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 更新规则
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {})
    }
  })
}

// 新建规则
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {})
    }
  })
}

// 删除规则
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {})
    }
  })
}
