'use client'

import { usePortalContext } from '@/app/(portal)/PortalContext';
import styles from './page.module.css'
import { postFetcher } from "@/app/api/post";
import { userDataFetcher } from "@/app/api/user";
import Post, { PostViewType } from "@/app/components/post/Post";

import useSWR from "swr";
import LoadingPage from '@/app/components/loading/LoadingPage';
import LoadingSector from '@/app/components/loading/LoadingSector';
import PortalHeader from '@/app/components/header/PortalHeader';
import PostReplyQuestion from '@/app/components/post/expanded/PostReplyQuestion';

const PostPage = ({params}: { params : { id: number, post_id: number } }) => {
    const { token } = usePortalContext().state;
    const authorResponse = useSWR(token && `api/v1/users/${params.id}`, () => userDataFetcher(params.id).then((res) => res.json()));
    const postResponse = useSWR(`api/v1/users/${params.id}/posts/${params.post_id}/${token}`, () => postFetcher(token, params.post_id).then((res) => res.json()));
    if (authorResponse.isLoading || postResponse.isLoading) {
        return (<LoadingSector/>)
    } else if (authorResponse.error || postResponse.error) {
        return (<h1>Post not found</h1>)
    }
    const author = authorResponse.data;
    const post = postResponse.data;

    return (
        <div className={styles.post}>
            <PortalHeader title="Post"/>
            <Post
                view={PostViewType.EXPANDED}
                key={post.id}
                id={post.id}
                index={0}
                total={1}
                authorId={author.id}
                authorName={author.displayName}
                authorHandle={author.username}
                content={post.content}
                initialStatistics={{
                    replies: post.replies,
                    likes: post.likes,
                    reposts: post.reposts,
                    quotes: post.quotes,
                    shares: post.shares,
                    views: post.views
                }}
                initialRelationship={post.relationship}
            />
            <PostReplyQuestion/>
        </div>
    )
}

export default PostPage;