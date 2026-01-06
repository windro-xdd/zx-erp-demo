"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { GraduationCap, LayoutDashboard, Calendar, CreditCard, ClipboardList, Users, Settings, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const NavbarContent = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view') || 'overview';
    const [role, setRole] = useState(null);

    useEffect(() => {
        setRole(localStorage.getItem('role'));
    }, []);

    const isDashboard = pathname.includes('/dashboard');

    const getNavLinks = () => {
        if (!isDashboard) {
            return (
                <>
                    <Link href="/#features" className={styles.link}>Features</Link>
                    <Link href="/#solutions" className={styles.link}>Solutions</Link>
                    <Link href="/#pricing" className={styles.link}>Pricing</Link>
                    <Link href="/#about" className={styles.link}>About</Link>
                </>
            );
        }

        if (role === 'student') {
            return (
                <>
                    <NavLink href="/student/dashboard" view="overview" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink href="/student/dashboard" view="schedule" icon={Calendar}>Schedule</NavLink>
                    <NavLink href="/student/dashboard" view="assignments" icon={ClipboardList}>Assignments</NavLink>
                    <NavLink href="/student/dashboard" view="fees" icon={CreditCard}>Fees</NavLink>
                    <NavLink href="/student/dashboard" view="library" icon={BookOpen}>Library</NavLink>
                </>
            );
        }

        if (role === 'faculty') {
            return (
                <>
                    <NavLink href="/faculty/dashboard" view="courses" icon={LayoutDashboard}>Courses</NavLink>
                    <NavLink href="/faculty/dashboard" view="attendance" icon={Users}>Attendance</NavLink>
                    <NavLink href="/faculty/dashboard" view="grades" icon={ClipboardList}>Grades</NavLink>
                    <NavLink href="/faculty/dashboard" view="adviser" icon={BookOpen}>Adviser</NavLink>
                </>
            );
        }

        if (role === 'admin') {
            return (
                <>
                    <NavLink href="/admin/dashboard" view="overview" icon={LayoutDashboard}>Admin Console</NavLink>
                    <NavLink href="/admin/dashboard" view="users" icon={Users}>Directory</NavLink>
                    <NavLink href="/admin/dashboard" view="courses" icon={BookOpen}>Academic</NavLink>
                    <NavLink href="/admin/dashboard" view="settings" icon={Settings}>General</NavLink>
                </>
            );
        }

        return null;
    };

    const NavLink = ({ href, view, icon: Icon, children }) => {
        const isActive = currentView === view;
        return (
            <Link
                href={`${href}?view=${view}`}
                className={`${isMobileMenuOpen ? styles.mobileNavLink : styles.link} ${isActive ? styles.linkActive : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <Icon size={16} className={styles.navIcon} />
                {children}
            </Link>
        );
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <motion.header
            className={styles.navbarWrapper}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <GraduationCap size={28} className={styles.logoIcon} />
                    <span>Zecurx <span style={{ color: 'var(--primary)' }}>ERP</span></span>
                </Link>

                {/* Desktop Nav */}
                <nav className={styles.navLinks}>
                    {getNavLinks()}
                </nav>

                {/* Desktop CTA */}
                <div className={styles.ctaGroup}>
                    {role ? (
                        <>
                            <Link href={`/${role}/dashboard`} className={styles.signInBtn}>
                                {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('role');
                                    window.location.href = '/login';
                                }}
                                className={styles.getStartedBtn}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.signInBtn}>Sign in</Link>
                            <Link href="/login" className={styles.getStartedBtn}>Get Started</Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className={`${styles.bar} ${isMobileMenuOpen ? styles.open : ''}`} />
                    <div className={`${styles.bar} ${isMobileMenuOpen ? styles.open : ''}`} />
                    <div className={`${styles.bar} ${isMobileMenuOpen ? styles.open : ''}`} />
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={styles.mobileMenu}
                    >
                        <div className={styles.menuContent}>
                            {!isDashboard ? (
                                <>
                                    <Link href="/#features" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                                    <Link href="/#solutions" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Solutions</Link>
                                    <Link href="/#pricing" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                                    <Link href="/#about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                                </>
                            ) : (
                                <>
                                    {getNavLinks()}
                                </>
                            )}

                            <div className={styles.divider} />

                            {role ? (
                                <>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('role');
                                            window.location.href = '/login';
                                        }}
                                        className={styles.mobileNavBtn}
                                        style={{ color: '#DC2626', background: 'rgba(220, 38, 38, 0.1)' }}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className={styles.mobileNavBtn}
                                    style={{ background: 'var(--yen-green)', color: 'white' }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login / Get Started
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

const Navbar = () => (
    <Suspense fallback={<header className={styles.navbarWrapper} style={{ minHeight: 'var(--navbar-height)' }} />}>
        <NavbarContent />
    </Suspense>
);

export default Navbar;
