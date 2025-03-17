import './globals.css';
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
    title: 'Sudoku Solver',
    description: 'A simple Sudoku solver app',
    icons: {
        icon: '/images/grid.ico'
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="inter bg-gray-50">
                <Navbar />
                <main className="flex justify-center items-center p-2">
                    {children}
                </main>
            </body>
        </html>
    )
}