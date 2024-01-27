'use client'

import Image from "next/image";
import styles from "./portalHeader.module.css";

interface Properties {
    title: string;
    subtitle?: string | null;
    onBack?: (() => void) | null;
}

export default function PortalHeader({ title, subtitle, onBack }: Properties) {
    return (
        <div className={styles.portalHeader}>
            <Image
                src="/icons/arrow-small-left.svg"
                alt="Go back"
                className={styles.portalHeaderIcon}
                width={28}
                height={28}
                onClick={() => {
                    if (onBack) onBack();
                    else window.history.back();
                }}
            />
            <div className={styles.portalHeaderTitles}>
                <span className={styles.portalHeaderTitle}>{title}</span>
                {subtitle && <span className={styles.portalHeaderSubtitle}>{subtitle}</span>}
            </div>
        </div>
    )
}