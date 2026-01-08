# Teggar eWallet - Frontend

A modern, responsive web application for managing your personal finances built with React and Vite. This is the frontend implementation of Deji's wallet application based on the Figma prototype.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Dashboard**: View wallet balance, linked cards, and recent transactions
- **Statistics**: Income/Expense analysis with interactive charts
- **Card Management**: Add, view, and manage linked bank cards
- **QR Code Payments**: Send and receive money via QR codes
- **Profile Management**: View and manage user information
- **Responsive Design**: Optimized for both mobile and desktop viewing

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization for statistics
- **Lucide React** - Icon library
- **QRCode.react** - QR code generation
- **HTML5 QRCode** - QR code scanning

## Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm 9+
- Running Django backend server (see backend README)

## Installation

1. Navigate to the frontend directory:
```bash
cd teggar-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
The app is configured to connect to the backend at `http://127.0.0.1:8000/api` by default. If your backend is running on a different port, update the `API_BASE_URL` in `src/services/api.js`.

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (ProtectedRoute, etc.)
│   └── layout/          # Layout components (Navigation, etc.)
├── pages/
│   ├── Auth/           # Login and Register pages
│   ├── Dashboard/      # Home/Dashboard page
│   ├── Statistics/     # Statistics and analytics page
│   ├── MyCards/        # Card management page
│   ├── Profile/        # User profile page
│   └── Scan/           # QR scan page for send/receive money
├── context/
│   └── AuthContext.jsx # Authentication state management
├── services/
│   └── api.js          # API service layer with axios
├── App.jsx             # Main app component with routing
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Key Features

### Authentication
- JWT-based authentication with automatic token refresh
- Protected routes that redirect to login if not authenticated

### Dashboard
- Real-time wallet balance with hide/show toggle
- Primary card display
- Income and expense overview
- Recent transaction history

### Statistics
- Interactive bar charts showing income vs expense
- Configurable time periods (3, 6, or 12 months)
- Top spending categories
- Activity log

### QR Payments
- Generate QR codes to receive money
- Send money via email
- Scan QR codes to complete payments

## API Endpoints

The frontend communicates with these Django backend endpoints:

- Authentication: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`
- Wallet: `/api/wallet/wallet`, `/api/wallet/dashboard`, `/api/wallet/stats`
- Cards: `/api/wallet/cards`
- Transactions: `/api/wallet/transactions`, `/api/wallet/send-money`
- QR Codes: `/api/wallet/qr-codes/generate`, `/api/wallet/qr-codes/scan`

## Troubleshooting

### CORS Issues
Ensure the Django backend has the correct CORS configuration:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### QR Scanner Not Working
- Use HTTPS or localhost
- Grant camera permissions in browser

## License

This project is part of a technical assessment task.
