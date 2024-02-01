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
import CompactPostList from "@/app/components/post/compact/CompactPostList";

const User = ({params}: { params : { id: number } }) => {
    const {token} = usePortalContext().state;
    const userResponse = useSWR(token && `api/v1/users/${params.id}/${token}`, () => userDataFetcher(params.id).then(res => res.json()));

    if (userResponse.isLoading) return <LoadingSector/>;
    else if (userResponse.error) return <div>Something went wrong</div>;
    const user = userResponse.data;

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
            <CompactPostList verticalSectorId="user-div" postFetcher={(token, page) => userPostsFetcher(token, params.id, page)}/>
        </section>
    )
}

export default User;