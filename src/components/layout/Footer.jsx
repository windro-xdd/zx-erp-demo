import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <GraduationCap size={24} />
                            <span>Zecurx ERP</span>
                        </div>
                        <h3 className={styles.footerLogo}>
                            ZX <span style={{ color: 'var(--primary)' }}>ERP</span>
                        </h3>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.column}>
                            <h4>Quick Links</h4>
                            <Link href="#features">Features</Link>
                            <Link href="/login">Student Portal</Link>
                            <Link href="/login">Faculty Portal</Link>
                        </div>
                        <div className={styles.column}>
                            <h4>University</h4>
                            <a href="https://www.zecurex.com/" target="_blank" rel="noopener noreferrer">Official Website</a>
                            <a href="https://www.zecurex.com/about-us" target="_blank" rel="noopener noreferrer">About Us</a>
                            <a href="https://www.zecurex.com/contact-us" target="_blank" rel="noopener noreferrer">Contact</a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2026 Zecurx ERP. All rights reserved.</p>
                    <p className={styles.demo}>Demo Application</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
