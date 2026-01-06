'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { Users, Book, BarChart2, Plus, Search, Trash2, Shield } from 'lucide-react';
import styles from '../../../styles/Dashboard.module.css';
import Modal from '../../../components/shared/Modal';

const StatCard = ({ title, value, icon: Icon, type }) => {
    const iconColors = {
        blue: { bg: 'rgba(67, 94, 190, 0.1)', text: '#435EBE' },
        green: { bg: 'rgba(152, 189, 32, 0.1)', text: '#98BD20' },
        orange: { bg: 'rgba(249, 115, 22, 0.1)', text: '#F97316' }
    };
    const colors = iconColors[type] || iconColors.blue;

    return (
        <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: colors.bg, color: colors.text }}>
                <Icon size={24} />
            </div>
            <div>
                <p className={styles.statLabel}>{title}</p>
                <p className={styles.statValue}>{value}</p>
            </div>
        </div>
    );
};

const AdminDashboardContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'overview';
    const [activeView, setActiveView] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data States
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([
        { id: 1, name: 'Data Structures', code: 'CS301', faculty: 'Dr. Sarah', students: 45 },
        { id: 2, name: 'Advanced Algorithms', code: 'CS450', faculty: 'Prof. Mark', students: 32 }
    ]);
    const [batches, setBatches] = useState([
        { id: 1, name: 'CS 2024 - Section A', code: 'CS-2024-A', students: 45, adviser: 'Dr. Sarah Smith', department: 'Computer Science' },
        { id: 2, name: 'CS 2024 - Section B', code: 'CS-2024-B', students: 42, adviser: 'Prof. Mark Wilson', department: 'Computer Science' },
        { id: 3, name: 'CS 2023 - Section A', code: 'CS-2023-A', students: 48, adviser: 'Dr. Linda Chen', department: 'Computer Science' },
        { id: 4, name: 'ECE 2024 - Section A', code: 'ECE-2024-A', students: 40, adviser: 'Dr. James Brown', department: 'Electronics' },
    ]);
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [settings, setSettings] = useState({ universityName: 'Zecurx ERP Demo', sessionYear: '2025-26', registrationOpen: true });

    // Form State
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });

    // Sync activeView with URL
    useEffect(() => {
        setActiveView(view);
    }, [view]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'admin') {
            router.push('/login');
        } else {
            // Load from LocalStorage
            const storedUsers = JSON.parse(localStorage.getItem('erp_users') || '[]');
            if (storedUsers.length === 0) {
                const initialUsers = [
                    { id: 1, name: 'John Doe', email: 'john@zecurx.com', role: 'student' },
                    { id: 2, name: 'Prof. Sarah', email: 'sarah@zecurx.com', role: 'faculty' }
                ];
                localStorage.setItem('erp_users', JSON.stringify(initialUsers));
                setUsers(initialUsers);
            } else {
                setUsers(storedUsers);
            }

            const storedActivities = JSON.parse(localStorage.getItem('erp_activities') || '[]');
            setActivities(storedActivities);

            setLoading(false);
        }
    }, [router]);

    const handleCreateUser = (e) => {
        e.preventDefault();
        const userToAdd = { ...newUser, id: Date.now() };
        const updatedUsers = [userToAdd, ...users];
        setUsers(updatedUsers);
        localStorage.setItem('erp_users', JSON.stringify(updatedUsers));

        const newActivity = {
            id: Date.now(),
            title: 'User Created',
            desc: `New ${newUser.role} profile registered: ${newUser.name}`,
            time: 'Just now',
            type: newUser.role === 'admin' ? 'red' : 'blue'
        };
        const updatedActivities = [newActivity, ...activities];
        setActivities(updatedActivities);
        localStorage.setItem('erp_activities', JSON.stringify(updatedActivities.slice(0, 10)));

        setNewUser({ name: '', email: '', role: 'student' });
        setIsModalOpen(false);
    };

    const deleteUser = (id) => {
        const updated = users.filter(u => u.id !== id);
        setUsers(updated);
        localStorage.setItem('erp_users', JSON.stringify(updated));
    };

    if (loading) return <div style={{ background: 'var(--bg-body)', minHeight: '100vh' }} />;

    return (
        <div className={styles.pageWrapper}>
            <Navbar />

            <main className={styles.main}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>Admin Portal</h1>
                        <p className={styles.pageSubtitle}>
                            {activeView === 'overview' ? 'System Overview & Analytics' : 'User Management & Access Control'}
                        </p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className={styles.btnPrimary}>
                        <Plus size={18} /> Create New User
                    </button>
                </div>

                {/* Stats Row */}
                <div className={styles.statsGrid}>
                    <StatCard title="Total Students" value={users.filter(u => u.role === 'student').length + 2843} icon={Users} type="blue" />
                    <StatCard title="Total Faculty" value={users.filter(u => u.role === 'faculty').length + 140} icon={Users} type="green" />
                    <StatCard title="Active Courses" value="86" icon={Book} type="orange" />
                    <StatCard title="System Load" value="12%" icon={BarChart2} type="blue" />
                </div>

                {/* Main Content Area */}
                <div className={styles.contentCard}>
                    {activeView === 'overview' ? (
                        <>
                            <h3 className={styles.cardTitle}>Recent Activity</h3>
                            <div className={styles.listContainer}>
                                {activities.length > 0 ? activities.map((act) => (
                                    <div key={act.id} className={styles.listItem}>
                                        <div className={styles.listContent}>
                                            <div
                                                className={styles.dot}
                                                style={{ background: act.type === 'red' ? 'var(--primary-red)' : 'var(--primary-blue)' }}
                                            ></div>
                                            <div>
                                                <p className={styles.itemMain}>{act.title}</p>
                                                <p className={styles.itemSub}>{act.desc}</p>
                                            </div>
                                        </div>
                                        <span className={styles.itemTime}>{act.time}</span>
                                    </div>
                                )) : (
                                    <div className={styles.emptyState}>No recent system activity.</div>
                                )}
                            </div>
                        </>
                    ) : activeView === 'users' ? (
                        <>
                            <div className={styles.cardHeaderFlex}>
                                <h3 className={styles.cardTitle}>University Directory</h3>
                                <div className={styles.searchBox}>
                                    <Search size={16} />
                                    <input
                                        placeholder="Search name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Member Name</th>
                                            <th>Official Email</th>
                                            <th>Role</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                                            <tr key={user.id}>
                                                <td className={styles.bold}>{user.name}</td>
                                                <td className={styles.muted}>{user.email}</td>
                                                <td>
                                                    <span className={`${styles.badge} ${styles['badge-' + user.role]}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button onClick={() => deleteUser(user.id)} className={styles.deleteBtn}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : activeView === 'courses' ? (
                        <>
                            <h3 className={styles.cardTitle}>Active Course Allocation</h3>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Faculty</th>
                                            <th>Enrolled</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course.id}>
                                                <td>
                                                    <div className={styles.bold}>{course.name}</div>
                                                    <div className={styles.muted}>{course.code}</div>
                                                </td>
                                                <td className={styles.bold}>{course.faculty}</td>
                                                <td>{course.students} Students</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Batch Management */}
                            <div style={{ marginTop: 'var(--space-8)' }}>
                                <h3 className={styles.cardTitle}>Batch Management & Class Advisers</h3>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Batch</th>
                                                <th>Department</th>
                                                <th>Students</th>
                                                <th>Class Adviser</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {batches.map(batch => (
                                                <tr key={batch.id}>
                                                    <td>
                                                        <div className={styles.bold}>{batch.name}</div>
                                                        <div className={styles.muted}>{batch.code}</div>
                                                    </td>
                                                    <td>{batch.department}</td>
                                                    <td>{batch.students}</td>
                                                    <td>
                                                        <span className={styles.badge} style={{ background: 'rgba(201, 162, 39, 0.1)', color: 'var(--yen-gold)' }}>
                                                            {batch.adviser}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={styles.btnOutline}
                                                            onClick={() => alert(`Edit adviser for ${batch.name}`)}
                                                        >
                                                            Edit Adviser
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className={styles.cardTitle}>Global Settings</h3>
                            <div className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label>University Title</label>
                                    <input
                                        value={settings.universityName}
                                        onChange={(e) => setSettings({ ...settings, universityName: e.target.value })}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Academic Year</label>
                                    <select
                                        value={settings.sessionYear}
                                        onChange={(e) => setSettings({ ...settings, sessionYear: e.target.value })}
                                    >
                                        <option>2024-25</option>
                                        <option>2025-26</option>
                                        <option>2026-27</option>
                                    </select>
                                </div>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => alert('Settings Saved (Mock)')}
                                >
                                    Save Configuration
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New User"
            >
                <form onSubmit={handleCreateUser} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                            required
                            placeholder="Enter name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>University Email</label>
                        <input
                            required
                            type="email"
                            placeholder="name@zecurx.com"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Role Assignment</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setIsModalOpen(false)} className={styles.btnSecondary}>Cancel</button>
                        <button type="submit" className={styles.btnPrimary}>Create Profile</button>
                    </div>
                </form>
            </Modal>

            <Footer />
        </div >
    );
};

const AdminDashboard = () => (
    <Suspense fallback={<div className={styles.pageWrapper}><div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} /></div>}>
        <AdminDashboardContent />
    </Suspense>
);

export default AdminDashboard;
