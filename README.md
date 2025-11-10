# Synthetic - AI-Powered Sentiment Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

A modern web application for collecting and analyzing user feedback with real-time sentiment visualization. Built with React, TypeScript, and Supabase, this application provides powerful insights through AI-powered sentiment analysis and interactive dashboards.

## 🎯 Key Features

### For Users
- **Smart Feedback Collection**: Intuitive form for submitting feedback
- **Real-time Sentiment Analysis**: Instant AI-powered sentiment detection (positive, negative, neutral)
- **Personal Dashboard**: View personal feedback history and statistics
- **Anonymous Submission**: Option to submit feedback without registration

### For Admins
- **Comprehensive Dashboard**: Real-time analytics with interactive charts
- **Feedback Management**: View, analyze, and manage all user feedback
- **User Insights**: Monitor sentiment trends and feedback categories
- **Role-based Access**: Secure admin panel with appropriate permissions

### Technical Features
- **Real-time Updates**: Live chart updates when new feedback is submitted
- **Responsive Design**: Works seamlessly across all devices
- **Secure Authentication**: Email/password authentication with role management
- **Data Visualization**: Interactive charts for sentiment and category analysis

## 🌟 Features

- **Smart Feedback Collection**: Users can submit feedback through an intuitive form
- **Real-time Sentiment Analysis**: Instant AI-powered sentiment detection (positive, negative, neutral)
- **Interactive Dashboard**: Visualize feedback trends with dynamic charts
- **Role-based Access**: Separate user and admin panels with appropriate permissions
- **Real-time Updates**: Live chart updates when new feedback is submitted
- **Responsive Design**: Works seamlessly across all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Project Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend│────│  Supabase Backend│────│  Database Layer  │
│   (Vite + TS)   │    │ (Auth + Storage) │    │ (PostgreSQL)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   User Browser  │    │ Admin Dashboard  │
└─────────────────┘    └──────────────────┘
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd synthetic-sentiment-analysis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project at https://supabase.com
   - In the Supabase SQL Editor, run the database schema from `supabase-schema.sql`
   - Configure authentication settings in Supabase Dashboard

5. **Create an admin user**
   - Register a user through the application
   - Run the SQL from `quick-admin-setup.sql` to grant admin privileges

6. **Start the development server**
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ Yes |

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   │   ├── CategoryChart.tsx
│   │   ├── StatsCards.tsx
│   │   └── UsersTable.tsx
│   ├── ui/             # Reusable UI components
│   ├── user/           # User-specific components
│   │   ├── UserFeedbackTable.tsx
│   │   └── UserStats.tsx
│   ├── AnimatedText.tsx
│   ├── FeedbackForm.tsx
│   └── SentimentChart.tsx
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Page components (routes)
│   ├── Admin.tsx
│   ├── AdminLogin.tsx
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   └── Register.tsx
└── App.tsx             # Main application component
```

## 🛠️ Supabase Setup

### Database Schema

The application uses three main tables:

1. **`profiles`**: Stores user profile information
   - Linked to Supabase Auth users
   - Contains email and display name

2. **`user_roles`**: Manages role-based access control
   - Supports 'admin' and 'user' roles
   - Used for dashboard access control

3. **`feedback`**: Stores feedback submissions
   - Contains message, sentiment, and category
   - Tracks anonymous vs authenticated submissions

### Security Features

- **Row Level Security (RLS)**: Policies control data access
- **Role-based Access**: Different permissions for users and admins
- **Authentication**: Secure email/password authentication

### Realtime Functionality

- **Live Updates**: Charts update in real-time
- **WebSocket Connections**: Efficient data streaming
- **Automatic Broadcasting**: New feedback appears instantly

## 🔐 User Roles

### Regular Users
- Submit feedback (authenticated or anonymous)
- View personal feedback history
- See basic sentiment statistics
- Access personal dashboard

### Admin Users
- Access comprehensive analytics dashboard
- View all user feedback submissions
- Monitor real-time sentiment trends
- Manage feedback content
- See detailed user statistics

### Role Management
To make a user an admin:
1. Register the user through the application
2. Run the SQL query from `quick-admin-setup.sql`
3. The user can now access the admin dashboard

## 📊 Analytics & Visualization

### Chart Types

- **Sentiment Distribution**: Pie chart showing positive/neutral/negative feedback ratios
- **Category Analysis**: Bar chart displaying feedback by category
- **User Statistics**: Cards showing total feedback count, average sentiment score
- **Real-time Updates**: Charts update automatically when new feedback is submitted

### Data Processing

- **Keyword Analysis**: Automatic sentiment detection based on keywords
- **Score Calculation**: Numerical sentiment scores (-1 to 1)
- **Category Classification**: Automatic categorization of feedback
- **Trend Analysis**: Historical data visualization

## 🎨 UI Components

Built with shadcn/ui components and Tailwind CSS for a modern, responsive design:

### Component Libraries
- **shadcn/ui**: Pre-built accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization library
- **Lucide React**: Icon library

### Key Components
- Interactive forms with validation
- Beautiful data visualization charts
- Responsive tables for feedback display
- Animated transitions and loading states
- Mobile-first responsive design

## 📱 Pages

### Public Pages
- **Home**: Landing page with anonymous feedback option
- **Login/Register**: Authentication pages

### User Pages
- **User Dashboard**: Personal feedback management
- **Feedback Submission**: Form for submitting new feedback
- **Feedback History**: View past submissions

### Admin Pages
- **Admin Login**: Dedicated admin authentication
- **Admin Dashboard**: Analytics and feedback management
- **User Management**: View all registered users
- **Feedback Management**: Review and manage all feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

### Development Guidelines

- Follow existing code style and patterns
- Write clear commit messages
- Test changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Sathya Teja

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👤 Author

**Sathya Teja** - Synthetic AI-Powered Sentiment Analysis

- GitHub: [@SathyaTeja8](https://github.com/SathyaTeja8)
- Email: [ganntejas26@gmail.com](mailto:ganntejas26@gmail.com)

## 🙏 Acknowledgments

### Technologies Used

- **[React](https://reactjs.org/)** - Frontend library
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Supabase](https://supabase.io/)** - Backend-as-a-Service
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework
- **[Chart.js](https://www.chartjs.org/)** - Data visualization
- **[Lucide React](https://lucide.dev/)** - Icon library

### Special Thanks

- Open source community for amazing tools
- Supabase team for excellent documentation
- shadcn for beautiful UI components