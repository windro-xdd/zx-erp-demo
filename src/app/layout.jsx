import '../index.css';

export const metadata = {
    title: 'Zecurx ERP',
    description: 'Next-Gen Enterprise Resource Planning for Colleges',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
