import Image from 'next/image'
import styles from './page.module.css'

export default function LoadingPage() {
    return (
        <div className={styles.page}>
            <Image
                src="/icons/animated/loading.svg"
                alt="Loading"
                className={styles.loadingIcon}
                width={240}
                height={240}
            />
        </div>
    )
}