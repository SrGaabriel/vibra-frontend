'use client'

import { writePost } from '@/app/api/post';
import styles from './modal.module.css'
import Image from 'next/image';
import { useCallback, useEffect } from 'react';

interface Properties {
    token: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    reset: () => void;
}

const PostModal = ({ token, reset, open, setOpen }: Properties) => {
    return (
        <dialog className={styles.postActionModal} id="postActionModal" onClose={() => setOpen(false)}>
            {open && <div className={styles.postActionModalContainer}>
                <div className={styles.postActionModalContent}>
                    <Image
                        src="/design/generic_user.png"
                        alt="Profile Picture"
                        className={styles.postActionModalProfilePicture}
                        width={48}
                        height={48}
                        draggable={false}
                    />
                    <textarea id="postActionModalContent" className={styles.postActionModalTextArea} placeholder="What's happening?"></textarea>
                </div>
                <div className={styles.postActionModalActions}>
                    <div className={styles.postActionModalActionsLeft}>
                    </div>
                    <div className={styles.postActionModalActionsRight}>
                        <button className={styles.postActionModalPostButton} onClick={
                            () => {
                                writePost(token, (document.getElementById("postActionModalContent")!! as HTMLTextAreaElement).value).then((response) => {
                                    if (response.status == 201) {
                                        getPostActionModal().close();
                                        reset();
                                    }
                                })
                            }
                        }>Post</button>
                    </div>
                </div>
            </div>}
        </dialog>
    )
}

export function getPostActionModal(): HTMLDialogElement {
    return document.getElementById("postActionModal") as HTMLDialogElement;
}

export default PostModal;