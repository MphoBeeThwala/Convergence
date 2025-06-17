import Head from 'next/head';
import styles from '../app/globals.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Unified E-Commerce</title>
        <meta name="description" content="Unified E-Commerce Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Unified E-Commerce</h1>
        <p>Explore our products and shops!</p>
      </main>
    </div>
  );
}
