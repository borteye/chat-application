import {
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Dispatch } from "redux";
import db, { auth } from "../firebaseConfig";
import { setActiveUser } from "../features/userSlice";
import { BasicUserInfo } from "../typings";

type NavigateFunction = (path: string) => void;
const provider = new GithubAuthProvider();

function NormalLoginAuth(
  dispatch: Dispatch,
  navigate: NavigateFunction,
  email: string,
  password: string,
  setNormalLoginLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  setNormalLoginLoading(true);
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
          setNormalLoginLoading(false);
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
      setNormalLoginLoading(false);
      console.log(error);
    });
}

function GitHubLoginAuth(
  dispatch: Dispatch,
  navigate: NavigateFunction,
  setGitLoginLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  setGitLoginLoading(true);
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
          setGitLoginLoading(false);
          navigate("/home");
        }
      }
    })
    .catch((error) => {
      setGitLoginLoading(false);
      console.log(error);
    });
}

function NormalSignupAuth(
  email: string,
  password: string,
  username: string,
  addUserToFirestore: (user: BasicUserInfo) => Promise<void>,
  navigate: NavigateFunction,
  setNormalSignupLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  setNormalSignupLoading(true);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      updateProfile(user, {
        displayName: username,
      });
      addUserToFirestore(user);
      setNormalSignupLoading(false);
      navigate("/");
    })
    .catch((error: any) => {
      setNormalSignupLoading(false);
      console.log(error);
    });
}

function GitHubSignupAuth(
  addUserToFirestoreGithub: (user: BasicUserInfo) => Promise<void>,
  navigate: NavigateFunction,
  setGitSignupLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  setGitSignupLoading(true);
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = result.user;
      addUserToFirestoreGithub(user);
      setGitSignupLoading(false);
      navigate("/");
    })
    .catch((error) => {
      setGitSignupLoading(false);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...
    });
}

export { NormalLoginAuth, GitHubLoginAuth, NormalSignupAuth, GitHubSignupAuth };
