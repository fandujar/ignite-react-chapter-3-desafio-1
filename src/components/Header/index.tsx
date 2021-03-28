import styles from './header.module.scss';

import Link from 'next/link';

export default function Header() {
  return (
    <div className={`${styles.headerContainer}`}>
      <Link href="/">
        <a>
          <img src="/spacetraveling-logo.svg" alt="logo" />
        </a>
      </Link>
    </div>
  )
}