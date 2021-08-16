import { Photo } from "../models"
import { Paginate } from "./paginate.dto"

export interface CreatePhotoParams {
  username: string
  url: string
}

export interface UpdatePhotoParams {
  url: string
}

export type IPhotoDetail = Photo & {
  user: {
    id: number
    username: string
  }
}

export type IPhotoList = Paginate<Photo>

export function createPhotoList(
  photos: Photo[],
  page: number,
  perPage: number,
  total: number
): IPhotoList {
  return { rows: photos, page, perPage, total }
}

export function createPhotoDetail(photo: Photo, userId: number, username: string): IPhotoDetail {
  return {
    id: photo.id,
    url: photo.url,
    createAt: photo.createAt,
    isActive: photo.isActive,
    userId: photo.userId,
    user: {
      id: userId,
      username: username
    }
  } as IPhotoDetail
}
