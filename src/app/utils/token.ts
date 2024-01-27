export function extractIdFromToken(token: string): number {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const id = JSON.parse(decodedPayload).id;
    console.log(id);
    return id;
}