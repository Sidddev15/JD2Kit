export type JobRunDTO = {
  id: string
  roleTitle: string | null
  companyName: string | null
  profileType: string
  status: string
  createdAt: string
  tags?: string[] | null
}
