import axios from "axios";

const api = axios.create({
    baseURL: `/api/user`
});

export const checkUniqueUsername = async (username: string) => {
    try {
        const response = await api.get(`/check-unique-username?username=${username}`);
        return response.data;
    } catch (error: any) {
        console.error("Error checking username:", error);
        throw error;
    }
}

export const signUp = async (username: string, password: string) => {
    try {
        const response = await api.post(`/sign-up`, { username, password });
        return response.data;
    } catch (error: any) {
        console.error("Error signing up:", error);
        throw error;
    }
}

export const login = async (username: string, password: string) => {
    try {
        const response = await api.post(`/login`, { username, password });
        return response.data;
    } catch (error: any) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export const logout = async () => {
    try {
        const response = await api.post(`/logout`);
        return response.data;
    } catch (error: any) {
        console.error("Error in Logout:", error);
        throw error;
    }
}