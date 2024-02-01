'use client'

import { usePortalContext } from '@/app/(portal)/PortalContext';
import styles from './list.module.css'
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import CompactPost from './CompactPost';
import LoadingSector from '../../loading/LoadingSector';

interface Properties {
    verticalSectorId: string,
    postFetcher: (token: string, page: number) => Promise<Response>,
}

const CompactPostList = ({ verticalSectorId, postFetcher }: Properties) => {
    const {token} = usePortalContext().state;
    console.log(`Token: ${token}`);
    let requested = false;
    const [postsState, setPostsState] = useState<any>({
        latestPage: {
            page: 0,
            page_size: 0,
            items: []
        },
        posts: []
    });
    const reachedTheEnd = () => postsState.latestPage.page >= postsState.latestPage.total_pages;
    const userHasNoPosts = () => postsState.latestPage.page !== 0 && postsState.posts.length === 0;
    const handleScroll = useCallback((event: Event) => {
        if (requested) return;
        const element = event.target as HTMLDivElement;
        const loadingElement = document.getElementById("loading-div")!! as HTMLDivElement;
        if (element.scrollTop + element.clientHeight >= loadingElement.offsetTop + 120) {
            requested = true;
            loadPosts(postsState.latestPage.page + 1);
        }
    }, [postsState, requested]);

    useEffect(() => {
        if (postsState.latestPage.page === 0 && !requested) {requested = true; loadPosts(1); return;}
        if (reachedTheEnd()) return;
        const element = document.getElementById(verticalSectorId)!! as HTMLDivElement;
        element.addEventListener("scroll", handleScroll);
        return () => element.removeEventListener("scroll", handleScroll);
    }, [postsState])

    function loadPosts(page: number) {
        postFetcher(token, page).then(res => res.json()).then(data => {
            console.log(`Loaded page ${data.page}`);
            if (!data.page) return;
            setPostsState({
                latestPage: data,
                posts: [...postsState.posts, ...data.items]
            });
        });
    }

    return (
        <div className={styles.posts}>
            {postsState.posts.map((post: any, index: number) => (
                <CompactPost
                    key={index}
                    id={post.id}
                    authorId={post.author?.id}
                    authorName={post.author?.displayName}
                    authorHandle={post.author?.username}
                    content={post.content}
                    initialStatistics={post.statistics}
                    initialRelationship={post.relationship}
                />
            ))}
            <div className={styles.loading} id="loading-div">
                {userHasNoPosts() ? drawUserHasNoPosts() : (reachedTheEnd() ? drawReachedEnd() : <LoadingSector/>)}
            </div>
        </div>
    )
}

function drawUserHasNoPosts() {
    return (
        <p className={styles.userHasNoPosts}>This user has no posts yet.</p>
    )
}

function drawReachedEnd() {
    return (
        <p className={styles.reachedTheEnd}>You've scrolled all the way down and reached the end!</p>
    )
}

export default CompactPostList;