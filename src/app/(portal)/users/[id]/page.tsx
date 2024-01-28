'use client'

import { userDataFetcher, userPostsFetcher } from "@/app/api/user";
import Image from "next/image";
import styles from './page.module.css'
import useSWR from "swr";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePortalContext } from "../../PortalContext";
import LoadingSector from "@/app/components/loading/LoadingSector";
import PortalHeader from "@/app/components/header/PortalHeader";
import CompactPost from "@/app/components/post/compact/CompactPost";

const User = ({params}: { params : { id: number } }) => {
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
    const reachedTheEnd = () => postsState.latestPage.page_size > postsState.latestPage.items.length;
    const userHasNoPosts = () => postsState.latestPage.page !== 0 && postsState.posts.length === 0;
    console.log(`Current page: ${postsState.latestPage}`)
    const handleScroll = useCallback((event: Event) => {
        if (requested) return;
        console.log(`Scroll page: ${postsState.latestPage.page}`)
        const element = event.target as HTMLDivElement;
        const loadingElement = document.getElementById("loading-div")!! as HTMLDivElement;
        // Check if the user scrolled until the loading element is visible by 40px
        if (element.scrollTop + element.clientHeight >= loadingElement.offsetTop + 120) {
            requested = true;
            loadPosts(postsState.latestPage.page + 1);
        }
    }, [postsState, requested]);
    const userResponse = useSWR(token && `api/v1/users/${params.id}/${token}`, () => userDataFetcher(params.id).then(res => res.json()));

    useEffect(() => {
        if (!userResponse.data) return;
        if (postsState.latestPage.page === 0 && !requested) {requested = true; loadPosts(1); return;}
        if (reachedTheEnd()) return;
        const element = document.getElementById("user-div")!! as HTMLDivElement;
        element.addEventListener("scroll", handleScroll);
        return () => element.removeEventListener("scroll", handleScroll);
    }, [userResponse])

    if (userResponse.isLoading) return <div>Loading</div>;
    else if (userResponse.error) return <div>Something went wrong</div>;
    const user = userResponse.data;

    function loadPosts(page: number) {
        userPostsFetcher(token, params.id, page).then(res => res.json()).then(data => {
            console.log(`Loaded page ${data.page}`);
            setPostsState({
                latestPage: data,
                posts: [...postsState.posts, ...data.items]
            });
        });
    }

    return (
        <section className={styles.user} id="user-div">
            <PortalHeader title={user.displayName} subtitle={`@${user.username}`}/>
            <div className={styles.profile}>
                <div className={styles.profileMedia}>
                    <Image
                        src="/design/banner.jpg"
                        alt="Profile Banner"
                        className={styles.profileBanner}
                        width={2560}
                        height={1080}
                    />
                    <Image
                        src="/design/generic_user.png"
                        alt="Profile Picture"
                        className={styles.profilePicture}
                        width={180}
                        height={180}
                    />
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.profileInfoName}>
                        <span className={styles.profileDisplayName}>{user.displayName}</span>
                        <span className={styles.profileUsername}>@{user.username}</span>
                    </div>
                    <span className={styles.profileDescription}>📲 All Real Madrid updates, transfer news, stats, pictures and much more are found right here for the fans.</span>
                </div>
            </div>
            <div className={styles.posts}>
                {postsState.posts.map((post: any, index: number) => (
                    <CompactPost
                        key={index}
                        id={post.id}
                        authorId={post.authorId}
                        authorName={user.displayName}
                        authorHandle={user.username}
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
                ))}
                <div className={styles.loading} id="loading-div">
                    {userHasNoPosts() ? drawUserHasNoPosts() : (reachedTheEnd() ? drawReachedEnd() : <LoadingSector/>)}
                </div>
            </div>
        </section>
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

export default User;