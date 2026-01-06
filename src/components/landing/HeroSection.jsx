"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const stats = [
        { value: '15,000+', label: 'Students' },
        { value: '600+', label: 'Faculty' },
        { value: '125+', label: 'Programs' },
        { value: 'A+', label: 'NAAC Grade' },
    ];

    return (
        <section className={styles.section} id="home">
            <div className="container">
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className={styles.badge}>Future-Ready Campus Solution</span>
                    <h1 className={styles.title}>
                        Zecurx <span className={styles.highlight}>ERP System</span>
                    </h1>

                    <motion.h1 variants={itemVariants} className={styles.title}>
                        One Platform for<br />
                        <span className={styles.highlight}>Academic Excellence</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className={styles.description}>
                        A unified digital ecosystem connecting students, faculty, and administration.
                        Streamline learning, simplify management, and empower growth.
                    </motion.p>

                    <motion.div variants={itemVariants} className={styles.actions}>
                        <Link href="/login" className={styles.primaryBtn}>
                            Access Portal
                            <ArrowRight size={18} />
                        </Link>
                        <Link href="#features" className={styles.secondaryBtn}>
                            Explore Features
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className={styles.statsRow}>
                        {stats.map((stat, index) => (
                            <div key={index} className={styles.stat}>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
