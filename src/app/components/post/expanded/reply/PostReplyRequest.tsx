import Image from 'next/image';
import styles from './reply.module.css'
import { useCallback, useRef, useState } from 'react';
import { writeReply } from '@/app/api/post';

interface Properties {
    token: string,
    postId: number,
    authorId: number,
    authorUsername: number
}

const PostReplyRequest = ({ token, postId, authorId, authorUsername }: Properties) => {
    const [hasClicked, setHasClicked] = useState(false);
    const [contentSize, setContentSize] = useState(0);
    const handleInputChange = useCallback((event: any) => {
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
        setContentSize(event.target.value.length);
    }, []);
    const getTextArea = useCallback(() => document.getElementById('replyRequestTextArea'), []);

    function drawPostButton(enabled: boolean) {
        return (
            <button onClick={(event) => {
                if (!enabled) return;
    
                const textArea = document.getElementById('replyRequestTextArea') as HTMLTextAreaElement;
                const content = textArea.value;
    
                writeReply(token, postId, content)
            }} className={`${styles.replyRequestPostButton} ${styles[`replyRequestPostButton${enabled ? 'Enabled' : 'Disabled'}`]}`}>
                Post
            </button>
        )
    }

    return (
        <div className={styles.replyRequest} onClick={() => !hasClicked && setHasClicked(true)}>
            {hasClicked && <div className={styles.replyRequestHeader}>
                Replying to <span className={styles.replyRequestHeaderUsername}>@{authorUsername}</span> 
            </div>}
            <div className={styles.replyRequestContent}>
                <Image
                    src="/design/generic_user.png"
                    alt="Post Author's Profile Picture"
                    className={styles.replyRequestProfilePicture}
                    width={40}
                    height={40}
                />
                <textarea
                    id="replyRequestTextArea"
                    onInput={handleInputChange}
                    className={styles.replyRequestTextArea}
                    placeholder="Write a reply..."
                >
                </textarea>
                {!hasClicked && drawPostButton(false)}
            </div>
            {hasClicked && <div className={styles.replyRequestFooter}>
                <div className={styles.replyRequestAttachments}>
                </div>
                {drawPostButton(contentSize > 0)}
            </div>}
        </div>
    )
}

export default PostReplyRequest;