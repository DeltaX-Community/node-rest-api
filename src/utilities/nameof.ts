import { User } from "../entities/user"
import { Profile } from "../entities/profile"
import { Photo } from "../entities/photo"
import { nameof } from "ts-simple-nameof"

export interface ITables {
    user: User;
    profile: Profile;
    photo: Photo;
}

export function nameTable(selector: (obj: ITables) => any): string {
    return nameof<ITables>(selector)
}


export function nameField<TT extends keyof ITables, TV extends ITables[TT]>(table: TT, selector: (obj: TV) => any): string {
    return nameof<TV>(selector)
}


// const Table = (table: keyof ITables) => nameof<ITables>(t => t.photo);

console.log("photo.id            => ", nameof<ITables>(t => t.photo.id))
console.log("photo.id            => ", nameTable(t => t.photo.id))
console.log("photo.user.fullName => ", nameTable(t => t.photo.user.fullName))
console.log("photo               => ", nameof<Profile>(t => t.photo))
console.log("gender              => ", nameField("profile", p => p.gender))


interface Person {
    firstName: string;
    lastName: string;
}

const personName1 = nameof<Person>(p => p.firstName);


console.log(personName1)