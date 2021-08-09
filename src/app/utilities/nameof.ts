import { User } from "../entities/user"
import { Profile } from "../entities/profile"
import { Photo } from "../entities/photo"
import { nameof } from "ts-simple-nameof"

export interface ITables {
  user: User
  profile: Profile
  photo: Photo
}

export function nameTable(selector: (obj: ITables) => unknown): string {
  return nameof<ITables>(selector)
}

export function nameField<TT extends keyof ITables, TV extends ITables[TT]>(
  table: TT,
  selector: (obj: TV) => unknown
): string {
  return nameof<TV>(selector)
}

// const Table = (table: keyof ITables) => nameof<ITables>(t => t.photo);

console.log(
  "photo.id            => ",
  nameof<ITables>((t) => t.photo.id)
)
console.log(
  "photo.id            => ",
  nameTable((t) => t.photo.id)
)
console.log(
  "photo.user.fullName => ",
  nameTable((t) => t.photo.user.fullName)
)
console.log(
  "description         => ",
  nameof<Profile>((t) => t.description)
)
console.log(
  "createAt            => ",
  nameField("profile", (p) => p.createAt)
)

interface Person {
  firstName: string
  lastName: string
}

const personName1 = nameof<Person>((p) => p.firstName)

console.log(personName1)
