import PostProps from "@/app/objects/post/PostProps";
import compactStyles from "./compact.module.css";
import PostBarebones from "@/app/objects/post/PostBarebones";
import { usePortalContext } from "@/app/(portal)/PortalContext";
import { useState } from "react";
import PostStatistics, { PostRelationship } from "@/app/objects/post/PostStatistics";
import Image from "next/image";
import Link from "next/link";
import Snowflake from "@/app/utils/snowflake";

const CompactPost = ({ id, authorId, authorName, authorHandle, content, initialStatistics, initialRelationship, }: PostProps) => {
    const { token } = usePortalContext().state;
    const [statistics, setStatistics] = useState<PostStatistics>(initialStatistics);
    const [relationship, setRelationship] = useState<PostRelationship>(initialRelationship);
    const barebones = new PostBarebones();
    const styles = barebones.createStylesheet(compactStyles);
    const postDate = new Snowflake(BigInt(id)).timestamp;

    return (
        <Link href={`/users/${authorId}/posts/${id}`} className={styles("post")}>
            <div className={styles("postAvatarSection")}>
                <Image
                    src="/design/generic_user.png"
                    alt="Post Author's Profile Picture"
                    className={styles("postProfilePicture")}
                    width={40}
                    height={40}
                />
            </div>
            <div className={styles("postContentSection")}>
                <div className={styles("postIdentifier")}>
                    <div className={styles("postAuthorship")}>
                        <span className={styles("postAuthorName")}>{authorName}</span>
                        <span className={styles("postAuthorHandle")}>@{authorHandle} · {getFormattedDate(postDate)}</span>
                    </div>
                </div>
                <div className={styles("postText")}>
                    {content}
                </div>
                {barebones.getPostActions(styles, token, id, statistics, setStatistics, relationship, setRelationship)}
            </div>
        </Link>
    )
}

function getFormattedDate(inputDate: Date): string {
    const now = new Date();
    const elapsedHours = Math.floor((now.getTime() - inputDate.getTime()) / (1000 * 60 * 60));
  
    // If elapsed time is higher than 24 hours, return month date format
    if (elapsedHours >= 24) {
      const month = inputDate.toLocaleString('en-us', { month: 'short' });
      const day = inputDate.getDate();
      return `${month} ${day}`;
    }
  
    // If date is not in the current year, return month date year format
    if (now.getFullYear() !== inputDate.getFullYear()) {
      const month = inputDate.toLocaleString('en-us', { month: 'short' });
      const day = inputDate.getDate();
      const year = inputDate.getFullYear();
      return `${month} ${day}, ${year}`;
    }
  
    return `${elapsedHours}h`;
}

export default CompactPost;