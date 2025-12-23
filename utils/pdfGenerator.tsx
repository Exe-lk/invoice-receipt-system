'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from '@/components/InvoiceModal';

export function generateInvoicePDF(data: InvoiceData, invoiceType: 'final-year' | 'industry') {
  // Create a temporary container for the invoice
  const invoiceContainer = document.createElement('div');
  invoiceContainer.style.position = 'absolute';
  invoiceContainer.style.left = '-9999px';
  invoiceContainer.style.width = '210mm'; // A4 width
  invoiceContainer.style.padding = '20mm';
  invoiceContainer.style.fontFamily = 'Arial, sans-serif';
  invoiceContainer.style.backgroundColor = '#ffffff';
  invoiceContainer.innerHTML = generateInvoiceHTML(data);
  
  document.body.appendChild(invoiceContainer);

  // Wait for images to load
  setTimeout(() => {
    html2canvas(invoiceContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${data.invoiceNo || 'INVOICE'}.pdf`);
      document.body.removeChild(invoiceContainer);
    });
  }, 500);
}

function generateInvoiceHTML(data: InvoiceData): string {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount: string) => {
    if (!amount || amount === '') return '0.00';
    const num = parseFloat(amount);
    if (isNaN(num)) return '0.00';
    // Format with spaces as thousand separators (e.g., "20 000.00")
    const parts = num.toFixed(2).split('.');
    const integerPart = parts[0];
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedInteger}.${parts[1]}`;
  };

  return `
    <div style="position: relative; width: 100%; background: white; padding: 20px; font-family: Arial, sans-serif;">
      <!-- Watermark -->
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.05; font-size: 120px; font-weight: bold; color: #2563eb; z-index: 0;">
        EXE.LK
      </div>

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; position: relative; z-index: 1;">
        <div>
          <div style="font-size: 36px; font-weight: bold; background: linear-gradient(to right, #2563eb, #16a34a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 5px;">
            EXE.LK
          </div>
          <div style="color: #6b7280; font-size: 14px; margin-top: 5px;">Make your idea executable.</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #374151;">
          <div style="margin-bottom: 5px;">🌐 www.exe.lk</div>
          <div style="margin-bottom: 5px;">✉️ hello@exe.lk</div>
          <div>📞 +94 70 274 9876 / +94 76 682 8306</div>
        </div>
      </div>

      <!-- Title -->
      <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 30px; position: relative; z-index: 1;">
        PAYMENT INVOICE
      </div>

      <!-- Client & Invoice Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; position: relative; z-index: 1;">
        <div>
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Client Name:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${data.clientName || '________________'}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Project Name:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${data.projectName || '________________'}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Company Name:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${data.companyName || '________________'}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Country:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${data.country || 'Sri Lanka'}</div>
          </div>
          <div>
            <div style="font-weight: bold; margin-bottom: 5px;">Proposal No:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${data.proposalNo || '________________'}</div>
          </div>
        </div>
        <div>
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Cost Estimation:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${data.proposalNo || '________________'}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Invoice No:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${data.invoiceNo || '________________'}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Invoice Date:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${formatDate(data.invoiceDate)}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Due Date:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${formatDate(data.dueDate)}</div>
          </div>
          <div>
            <div style="font-weight: bold; margin-bottom: 5px;">Currency:</div>
            <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 5px;">${data.currency || 'LKR'}</div>
          </div>
        </div>
      </div>

      <!-- Payment Breakdown Table -->
      <div style="margin-bottom: 30px; position: relative; z-index: 1;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left; font-weight: bold;">Description</th>
              <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left; font-weight: bold;">Status</th>
              <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left; font-weight: bold;">Taxes</th>
              <th style="border: 1px solid #d1d5db; padding: 10px; text-align: left; font-weight: bold;">Date</th>
              <th style="border: 1px solid #d1d5db; padding: 10px; text-align: right; font-weight: bold;">Amount (LKR)</th>
            </tr>
          </thead>
          <tbody>
            ${data.paymentRows.map(row => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${row.description || ''}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${row.status || ''}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${row.taxes || ''}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${formatDate(row.date)}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px; text-align: right;">${formatCurrency(row.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Bank Details and Summary -->
      <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; margin-bottom: 30px; position: relative; z-index: 1;">
        <div>
          <div style="font-weight: bold; margin-bottom: 15px; font-size: 16px;">Bank Details</div>
          <div style="font-size: 13px; line-height: 1.8; color: #374151;">
            <div><strong>Account No:</strong> 1000661376</div>
            <div><strong>Name:</strong> EXE.LK (PVT) LTD</div>
            <div><strong>Swift Code:</strong> CCEYLKLX</div>
            <div><strong>Bank:</strong> Commercial Bank</div>
            <div><strong>Branch Name:</strong> Homagama</div>
            <div><strong>Address:</strong> 289/9A, 5th Lane, Kulasiri Kumarage Mawatha, Katuwana, Homagama.</div>
            <div><strong>Country:</strong> Sri Lanka</div>
          </div>
        </div>
        <div>
          <div style="font-weight: bold; margin-bottom: 15px; font-size: 16px;">Current Payment</div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; margin-bottom: 15px;">
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">SUBTOTAL (LKR)</td>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">${formatCurrency(data.subtotal)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">DISCOUNT (LKR)</td>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">${formatCurrency(data.discount || '0')}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">TAX (LKR)</td>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">${formatCurrency(data.tax || '0')}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">TOTAL (LKR)</td>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right; font-weight: bold;">${formatCurrency(data.total)}</td>
            </tr>
          </table>
          <div style="font-size: 18px; color: #2563eb; font-weight: bold; margin-top: 15px;">
            This invoice is payment for <strong>${formatCurrency(data.total)} LKR</strong>
          </div>
        </div>
      </div>

      <!-- Comments -->
      <div style="margin-top: 30px; position: relative; z-index: 1;">
        <div style="font-weight: bold; margin-bottom: 10px;">Comments or Special Instructions:</div>
        <div style="font-size: 12px; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 10px;">
            <strong>Important:</strong> Please do not forget to mention your Invoice number as the reference when you are depositing at the bank counter or the deposit machine since your payment is traced via the invoice number. Further, you are requested to email us a copy of the deposit slip or the screenshot of the online transfer / CEFT Transfer to finance@exe.lk on the payment date itself. (Please mention the Invoice Number In the Description).
          </div>
          <div>To avoid extending the upcoming projects duration, please pay before the due date.</div>
        </div>
      </div>
    </div>
  `;
}

