import API_URL from "./api";

export const postFetcher = (token: string | undefined, postId: number): Promise<Response> =>
    fetch(`${API_URL}/posts/${postId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });

export const writePost = (token: string, content: string): Promise<Response> =>
    fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content })
    });

export const likePost = (token: string, postId: number): Promise<Response> => 
    fetch(`${API_URL}/posts/${postId}/likes`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

export const unlikePost = (token: string, postId: number): Promise<Response> => 
    fetch(`${API_URL}/posts/${postId}/likes`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });