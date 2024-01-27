import API_URL from "./api";

export const userSelfDataFetcher = (token: String): Promise<any> =>
    fetch(`${API_URL}/users/@me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

export const userDataFetcher = (userId: number): Promise<Response> =>
    fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

export const userPostsFetcher = (token: string | undefined, userId: number, page: number): Promise<Response> =>
    fetch(`${API_URL}/users/${userId}/posts/${page}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });