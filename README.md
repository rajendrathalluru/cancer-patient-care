# 🩺 CareCompanion - Cancer Patient Support App

A comprehensive web application designed to help cancer patients manage their treatment journey, track symptoms, medications, appointments, and connect with their care team.

![CareCompanion Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=CareCompanion+Dashboard)

## ✨ Features

###  **Dashboard Overview**
- Treatment progress tracking with visual indicators
- Medication adherence monitoring
- Upcoming appointments summary
- Symptom severity overview
- Quick access to all features

###  **Medication Management**
- Add and track medications with dosage and frequency
- Set medication reminders
- Mark medications as taken, missed, or pending
- View medication history and adherence statistics

###  **Appointment Scheduling**
- Interactive calendar view of appointments
- Schedule new appointments with healthcare providers
- Support for both virtual and in-person appointments
- Appointment reminders and notifications

### 🩺 **Symptom Tracking**
- Log symptoms with severity levels (mild, moderate, severe)
- Visual symptom trends and charts
- Track symptom patterns over time
- Export symptom reports for healthcare providers

###  **Personal Journal**
- Record daily thoughts and experiences
- Track emotional well-being
- Private and secure journal entries
- Search and filter journal entries

### **Care Team Management**
- Maintain contact information for healthcare providers
- Track different specialists and their roles
- Quick access to care team contacts

###  **Notification Settings**
- Customizable notification preferences
- Email, push, and SMS notification options
- Medication reminders
- Appointment alerts

###  **Educational Resources**
- Curated cancer treatment information
- Nutrition and wellness guides
- Support group connections
- Educational materials by category

##  Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/carecompanion.git
   cd carecompanion
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Edit `.env.local` with your configuration:
   \`\`\`env
   # Development
   NODE_ENV=development

   # Database Configuration (Optional - leave empty to use mock data)
   # DATABASE_URL=postgresql://username:password@host:port/database
   # POSTGRES_URL=postgresql://username:password@host:port/database
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

###  Demo Credentials

For testing purposes, use these pre-configured credentials:

- **Email:** `sarah.williams@example.com`
- **Password:** `password123`

##  Database Setup (Optional)

The application works with mock data by default, but you can connect a real database for persistent storage.

### Using Neon Database (Recommended)

1. **Create a Neon account** at [neon.tech](https://neon.tech)

2. **Create a new project** and database

3. **Get your connection string** from the Neon dashboard

4. **Update your `.env.local`** file:
   \`\`\`env
   DATABASE_URL=postgresql://username:password@host:port/database
   POSTGRES_URL=postgresql://username:password@host:port/database
   \`\`\`

5. **Run database migrations**
   
   The application will automatically create the necessary tables when you first run it with a valid database connection.

### Database Schema

The application uses the following tables:
- `users` - User profiles and authentication
- `medications` - Medication tracking
- `symptoms` - Symptom logs
- `appointments` - Appointment scheduling
- `journal_entries` - Personal journal entries
- `care_team` - Healthcare provider contacts
- `notification_settings` - User notification preferences

##  Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Neon Database** - Serverless PostgreSQL
- **Zod** - Schema validation
- **Cookie-based Authentication** - Secure session management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking



##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

##  Key Features Explained

### Authentication System
- Cookie-based session management
- Secure password handling
- Protected routes with middleware
- Automatic session validation

### Data Management
- Mock data for development
- Optional database integration
- Real-time data updates
- Optimistic UI updates

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Dark/light theme support
- Accessible design patterns

### Performance Optimizations
- Server-side rendering (SSR)
- Static generation where possible
- Optimized images and assets
- Efficient data fetching

##  Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Set environment variables** in Vercel dashboard:
   \`\`\`
   NODE_ENV=production
   DATABASE_URL=your_database_url
   \`\`\`

4. **Deploy**
   - Vercel will automatically build and deploy your application

### Other Deployment Options

- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Container-based deployment
- **Self-hosted** - Docker containerization available

## 🤝 Contributing

We welcome contributions to CareCompanion! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Follow accessibility guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** in this README
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

## 🙏 Acknowledgments

- **Cancer patients and caregivers** who inspired this project
- **Healthcare professionals** who provided valuable feedback
- **Open source community** for the amazing tools and libraries
- **Vercel** for hosting and deployment platform
- **Neon** for database infrastructure

---

**Made with ❤️ for cancer patients and their families**

*CareCompanion is not a substitute for professional medical advice. Always consult with healthcare providers for medical decisions.*
\`\`\`

```plaintext file=".env.local.example"
# Development Environment
NODE_ENV=development

# Database Configuration (Optional)
# Leave empty to use mock data for development
# Uncomment and fill in your database details for production

# Neon Database (Recommended)
# DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb
# POSTGRES_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb

# Alternative PostgreSQL Database
# DATABASE_URL=postgresql://username:password@localhost:5432/carecompanion
# POSTGRES_URL=postgresql://username:password@localhost:5432/carecompanion

# Application Settings
# NEXT_PUBLIC_APP_URL=http://localhost:3000
