export interface CreateGroupParams {
  name: string
  description: string
  permissions?: { name: string }[]
}

export interface UpdateGroupParams {
  description?: string
  isActive?: boolean
  permissions?: { name: string }[]
  users?: { username: string }[]
}
