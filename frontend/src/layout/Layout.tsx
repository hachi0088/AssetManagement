import { ReactElement } from 'react';
import Header from '../components/Header/Header';
import styles from '../styles/Layout.module.css'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const Layout = ({ children }: LayoutProps) => (
  <div>
    <Header />
    <div className={styles.main}>
      <main>{children}</main>
    </div>
  </div>
)