import { db, firebase } from "../firebase.prod";

export async function doesUsernameExist(username) { // this is a network call
    const result = await firebase
    .firestore()
    .collection('users')
    .where('username','==',username)
    .get();

    console.log(result)

    return result.docs.map((user) => user.data().length > 0);
}
