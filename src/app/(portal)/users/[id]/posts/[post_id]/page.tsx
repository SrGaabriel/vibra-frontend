'use client'

import { usePortalContext } from '@/app/(portal)/PortalContext';
import styles from './page.module.css'
import { fetchReplies, postFetcher } from "@/app/api/post";
import { userDataFetcher } from "@/app/api/user";

import useSWR from "swr";
import LoadingPage from '@/app/components/loading/LoadingPage';
import LoadingSector from '@/app/components/loading/LoadingSector';
import PortalHeader from '@/app/components/header/PortalHeader';
import ExpandedPost from '@/app/components/post/expanded/ExpandedPost';
import PostReplyRequest from '@/app/components/post/expanded/reply/PostReplyRequest';
import CompactPostList from '@/app/components/post/compact/CompactPostList';

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
        <div className={styles.post} id="post-sector">
            <PortalHeader title="Post"/>
            <ExpandedPost
                key={post.id}
                id={post.id}
                authorId={author.id}
                authorName={author.displayName}
                authorHandle={author.username}
                content={post.content}
                initialStatistics={post.statistics}
                initialRelationship={post.relationship}
            />
            <PostReplyRequest
                token={token}
                postId={post.id}
                authorId={author.id}
                authorUsername={author.username}
            />
            <CompactPostList verticalSectorId="post-sector" postFetcher={(token, page) => fetchReplies(token, params.post_id, page)}/>
        </div>
    )
}

export default PostPage;