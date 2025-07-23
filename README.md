# SecureSight CCTV Dashboard

A modern, responsive dashboard for monitoring and managing security camera incidents in real-time. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎥 Real-time incident monitoring
- 🚨 Multiple threat type detection (Gun, Face, Suspicious Activity)
- 📊 Interactive timeline view
- 🌓 Light/Dark mode support
- ⚡ Optimistic UI updates
- 🔄 Automatic refresh every 30 seconds
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with CSS Variables for theming

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- SQLite (or another database of your choice)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/securesight-cctv-dashboard.git
   cd securesight-cctv-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Project Structure

```
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                # Static files
│   └── images/            # Image assets
├── src/
│   ├── app/               # App router
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Main page
│   ├── components/        # Reusable components
│   │   ├── ui/            # UI components
│   │   ├── incident-list.tsx
│   │   └── incident-player.tsx
│   └── lib/               # Utility functions
└── styles/                # Global styles
```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_API_URL="/api"
```

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `prisma:generate` - Generate Prisma client
- `prisma:push` - Push schema to database
- `prisma:seed` - Seed the database with sample data

## Database Schema

The application uses the following data models:

### Camera
- `id` - Unique identifier
- `name` - Camera name
- `location` - Physical location
- `incidents` - Related incidents

### Incident
- `id` - Unique identifier
- `type` - Type of incident (e.g., "Gun Detected")
- `tsStart` - Timestamp when incident started
- `tsEnd` - Timestamp when incident ended
- `thumbnailUrl` - URL to incident thumbnail
- `resolved` - Whether the incident has been resolved
- `camera` - Related camera

## API Endpoints

- `GET /api/incidents?resolved=false` - Get incidents (filter by resolved status)
- `PATCH /api/incidents/:id/resolve` - Toggle incident resolution status

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fsecuresight-cctv-dashboard)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the project on Vercel
3. Set up environment variables
4. Deploy!

### Docker

```bash
docker build -t securesight-dashboard .
docker run -p 3000:3000 securesight-dashboard
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Prisma](https://www.prisma.io/) for the database toolkit
- [Lucide](https://lucide.dev/) for the beautiful icons
