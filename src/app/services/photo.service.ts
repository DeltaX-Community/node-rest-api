import {
  createPhotoDetail,
  CreatePhotoParams,
  createPhotoList,
  UpdatePhotoParams,
  IPhotoDetail,
  IPhotoList
} from "../dtos"
import { Photo, prisma } from "../models"
import { NotFoundError } from "../errors/MessageError"

class PhotoService {
  async getPhotoDetail(id: number): Promise<IPhotoDetail> {
    const photo = await prisma.photo.findFirst({
      where: {
        id: id
      },
      include: { user: true }
    })

    if (!photo) {
      throw new NotFoundError("Photo not found!")
    }

    return createPhotoDetail(photo, photo.user.id, photo.user.username)
  }

  async updatePhoto(id: number, item: UpdatePhotoParams): Promise<IPhotoDetail> {
    const photo = await prisma.photo.update({
      where: { id: id },
      data: {
        url: item.url
      },
      include: { user: true }
    })

    return createPhotoDetail(photo, photo.user.id, photo.user.username)
  }

  async getPhotoList(page = 1, perPage = 10, username: string | null = null): Promise<IPhotoList> {
    const skip = perPage * (page - 1)

    const photos = await prisma.photo.findMany({
      skip: skip,
      take: perPage,
      where: {
        user: {
          username: username || undefined
        }
      }
    })

    return createPhotoList(photos, page, perPage, 0)
  }

  async createPhoto(userId: number, data: CreatePhotoParams): Promise<Photo> {
    return await prisma.photo.create({
      data: {
        url: data.url,
        userId: userId
      }
    })
  }

  async deletePhoto(id: number): Promise<Photo> {
    return await prisma.photo.delete({ where: { id } })
  }
}

export const photoService = new PhotoService()
