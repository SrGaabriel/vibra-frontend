import styles from './layout.module.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className={styles.authPage}>
        <div className={styles.authPageContainer}>
          <div className={styles.authPageContent}>
              {children}
          </div>
        </div>
    </main>
  )
}