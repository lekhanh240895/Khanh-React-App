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

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

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
    // const fbToken = result.credential.accessToken;
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
    // const ggToken = credential.accessToken;

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
      {!loading && children}
    </AuthContext.Provider>
  );
};
