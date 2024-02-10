import {
  GithubAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Dispatch } from "redux";
import db, { auth } from "../firebaseConfig";
import { setActiveUser } from "../features/userSlice";

type NavigateFunction = (path: string) => void;
const provider = new GithubAuthProvider();

function GitHubLoginAuth(dispatch: Dispatch, navigate: NavigateFunction) {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      // The signed-in user info.
      const user = result.user;
      //* Get the user's details from firebase and store them in the redux store
      const getUserData = await db.collection("users").doc(user.uid).get();

      if (getUserData.exists) {
        const userData = getUserData.data();
        console.log(userData);
        if (userData) {
          const { uid, email, occupation, phoneNumber, displayName } = userData;
          dispatch(
            setActiveUser({
              userUid: uid,
              userDisplayName: displayName,
              userEmail: email,
              userOccupation: occupation,
              userPhoneNumber: phoneNumber,
            })
          );
          navigate("/home");
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function NormalLoginAuth(
  dispatch: Dispatch,
  navigate: NavigateFunction,
  email: string,
  password: string
) {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential: any) => {
      const user = userCredential.user;

      //* Get the user's details from firebase and store them in the redux store
      const getUserData = await db.collection("users").doc(user.uid).get();
      if (getUserData.exists) {
        const userData = getUserData.data();

        if (userData) {
          const { uid, email, occupation, phoneNumber, displayName } = userData;
          dispatch(
            setActiveUser({
              userUid: uid,
              userDisplayName: displayName,
              userEmail: email,
              userOccupation: occupation,
              userPhoneNumber: phoneNumber,
            })
          );

          navigate("/home");
        } else {
          console.error("User data is undefined");
        }
      } else {
        // Handle the case where user data doesn't exist
        console.error("User data not found");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export { GitHubLoginAuth, NormalLoginAuth };
