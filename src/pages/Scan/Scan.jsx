import { useState, useEffect } from 'react';
import { qrAPI, transactionAPI } from '../../services/api';
import { ArrowLeft, QrCode, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './Scan.css';

const Scan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('receive');
  const [qrCodeData, setQrCodeData] = useState(null);
  const [generateForm, setGenerateForm] = useState({
    amount: '',
    description: '',
    expires_in_hours: 24,
  });
  const [sendForm, setSendForm] = useState({
    recipient_email: '',
    amount: '',
    description: '',
    category: '',
  });
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'scan') {
      initializeScanner();
    }

    return () => {
      // Cleanup scanner
      const scanner = document.getElementById('qr-scanner');
      if (scanner) {
        scanner.innerHTML = '';
      }
    };
  }, [activeTab]);

  const initializeScanner = () => {
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner('qr-scanner', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(
        (decodedText) => {
          setScannedData(decodedText);
          scanner.clear();
        },
        (error) => {
          // Handle scan errors silently
        }
      );
    }, 100);
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        description: generateForm.description,
        expires_in_hours: parseInt(generateForm.expires_in_hours),
      };

      if (generateForm.amount) {
        data.amount = parseFloat(generateForm.amount);
      }

      const response = await qrAPI.generateQRCode(data);
      setQrCodeData(response.data);
      setSuccess('QR Code generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        recipient_email: sendForm.recipient_email,
        amount: parseFloat(sendForm.amount),
        description: sendForm.description,
      };

      if (sendForm.category) {
        data.category = sendForm.category;
      }

      await transactionAPI.sendMoney(data);
      setSuccess('Money sent successfully!');
      setSendForm({
        recipient_email: '',
        amount: '',
        description: '',
        category: '',
      });
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to send money');
    } finally {
      setLoading(false);
    }
  };

  const handleScanAndPay = async () => {
    if (!scannedData) return;

    setLoading(true);
    setError('');

    try {
      // Parse scanned QR code (format: "email:uuid" or just "email")
      let qrCode = scannedData;
      let amount = null;

      // If it includes amount, parse it
      if (scannedData.includes('|')) {
        const parts = scannedData.split('|');
        qrCode = parts[0];
        amount = parseFloat(parts[1]);
      }

      const response = await qrAPI.scanQRCode({
        qr_code: qrCode,
        amount: amount,
      });

      setSuccess('Payment successful!');
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-container">
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2>Scan</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'receive' ? 'active' : ''}`}
          onClick={() => setActiveTab('receive')}
        >
          Receive Money
        </button>
        <button
          className={`tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          Send Money
        </button>
        <button
          className={`tab ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveTab('scan')}
        >
          Scan QR
        </button>
      </div>

      {activeTab === 'receive' && (
        <div className="tab-content">
          <div className="info-box">
            <QrCode size={24} />
            <p>Generate a QR code for others to scan and send you money</p>
          </div>

          <form onSubmit={handleGenerateQR}>
            <div className="input-group">
              <label>Amount (Optional)</label>
              <input
                type="number"
                step="0.01"
                value={generateForm.amount}
                onChange={(e) =>
                  setGenerateForm({ ...generateForm, amount: e.target.value })
                }
                placeholder="Leave empty for flexible amount"
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                value={generateForm.description}
                onChange={(e) =>
                  setGenerateForm({ ...generateForm, description: e.target.value })
                }
                placeholder="What's this for?"
                required
              />
            </div>

            <div className="input-group">
              <label>Expires In (hours)</label>
              <select
                value={generateForm.expires_in_hours}
                onChange={(e) =>
                  setGenerateForm({
                    ...generateForm,
                    expires_in_hours: e.target.value,
                  })
                }
              >
                <option value={1}>1 Hour</option>
                <option value={6}>6 Hours</option>
                <option value={24}>24 Hours</option>
                <option value={168}>7 Days</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </form>

          {qrCodeData && (
            <div className="qr-result">
              <h3>Your QR Code</h3>
              <div className="qr-display">
                <img
                  src={`data:image/png;base64,${qrCodeData.qr_code_image}`}
                  alt="QR Code"
                  style={{ width: '250px', height: '250px' }}
                />
              </div>
              <p className="qr-info">
                {qrCodeData.amount
                  ? `Amount: ₦${qrCodeData.amount}`
                  : 'Flexible amount'}
              </p>
              <p className="qr-info">{qrCodeData.description}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'send' && (
        <div className="tab-content">
          <div className="info-box">
            <Send size={24} />
            <p>Send money to another Teggar user via email</p>
          </div>

          <form onSubmit={handleSendMoney}>
            <div className="input-group">
              <label>Recipient Email</label>
              <input
                type="email"
                value={sendForm.recipient_email}
                onChange={(e) =>
                  setSendForm({ ...sendForm, recipient_email: e.target.value })
                }
                placeholder="recipient@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                value={sendForm.amount}
                onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                value={sendForm.description}
                onChange={(e) =>
                  setSendForm({ ...sendForm, description: e.target.value })
                }
                placeholder="What's this for?"
                required
              />
            </div>

            <div className="input-group">
              <label>Category (Optional)</label>
              <input
                type="text"
                value={sendForm.category}
                onChange={(e) => setSendForm({ ...sendForm, category: e.target.value })}
                placeholder="e.g., Food, Transport, Entertainment"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending...' : 'Send Money'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'scan' && (
        <div className="tab-content">
          <div className="info-box">
            <QrCode size={24} />
            <p>Scan a QR code to send money</p>
          </div>

          <div id="qr-scanner"></div>

          {scannedData && (
            <div className="scanned-result">
              <h3>QR Code Scanned!</h3>
              <p>Data: {scannedData}</p>
              <button
                className="btn btn-primary btn-block"
                onClick={handleScanAndPay}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Payment'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scan;
