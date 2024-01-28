import PostBarebones from "@/app/objects/post/PostBarebones";
import PostProps from "@/app/objects/post/PostProps";
import expandedStyles from './expanded.module.css'
import Image from "next/image";
import Snowflake from "@/app/utils/snowflake";
import { usePortalContext } from "@/app/(portal)/PortalContext";
import { useState } from "react";
import PostStatistics, { PostRelationship } from "@/app/objects/post/PostStatistics";
import Link from "next/link";

const ExpandedPost = ({ id, authorId, authorName, authorHandle, content, initialStatistics, initialRelationship, }: PostProps) => {
    const { token } = usePortalContext().state;
    const [statistics, setStatistics] = useState<PostStatistics>(initialStatistics);
    const [relationship, setRelationship] = useState<PostRelationship>(initialRelationship);
    const barebones = new PostBarebones();
    const styles = barebones.createStylesheet(expandedStyles);

    const authorPage = `/users/${authorId}`;

    return (
        <div className={styles("post")}>
           <div className={styles("postContent")}>
                <div className={styles("postIdentifier")}>
                    <Link href={authorPage}>
                        <Image
                            src="/design/generic_user.png"
                            alt="Post Author's Profile Picture"
                            className={styles("postProfilePicture")}
                            width={40}
                            height={40}
                        />
                    </Link>
                    <div className={styles("postAuthor")}>
                        <Link href={authorPage} className={styles("postAuthorName")}>{authorName}</Link>
                        <Link href={authorPage} className={styles("postAuthorHandle")}>@{authorHandle}</Link>
                    </div>
                </div>
                <div className={styles("postText")}>
                    {content}
                </div>
                <div className={styles("postDate")}>
                    {getPostFormattedDate(id)}
                </div>
           </div>
           {barebones.getPostActions(styles, token, id, statistics, setStatistics, relationship, setRelationship)}
        </div>
    )
}

function getPostFormattedDate(postId: number) {
    const date = new Snowflake(BigInt(postId)).timestamp;
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    
    const formattedDate = date.toLocaleString('en-US', options);
    console.log(formattedDate);
    
    // Extract time and date components
    const [datePart, yearPart, hourPart] = formattedDate.split(', ');
    
    // Rearrange the components in the desired order
    return `${hourPart} · ${datePart}, ${yearPart}`;
}

export default ExpandedPost;