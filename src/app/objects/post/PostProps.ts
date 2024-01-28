import PostStatistics, { PostRelationship } from "@/app/objects/post/PostStatistics";

export default interface PostProps {
    id: number;
    authorId: number;
    authorName: string;
    authorHandle: string;
    content: string;
    initialStatistics: PostStatistics;
    initialRelationship: PostRelationship;
}