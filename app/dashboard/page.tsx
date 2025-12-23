'use client';

import { useState } from 'react';
import InvoiceModal from '@/components/InvoiceModal';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'final-year' | 'industry' | null>(null);

  const handleCreateInvoice = (type: 'final-year' | 'industry') => {
    setInvoiceType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInvoiceType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            EXE.LK Invoice Generator
          </h1>
          <p className="text-gray-600">Make your idea executable.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div 
            onClick={() => handleCreateInvoice('final-year')}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Final Year Projects</h2>
              <p className="text-gray-600">Generate invoices for final year student projects</p>
            </div>
          </div>

          <div 
            onClick={() => handleCreateInvoice('industry')}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-500"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Industry Projects</h2>
              <p className="text-gray-600">Generate invoices for industry client projects</p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && invoiceType && (
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          invoiceType={invoiceType}
        />
      )}
    </div>
  );
}

