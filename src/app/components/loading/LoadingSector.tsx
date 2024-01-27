import Image from "next/image";
import styles from "./sector.module.css";

export default function LoadingSector() {
    return (
        <div className={styles.loading}>
            <Image
                src="/icons/animated/loading.svg"
                alt="Loading"
                className={styles.loadingIcon}
                width={120}
                height={120}
            />
        </div>
    )
}