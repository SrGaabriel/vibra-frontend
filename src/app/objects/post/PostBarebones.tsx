import globalStyles from '@/app/components/post/global.module.css'
import Image from 'next/image';
import PostStatistics, { PostRelationship } from './PostStatistics';
import { likePost, unlikePost } from '@/app/api/post';

export default class PostBarebones {
    createStylesheet(styles: any): ((...args: any[]) => string) {
        return (...args: any[]) => {
            let classes = "";
            for (const style of args) {
                classes += `${globalStyles[style]} ${styles[style]} `;
            }
            return classes
        }
    }

    getPostActions(stylesheet: any, token: string, postId: number, statistics: PostStatistics, setStatistics: (statistics: PostStatistics) => void, relationship: PostRelationship, setRelationship: (relationship: PostRelationship) => void): any {
        console.log("Statistics: ", statistics)
        return (
            <div className={stylesheet("postActions")}>
                {this.makePostAction(stylesheet, "Reply", "/icons/comment_dots.svg", statistics.replies)}
                {this.makePostAction(stylesheet, "Repost", "/icons/arrows-retweet.svg", statistics.reposts)}
                {this.makePostAction(stylesheet, "Like", "/icons/heart.svg", statistics.likes, relationship.liked, () => {
                    if (relationship.liked) {
                        setStatistics({...statistics, likes: statistics.likes-1});
                    } else {
                        setStatistics({...statistics, likes: statistics.likes+1});
                    }
                    if (!relationship.liked) {
                        likePost(token, postId);
                    } else {
                        unlikePost(token, postId);
                    }
                    setRelationship({...relationship, liked: !relationship.liked});
                })}
                {this.makePostAction(stylesheet, "Quote", "/icons/comment-quote.svg", statistics.quotes)}
                {this.makePostAction(stylesheet, "Share", "/icons/share.svg", statistics.shares)}
            </div>
        )
    }

    private makePostAction(stylesheet: any, action: string, icon: string, value: number, activated?: boolean, handler?: () => void): JSX.Element {
        return (
            <div className={stylesheet("action", `action${action}`)} onClick={(event) => {
                event.preventDefault();
                handler && handler();
            }}>
                <Image
                    src={icon}
                    alt={action}
                    className={activated ? stylesheet("actionIcon", "activatedActionIcon") : stylesheet("actionIcon")}
                    width={16}
                    height={16}
                />
                <span className={activated ? stylesheet("actionValue", "activatedActionValue") : stylesheet("actionValue")}>{value ?? 256}</span>
            </div>
        )
    }
}

