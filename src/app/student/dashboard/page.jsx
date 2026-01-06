'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { User, Book, Clock, Award, CheckCircle2, Calendar, CreditCard, ClipboardList, Info } from 'lucide-react';
import styles from '../../../styles/Dashboard.module.css';
import Modal from '../../../components/shared/Modal';
import StudentAttendanceScanner from '../../../components/attendance/StudentAttendanceScanner';

const StudentDashboardContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'overview';
    const [activeTab, setActiveTab] = useState('overview');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempProfile, setTempProfile] = useState({ phone: '9876543210', address: 'Deralakatte, Mangalore' });

    // Fee State (removed hostel)
    const [fees, setFees] = useState([
        { id: 1, type: 'Tuition Fee - Sem 6', amount: '45,000', status: 'paid' },
        { id: 2, type: 'Lab Fee', amount: '8,000', status: 'pending' },
        { id: 3, type: 'Library Dues', amount: '150', status: 'pending' }
    ]);

    // Assignments
    const [assignments, setAssignments] = useState([
        { id: 1, course: 'CS301', title: 'Binary Tree Implementation', due: '2026-01-10', status: 'pending', submitted: false },
        { id: 2, course: 'CS302', title: 'ER Diagram Design', due: '2026-01-08', status: 'submitted', submitted: true },
        { id: 3, course: 'CS303', title: 'React Dashboard Project', due: '2026-01-15', status: 'pending', submitted: false },
        { id: 4, course: 'CS304', title: 'Process Scheduling Simulation', due: '2026-01-12', status: 'graded', submitted: true, grade: 'A-' },
    ]);

    // Library
    const [libraryBooks, setLibraryBooks] = useState([
        { id: 1, title: 'Introduction to Algorithms', author: 'Cormen et al.', issueDate: '2025-12-20', dueDate: '2026-01-20', status: 'issued' },
        { id: 2, title: 'Database System Concepts', author: 'Silberschatz', issueDate: '2025-12-15', dueDate: '2026-01-15', status: 'overdue' },
    ]);

    // Transcript
    const transcript = [
        { sem: 'Semester 1', sgpa: 3.6, credits: 20, year: '2023' },
        { sem: 'Semester 2', sgpa: 3.7, credits: 22, year: '2023' },
        { sem: 'Semester 3', sgpa: 3.8, credits: 21, year: '2024' },
        { sem: 'Semester 4', sgpa: 3.9, credits: 23, year: '2024' },
        { sem: 'Semester 5', sgpa: 3.85, credits: 22, year: '2025' },
    ];

    // Mentor/Adviser Info
    const mentor = {
        name: 'Dr. Sarah Smith',
        designation: 'Associate Professor',
        department: 'Computer Science',
        email: 'sarah.smith@zecurx.com',
        phone: '+91 9876543210',
        officeHours: 'Mon, Wed: 2-4 PM'
    };

    // Feedback form
    const [feedback, setFeedback] = useState({ course: '', rating: 5, comments: '' });
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    useEffect(() => {
        setActiveTab(view);
    }, [view]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'student') {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            const storedProfile = JSON.parse(localStorage.getItem('erp_student_profile') || '{}');

            setStudent({
                name: 'Alex Johnson',
                id: 'ZX2401',
                department: 'Computer Science',
                semester: '6th',
                attendance: 87,
                cgpa: 3.82,
                ...storedProfile,
                courses: [
                    { code: 'CS301', name: 'Data Structures', instructor: 'Dr. Sarah', grade: 'A', attendance: '92%' },
                    { code: 'CS302', name: 'Database Systems', instructor: 'Prof. Mark', grade: 'B+', attendance: '85%' },
                    { code: 'CS303', name: 'Web Engineering', instructor: 'Dr. John', grade: 'A-', attendance: '88%' },
                    { code: 'CS304', name: 'Operating Systems', instructor: 'Dr. Linda', grade: 'A', attendance: '90%' },
                ]
            });

            if (storedProfile.phone || storedProfile.address) {
                setTempProfile(prev => ({
                    ...prev,
                    phone: storedProfile.phone || prev.phone,
                    address: storedProfile.address || prev.address
                }));
            }

            setLoading(false);
        };
        fetchData();
    }, [router]);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const updatedProfile = { ...tempProfile };
        localStorage.setItem('erp_student_profile', JSON.stringify(updatedProfile));
        setStudent(prev => ({ ...prev, ...updatedProfile }));
        alert("Personal information updated successfully!");
        setIsModalOpen(false);
    };

    const handlePayment = (id) => {
        setFees(prev => prev.map(f => f.id === id ? { ...f, status: 'paid' } : f));
        alert("Payment simulated successfully!");
    };

    if (loading) return <div style={{ background: 'var(--bg-body)', minHeight: '100vh' }} />;

    return (
        <div className={styles.pageWrapper}>
            <Navbar />

            <main className={styles.main}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>Student Portal</h1>
                        <p className={styles.pageSubtitle}>Welcome back, {student.name}</p>
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <>
                        <div className={styles.statsGrid}>
                            <StatCard title="Registration ID" value={student.id} icon={User} type="blue" />
                            <StatCard title="Attendance Avg" value={`${student.attendance}%`} icon={Clock} type="green" />
                            <StatCard title="Current CGPA" value={student.cgpa} icon={Award} type="orange" />
                        </div>

                        {/* Attendance Scanner Widget */}
                        <div className="mb-8">
                            <StudentAttendanceScanner />
                        </div>

                        <div className={styles.contentSplit}>
                            <aside className={styles.contentCard}>
                                <h3 className={styles.cardTitle}>Academic Profile</h3>
                                <div className={styles.profileInfo}>
                                    <div className={styles.profileRow}>
                                        <span className={styles.profileLabel}>Department</span>
                                        <span className={styles.profileValue}>{student.department}</span>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span className={styles.profileLabel}>Semester</span>
                                        <span className={styles.profileValue}>{student.semester}</span>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span className={styles.profileLabel}>Academic Status</span>
                                        <span className={styles.activeStatus}>
                                            <CheckCircle2 size={14} /> Active
                                        </span>
                                    </div>

                                    <div className={styles.progressContainer}>
                                        <div className={styles.chartLabel}>
                                            <span>Credit Completion</span>
                                            <span>75%</span>
                                        </div>
                                        <div className={styles.barWrapper}>
                                            <div className={styles.barFill} style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={styles.btnOutline}
                                    style={{ marginTop: '2.5rem' }}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Update Profile Info
                                </button>

                                <div style={{ marginTop: '2rem' }}>
                                    <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Notice Board</h4>
                                    <div className={styles.noticeList}>
                                        <div className={styles.noticeItem}>
                                            <span className={styles.noticeTitle}>End Sem Project Submission</span>
                                            <span className={styles.noticeDate}>Due by Jan 15</span>
                                        </div>
                                        <div className={styles.noticeItem}>
                                            <span className={styles.noticeTitle}>Cultural Fest Registrations</span>
                                            <span className={styles.noticeDate}>Jan 10 - Jan 20</span>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            <div className={styles.contentCard}>
                                <h3 className={styles.cardTitle}>Current Enrollments</h3>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Course Module</th>
                                                <th>Instructor</th>
                                                <th>Attendance</th>
                                                <th style={{ textAlign: 'right' }}>Current Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.courses.map((course, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className={styles.courseDetail}>
                                                            <span className={styles.courseCodeMain}>{course.code}</span>
                                                            <span className={styles.courseNameSub}>{course.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className={styles.muted}>{course.instructor}</td>
                                                    <td>
                                                        <span className={`${styles.badge} ${styles['badge-student']}`}>
                                                            {course.attendance}
                                                        </span>
                                                    </td>
                                                    <td className={styles.gradeCell}>{course.grade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'schedule' && (
                    <div className={styles.contentCard}>
                        <h2 className={styles.cardTitle}>Weekly Class Schedule</h2>
                        <div className={styles.scheduleGrid}>
                            <div className={styles.timeHeader}>Time</div>
                            <div className={styles.timeHeader}>Mon</div>
                            <div className={styles.timeHeader}>Tue</div>
                            <div className={styles.timeHeader}>Wed</div>
                            <div className={styles.timeHeader}>Thu</div>
                            <div className={styles.timeHeader}>Fri</div>

                            <div className={styles.timeHeader}>09:00 AM</div>
                            <ScheduleCell name="DS" room="L-101" />
                            <ScheduleCell name="DBMS" room="L-204" />
                            <ScheduleCell name="DS" room="L-101" />
                            <ScheduleCell name="WEB" room="LAB-01" />
                            <ScheduleCell name="OS" room="L-103" />

                            <div className={styles.timeHeader}>11:00 AM</div>
                            <ScheduleCell name="OS" room="L-103" />
                            <ScheduleCell name="DS" room="L-101" />
                            <ScheduleCell name="OS" room="L-103" />
                            <ScheduleCell name="DBMS" room="L-204" />
                            <ScheduleCell name="WEB" room="LAB-01" />

                            <div className={styles.timeHeader}>02:00 PM</div>
                            <ScheduleCell name="WEB" room="LAB-01" />
                            <ScheduleCell name="OS" room="L-103" />
                            <ScheduleCell name="DBMS" room="L-204" />
                            <ScheduleCell name="DS" room="L-101" />
                            <ScheduleCell name="SEM" room="AUD-01" />
                        </div>
                    </div>
                )}

                {activeTab === 'fees' && (
                    <div className={styles.contentCard}>
                        <h2 className={styles.cardTitle}>Fee Management Portal</h2>
                        <div className={styles.feeGrid}>
                            {fees.map(fee => (
                                <div key={fee.id} className={styles.feeCard}>
                                    <div className={styles.feeHeader}>
                                        <span className={styles.feeType}>{fee.type}</span>
                                        <span className={`${styles.feeStatus} ${styles[fee.status]}`}>
                                            {fee.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className={styles.feeAmount}>₹ {fee.amount}</p>
                                    {fee.status === 'pending' && (
                                        <button
                                            className={styles.btnPrimary}
                                            style={{ width: '100%', marginTop: '1rem' }}
                                            onClick={() => handlePayment(fee.id)}
                                        >
                                            Pay Securely
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Assignments Tab */}
                {activeTab === 'assignments' && (
                    <div className={styles.contentCard}>
                        <h2 className={styles.cardTitle}>My Assignments</h2>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Assignment</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(a => (
                                        <tr key={a.id}>
                                            <td className={styles.muted}>{a.course}</td>
                                            <td className={styles.bold}>{a.title}</td>
                                            <td>{a.due}</td>
                                            <td>
                                                <span className={`${styles.badge}`} style={{
                                                    background: a.status === 'graded' ? 'rgba(46, 125, 50, 0.1)' :
                                                        a.status === 'submitted' ? 'rgba(59, 130, 246, 0.1)' :
                                                            'rgba(201, 162, 39, 0.1)',
                                                    color: a.status === 'graded' ? 'var(--yen-green)' :
                                                        a.status === 'submitted' ? 'var(--yen-blue)' :
                                                            'var(--yen-gold)'
                                                }}>
                                                    {a.status === 'graded' ? `Graded: ${a.grade}` : a.status}
                                                </span>
                                            </td>
                                            <td>
                                                {!a.submitted ? (
                                                    <button
                                                        className={styles.btnOutline}
                                                        onClick={() => {
                                                            setAssignments(prev => prev.map(item =>
                                                                item.id === a.id ? { ...item, submitted: true, status: 'submitted' } : item
                                                            ));
                                                            alert('Assignment submitted!');
                                                        }}
                                                    >
                                                        Submit
                                                    </button>
                                                ) : (
                                                    <span className={styles.muted}>Submitted</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Library Tab */}
                {activeTab === 'library' && (
                    <div className={styles.contentCard}>
                        <h2 className={styles.cardTitle}>Library Status</h2>
                        <div className={styles.statsGrid} style={{ marginBottom: 'var(--space-6)' }}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--yen-blue)' }}>
                                    <Book size={24} />
                                </div>
                                <div>
                                    <p className={styles.statLabel}>Books Issued</p>
                                    <p className={styles.statValue}>{libraryBooks.length}</p>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}>
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className={styles.statLabel}>Overdue</p>
                                    <p className={styles.statValue}>{libraryBooks.filter(b => b.status === 'overdue').length}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Book Title</th>
                                        <th>Author</th>
                                        <th>Issue Date</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {libraryBooks.map(book => (
                                        <tr key={book.id}>
                                            <td className={styles.bold}>{book.title}</td>
                                            <td className={styles.muted}>{book.author}</td>
                                            <td>{book.issueDate}</td>
                                            <td>{book.dueDate}</td>
                                            <td>
                                                <span className={`${styles.badge}`} style={{
                                                    background: book.status === 'issued' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                                    color: book.status === 'issued' ? 'var(--yen-green)' : '#DC2626'
                                                }}>
                                                    {book.status === 'issued' ? 'Issued' : 'Overdue'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mentor Info */}
                        <div style={{ marginTop: 'var(--space-8)' }}>
                            <h3 className={styles.cardTitle}>Class Adviser / Mentor</h3>
                            <div className={styles.contentCard} style={{ background: 'var(--bg-tertiary)', marginTop: 'var(--space-4)' }}>
                                <div className={styles.profileInfo}>
                                    <div className={styles.profileRow}>
                                        <span className={styles.profileLabel}>Name</span>
                                        <span className={styles.profileValue}>{mentor.name}</span>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span className={styles.profileLabel}>Designation</span>
                                        <span className={styles.profileValue}>{mentor.designation}</span>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span className={styles.profileLabel}>Email</span>
                                        <span className={styles.profileValue}>{mentor.email}</span>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span className={styles.profileLabel}>Office Hours</span>
                                        <span className={styles.profileValue}>{mentor.officeHours}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transcript Preview */}
                        <div style={{ marginTop: 'var(--space-8)' }}>
                            <h3 className={styles.cardTitle}>Academic Transcript</h3>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Semester</th>
                                            <th>Year</th>
                                            <th>Credits</th>
                                            <th>SGPA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transcript.map((t, i) => (
                                            <tr key={i}>
                                                <td className={styles.bold}>{t.sem}</td>
                                                <td>{t.year}</td>
                                                <td>{t.credits}</td>
                                                <td>
                                                    <span style={{ fontWeight: 600, color: t.sgpa >= 3.5 ? 'var(--yen-green)' : 'var(--text-primary)' }}>
                                                        {t.sgpa.toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 'var(--space-4)' }}>
                                <strong>Current CGPA:</strong> {student.cgpa} | <strong>Total Credits:</strong> 108
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Update Personal Info"
            >
                <form onSubmit={handleProfileUpdate} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Contact Number</label>
                        <input
                            value={tempProfile.phone}
                            onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Residential Address</label>
                        <input
                            value={tempProfile.address}
                            onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setIsModalOpen(false)} className={styles.btnSecondary}>Cancel</button>
                        <button type="submit" className={styles.btnPrimary}>Submit Request</button>
                    </div>
                </form>
            </Modal>

            <Footer />
        </div>
    );
};

const ScheduleCell = ({ name, room }) => (
    <div className={styles.dayCell}>
        <div className={styles.classBlock}>
            <div className={styles.className}>{name}</div>
            <div className={styles.classRoom}>{room}</div>
        </div>
    </div>
);

const StatCard = ({ title, value, icon: Icon, type }) => {
    const iconColors = {
        blue: { bg: 'rgba(67, 94, 190, 0.1)', text: '#435EBE' },
        green: { bg: 'rgba(152, 189, 32, 0.1)', text: '#98BD20' },
        orange: { bg: 'rgba(249, 115, 22, 0.1)', text: '#EA580C' }
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

const StudentDashboard = () => (
    <Suspense fallback={<div className={styles.pageWrapper}><div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} /></div>}>
        <StudentDashboardContent />
    </Suspense>
);

export default StudentDashboard;
