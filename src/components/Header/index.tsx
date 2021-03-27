import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <img src="spacetraveling-logo.svg" alt="logo" />
    </div>
  )
}
