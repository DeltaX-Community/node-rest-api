import { Photo } from "../models"
import { Paginate } from "./paginate.dto"

export type CreatePhotoDto = {
  username: string
  url: string
}

export type UpdatePhotoDto = {
  url: string
}

export type PhotoDetailDto = Photo & {
  user: {
    id: number
    username: string
  }
}

export type PhotoListDto = Paginate<Photo>

export type PhotoDto = Photo

export function buildPhotoListDto(
  photos: Photo[],
  page: number,
  perPage: number,
  total: number
): PhotoListDto {
  return { rows: photos, page, perPage, total }
}

export function buildPhotoDetailDto(
  photo: Photo,
  userId: number,
  username: string
): PhotoDetailDto {
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
  } as PhotoDetailDto
}
