import React, { useEffect, useState, createContext } from 'react';
import firebase from 'firebase';
import app from '../utils/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        app.auth().onAuthStateChanged(currentUser => {
            setCurrentUser(currentUser);
            try {
                firebase.database().ref(`users`).child(currentUser.uid).once('value', snap => {
                    console.log(snap.val());
                    setCurrentUser({
                        ...currentUser,
                        ...snap.val()
                    });
                })   
            } catch (error) {
                console.log('Error Occured!');
            }
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{currentUser}}
            >

                {children}

        </AuthContext.Provider>
    );
}