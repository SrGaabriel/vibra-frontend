'use client'

import Image from 'next/image';
import styles from './layout.module.css'
import { useReducer, useState } from 'react';
import useSWR from 'swr';
import { userDataFetcher, userSelfDataFetcher } from '../api/user';
import Link from 'next/link';
import PortalContext, { PortalContextType, reducer } from './PortalContext';
import { extractIdFromToken } from '../utils/token';
import LoadingPage from '../components/loading/LoadingPage';
import PostModal, { getPostActionModal } from '../components/modal/post/PostModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    if (!document) return;
    const token = document.cookie.split('; ').find(row => row.startsWith('token'))?.split('=')[1]
    if (!token) return <div>Not logged in</div>;

    const [seed, setSeed] = useState(1);
    const reset = () => setSeed(Math.random());
    const [modalOpen, setModalOpen] = useState(false);

    const fetchUserId = () => extractIdFromToken(token);
    const userData = useSWR(token && `api/v1/users/${fetchUserId()}/${token}`, () => userDataFetcher(fetchUserId()).then(res => res.json()));
    const [portalState, portalDispatcher] = useReducer(reducer, {
        token: token,
        userData: userData.data
    });
    const context: PortalContextType = ({
        state: portalState,
        dispatch: portalDispatcher
    });

    if (userData.isLoading) {
        return (<LoadingPage/>)
    }

    if (userData.error) {
        return (
            <main className={styles.main}>
                <h1>Something went wrong</h1>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <PostModal token={token} reset={reset} open={modalOpen} setOpen={setModalOpen}/>
            <div className={styles.content}>
                <section className={styles.sidebar}>
                    <div className={styles.sidebarTop}>
                        <button onClick={() => {getPostActionModal().showModal(); setModalOpen(true)}} className={styles.postButton}>Post</button>
                    </div>
                    <div className={styles.sidebarBottom}>
                        <div className={styles.sidebarProfile}>
                            <Image
                                src="/design/generic_user.png"
                                alt="Profile Picture"
                                className={styles.sidebarProfilePicture}
                                width={48}
                                height={48}
                            />
                            <div className={styles.sidebarProfileText}>
                                <Link href={`/users/${userData.data.id}`} className={styles.sidebarProfileTextTag}>{userData.data.displayName}</Link>
                                <Link href={`/users/${userData.data.id}`} className={styles.sidebarProfileTextName}>@{userData.data.username}</Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={styles.page}>
                    <PortalContext.Provider key={`context-${seed}`} value={context}>
                        {children}
                    </PortalContext.Provider>
                </section>
            </div>
        </main>
    );
}