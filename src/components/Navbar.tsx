'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="bg-white border-b-2 border-slate-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center w-1/4">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-1">
                            <Image src="/images/grid.png" alt="Sudoku Solver" className="w-10 h-10" width={40} height={40} />
                            <span className="text-xl font-bold text-gray-900">Sudoku Solver</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
} 