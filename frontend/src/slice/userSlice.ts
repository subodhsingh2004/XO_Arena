import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    _id: string;
    username: string;
    totalPoints: number;
    gamesPlayed: number;
    gamesWon: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserState {
    userDetails: User | null;
    isLoggedIn: boolean;
}

const getUserFromSessionStorage = (): User | null => {
    try {
        const user = sessionStorage.getItem("user")
        return user ? JSON.parse(user) : null
    } catch (err) {
        console.error("Error parsing user from sessionStorage", err)
        return null
    }
}

const user = getUserFromSessionStorage()

const initialState: UserState = {
    userDetails: user,
    isLoggedIn: user ? true : false
}

const userSlice = createSlice({
    name: "user",

    initialState,

    reducers: {
        loginReducer: (state, action: PayloadAction<User>) => {
            state.userDetails = action.payload;
            state.isLoggedIn = true;
            try {
                sessionStorage.setItem("user", JSON.stringify(action.payload))
            } catch (err) {
                console.error("Error saving user to sessionStorage", err)
            }
        },
        logoutReducer: (state) => {

            state.userDetails = null;
            state.isLoggedIn = false;

            try {
                console.log("working")
                sessionStorage.removeItem("user")
            } catch (err) {
                console.error("Error removing user from sessionStorage", err)
            }

        },
        updateStats: (state, action: PayloadAction<{ point: number, winner: boolean }>) => {
            if (state.userDetails) {

                state.userDetails.gamesPlayed += 1
                state.userDetails.totalPoints += action.payload.point 

                if(action.payload.winner){
                    state.userDetails.gamesWon += 1
                }

                try {
                    sessionStorage.setItem("user", JSON.stringify(state.userDetails));
                } catch (err) {
                    console.error("Error updating user in sessionStorage", err);
                }
            }
        }
    },
});

export default userSlice.reducer;
export const { loginReducer, logoutReducer, updateStats } = userSlice.actions;