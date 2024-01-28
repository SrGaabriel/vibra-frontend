export default interface PostStatistics {
    likes: number;
    replies: number;
    shares: number;
    views: number;
    quotes: number;
    reposts: number;
}

export interface PostRelationship {
    liked: boolean;
    replied: boolean;
    shared: boolean;
    viewed: boolean;
    quoted: boolean;
    reposted: boolean;
}