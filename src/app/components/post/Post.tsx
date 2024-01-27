'use client'

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import PostStatistics, { PostRelationship } from '../../objects/PostStatistics';
import { likePost, unlikePost } from '../../api/post';

import globalStyles from './global.module.css';
import compactStyles from './compact.module.css';
import expandedStyles from './expanded.module.css'; 

interface Properties {
    view: PostViewType;
    id: number;
    index: number;
    total: number;
    authorId: number;
    authorName: string;
    authorHandle: string;
    content: string;
    initialStatistics: PostStatistics;
    initialRelationship: PostRelationship;
}

export enum PostViewType {
    COMPACT,
    EXPANDED
}

const Post = ({view, id, index, content, authorId, authorHandle, authorName, total, initialStatistics, initialRelationship}: Properties) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token'))?.split('=')[1]!!
    const [statistics, setStatistics] = useState<PostStatistics>(initialStatistics);
    const [relationship, setRelationship] = useState<PostRelationship>(initialRelationship);
    const likeAsset = relationship.liked ? "/icons/heart_fill.svg" : "/icons/heart.svg";

    function makePostAction(action: string, icon: string, value: number, activated?: boolean, handler?: () => void) {
        return (
            <div className={styles("action", `action${action}`)} onClick={(event) => {
                event.preventDefault();
                handler && handler();
            }}>
                <Image
                    src={icon}
                    alt={action}
                    className={activated ? styles("actionIcon", "activatedActionIcon") : styles("actionIcon")}
                    width={16}
                    height={16}
                />
                <span className={activated ? styles("actionValue", "activatedActionValue") : styles("actionValue")}>{value ?? 256}</span>
            </div>
        )
    }

    function styles(...styles: string[]): string {
        let classes = "";
        const specializedStyles = view === PostViewType.COMPACT ? compactStyles : expandedStyles;
        for (const style of styles) {
            classes += `${globalStyles[style]} ${specializedStyles[style]} `;
        }
        return classes
    }
    const PostContainer = ({children}: { children: React.ReactNode }) => {
        if (view === PostViewType.COMPACT) {
            return (
                <Link href={`/users/${authorId}/posts/${id}`} className={styles("post")} style={{ borderTop: index === 0 ? 'none' : '1px solid var(--secondary)', borderBottom: index === total-1 ? '1px solid var(--secondary)' : 'none' }}>
                    {children}
                </Link>
            )
        } else {
            return (
                <div className={styles("post")} style={{ borderTop: index === 0 ? 'none' : '1px solid var(--secondary)', borderBottom: index === total-1 ? '1px solid var(--secondary)' : 'none' }}>
                    {children}
                </div>
            )
        }
    }

    return (
        <PostContainer>
            <div className={styles("avatarSection")}>
                <Image
                    src="/design/generic_user.png"
                    alt="Avatar"
                    className={styles("avatar")}
                    width={40}
                    height={40}
                />
            </div>
            <div className={styles("innerPost")}>
                <div className={styles("postInfo")}>
                    <div className={styles("authorInfo")}>
                        <div className={styles("authorDisplayName")}>{authorName}</div>
                        <div className={styles("authorHandle")}>@{authorHandle}</div>
                    </div>
                </div>
                <div className={styles("content")}>
                    <p>{content}</p>
                </div>
                <div className={styles("actions")}>
                    {makePostAction("Reply", "/icons/comment_dots.svg", statistics.replies)}
                    {makePostAction("Like", likeAsset, statistics.likes, relationship.liked, () => {
                        if (relationship.liked) {
                            setStatistics({...statistics, likes: statistics.likes-1});
                        } else {
                            setStatistics({...statistics, likes: statistics.likes+1});
                        }
                        if (!relationship.liked) {
                            likePost(token, id);
                        } else {
                            unlikePost(token, id);
                        }
                        setRelationship({...relationship, liked: !relationship.liked});
                    })}
                    {makePostAction("Repost", "/icons/arrows-retweet.svg", statistics.reposts)}
                    {makePostAction("Quote", "/icons/comment-quote.svg", statistics.quotes)}
                    {makePostAction("Share", "/icons/share.svg", statistics.shares)}
                </div>
            </div>
        </PostContainer>
    )
}

export default Post;