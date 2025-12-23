'use client';

import { useState } from 'react';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

export interface PaymentRow {
  description: string;
  status: string;
  taxes: string;
  date: string;
  amount: string;
}

export interface InvoiceData {
  clientName: string;
  projectName: string;
  companyName: string;
  country: string;
  proposalNo: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  paymentRows: PaymentRow[];
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceType: 'final-year' | 'industry';
}

export default function InvoiceModal({ isOpen, onClose, invoiceType }: InvoiceModalProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    clientName: '',
    projectName: '',
    companyName: '',
    country: 'Sri Lanka',
    proposalNo: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    currency: 'LKR',
    paymentRows: [
      { description: '', status: '', taxes: '', date: '', amount: '' },
      { description: '', status: '', taxes: '', date: '', amount: '' },
      { description: '', status: '', taxes: '', date: '', amount: '' },
      { description: '', status: '', taxes: '', date: '', amount: '' },
      { description: '', status: '', taxes: '', date: '', amount: '' },
    ],
    subtotal: '',
    discount: '0',
    tax: '0',
    total: '',
  });

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentRowChange = (index: number, field: keyof PaymentRow, value: string) => {
    setInvoiceData(prev => {
      const newRows = [...prev.paymentRows];
      newRows[index] = { ...newRows[index], [field]: value };
      return { ...prev, paymentRows: newRows };
    });
  };

  const addPaymentRow = () => {
    setInvoiceData(prev => ({
      ...prev,
      paymentRows: [...prev.paymentRows, { description: '', status: '', taxes: '', date: '', amount: '' }],
    }));
  };

  const removePaymentRow = (index: number) => {
    setInvoiceData(prev => ({
      ...prev,
      paymentRows: prev.paymentRows.filter((_, i) => i !== index),
    }));
  };

  const handleGenerate = () => {
    generateInvoicePDF(invoiceData, invoiceType);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Create {invoiceType === 'final-year' ? 'Final Year' : 'Industry'} Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Client & Project Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                value={invoiceData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={invoiceData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={invoiceData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={invoiceData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proposal No</label>
              <input
                type="text"
                value={invoiceData.proposalNo}
                onChange={(e) => handleInputChange('proposalNo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
              <input
                type="text"
                value={invoiceData.invoiceNo}
                onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Payment Breakdown Table */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Payment Breakdown</h3>
              <button
                onClick={addPaymentRow}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                + Add Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-2 text-left text-sm font-medium">Description</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-sm font-medium">Status</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-sm font-medium">Taxes</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-sm font-medium">Date</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-sm font-medium">Amount (LKR)</th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.paymentRows.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => handlePaymentRowChange(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={row.status}
                          onChange={(e) => handlePaymentRowChange(index, 'status', e.target.value)}
                          className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={row.taxes}
                          onChange={(e) => handlePaymentRowChange(index, 'taxes', e.target.value)}
                          className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => handlePaymentRowChange(index, 'date', e.target.value)}
                          className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={row.amount}
                          onChange={(e) => handlePaymentRowChange(index, 'amount', e.target.value)}
                          className="w-full px-2 py-1 border-0 focus:ring-1 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <button
                          onClick={() => removePaymentRow(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal (LKR)</label>
              <input
                type="text"
                value={invoiceData.subtotal}
                onChange={(e) => handleInputChange('subtotal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total (LKR)</label>
              <input
                type="text"
                value={invoiceData.total}
                onChange={(e) => handleInputChange('total', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-md hover:from-blue-700 hover:to-green-700 font-medium"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

