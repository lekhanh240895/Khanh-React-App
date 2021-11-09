import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  updateProfile,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "@firebase/auth";
import { Spinner } from "react-bootstrap";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithFacebook = async () => {
    const fbProvider = new FacebookAuthProvider();
    fbProvider.addScope("user_birthday");
    fbProvider.setCustomParameters({
      display: "popup", //Login dưới dạng popup
    });
    const result = await signInWithPopup(auth, fbProvider);
    // const token = result.credential.accessToken;
    setUser(result.user);
  };

  const loginWithGoogle = async () => {
    const ggProvider = new GoogleAuthProvider();
    ggProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    ggProvider.setCustomParameters({
      login_hint: "user@example.com",
    });
    const result = await signInWithPopup(auth, ggProvider);
    // const credential = ggProvider.credentialFromResult(auth, result);
    // const token = credential.accessToken;

    setUser(result.user);
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateUserEmail = (email) => updateEmail(user, email);

  const updateUserPassword = (password) => updatePassword(user, password);

  const updateUserProfile = (name, url) =>
    updateProfile(user, {
      displayName: name,
      photoURL: url,
    });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    console.log("User: ", user);
    return unsubscribe;
  }, [user]);

  const value = {
    user,
    signup,
    login,
    loginWithFacebook,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    updateUserProfile,
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};
