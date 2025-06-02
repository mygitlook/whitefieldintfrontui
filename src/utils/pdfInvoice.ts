
// PDF Invoice generation utility
export const generatePDFInvoice = (billMonth: string, amount: number) => {
  // Create PDF content using HTML and CSS (simple PDF generation)
  const invoiceContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Zeltra Connect Invoice - ${billMonth}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
    .company-info { font-size: 14px; color: #666; }
    .invoice-details { margin-bottom: 30px; }
    .invoice-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
    .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .bill-to { margin-bottom: 30px; }
    .services-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .services-table th, .services-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .services-table th { background-color: #f8f9fa; font-weight: bold; }
    .total-section { text-align: right; font-size: 18px; font-weight: bold; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Zeltra Connect</div>
    <div class="company-info">
      Cloud Services Provider<br>
      123 Cloud Street, London, UK<br>
      VAT: GB123456789<br>
      support@zeltraconnect.com
    </div>
  </div>

  <div class="invoice-details">
    <div class="invoice-title">INVOICE</div>
    <div class="invoice-meta">
      <div>
        <strong>Invoice Number:</strong> ZC-${Date.now()}<br>
        <strong>Invoice Date:</strong> ${new Date().toLocaleDateString('en-GB')}<br>
        <strong>Due Date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
      </div>
      <div>
        <strong>Billing Period:</strong> ${billMonth}
      </div>
    </div>
  </div>

  <div class="bill-to">
    <strong>Bill To:</strong><br>
    John Paul<br>
    Customer Account: john_paul<br>
    Zeltra Connect Services
  </div>

  <table class="services-table">
    <thead>
      <tr>
        <th>Service Description</th>
        <th>Quantity</th>
        <th>Unit Price (£)</th>
        <th>Total (£)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Virtual Machines (4 vCPUs, 16 GB RAM)</td>
        <td>29</td>
        <td>70.10</td>
        <td>2,032.90</td>
      </tr>
      <tr>
        <td>Object Storage (per TB)</td>
        <td>13</td>
        <td>10.00</td>
        <td>130.00</td>
      </tr>
      <tr>
        <td>Archive Storage (per TB)</td>
        <td>30</td>
        <td>3.01</td>
        <td>90.40</td>
      </tr>
      <tr>
        <td>Content Delivery Network Data Transfer (per TB)</td>
        <td>17</td>
        <td>15.00</td>
        <td>255.00</td>
      </tr>
      <tr>
        <td>Web Application Firewall Instances</td>
        <td>41</td>
        <td>80.00</td>
        <td>3,280.00</td>
      </tr>
      <tr>
        <td>Machine Learning Model Training Instances</td>
        <td>4</td>
        <td>2,500.00</td>
        <td>10,000.00</td>
      </tr>
      <tr>
        <td>Premium Support Plan</td>
        <td>2</td>
        <td>3,500.00</td>
        <td>7,000.00</td>
      </tr>
      <tr>
        <td>Additional Virtual Machines (4 vCPUs, 16 GB)</td>
        <td>8</td>
        <td>70.00</td>
        <td>560.00</td>
      </tr>
      <tr>
        <td>Data Transfer Outbound (per TB)</td>
        <td>16</td>
        <td>0.06</td>
        <td>0.96</td>
      </tr>
      <tr>
        <td>Backup Storage (per TB)</td>
        <td>45</td>
        <td>8.00</td>
        <td>360.00</td>
      </tr>
      <tr>
        <td>Monitoring and Logging Instances</td>
        <td>39</td>
        <td>40.20</td>
        <td>1,567.74</td>
      </tr>
    </tbody>
  </table>

  <div class="total-section">
    <div>Subtotal: £${amount.toLocaleString()}</div>
    <div>VAT (20%): £${(amount * 0.2).toLocaleString()}</div>
    <div style="border-top: 2px solid #333; padding-top: 10px; margin-top: 10px;">
      Total Amount: £${(amount * 1.2).toLocaleString()}
    </div>
  </div>

  <div class="footer">
    <p><strong>Payment Terms:</strong> Payment is due within 30 days of invoice date.</p>
    <p><strong>Thank you for using Zeltra Connect services!</strong></p>
    <p>For support inquiries, please contact: support@zeltraconnect.com | +44 20 1234 5678</p>
  </div>
</body>
</html>
  `;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }
};
