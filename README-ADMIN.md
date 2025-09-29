# Admin Panel - NestJS Template

## Congratulations! 

You now have a **super admin area** built with **Refine** that connects seamlessly to your NestJS backend! 

## Quick Start

Both servers are now running:

- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API Documentation**: http://localhost:3000/docs

### Login Credentials
To test the admin panel, you'll need to create an admin user in your database first. Use the backend API or create directly via database:

```bash
# Example user creation via API
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

## Features Implemented

### Complete Admin Interface
- **User Management** - Full CRUD operations with role assignment
- **Role & Permission Management** - Dynamic permission system
- **Health Monitoring** - Real-time system health checks

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────┐
│   Admin Panel   │────▶ │   NestJS API    │
│   (React/Vite)  │      │   (Backend)     │
│   Port: 3001    │      │   Port: 3000    │
└─────────────────┘      └─────────────────┘
         │                         │
         │                         │
         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐
│     Refine      │      │   PostgreSQL    │
│   Framework     │      │   Database      │
└─────────────────┘      └─────────────────┘
```

### Technology Stack

**Frontend (Admin Panel)**:
- **Refine** - Admin panel framework
- **Ant Design** - UI component library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool

**Backend (NestJS)**:
- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **JWT** - Authentication
- **Class Validator** - Input validation
- **Swagger** - API documentation

## 📁 Project Structure

```
├── admin/                    # Admin panel (Refine)
│   ├── src/
│   │   ├── providers/        # Auth & Data providers
│   │   ├── pages/           # Admin pages
│   │   │   ├── users/       # User management
│   │   │   ├── roles/       # Role management
│   │   │   ├── files/       # File management
│   │   │   ├── dashboard/   # Dashboard
│   │   │   ├── health/      # Health monitoring
│   │   │   ├── settings/    # Settings panel
│   │   │   └── auth/        # Auth pages (2FA, etc.)
│   │   └── App.tsx          # Main application
│   └── package.json
├── src/                     # Backend (NestJS)
│   ├── application/         # Application layer
│   ├── core/               # Domain layer
│   ├── infrastructure/     # Infrastructure layer
│   └── presentation/       # Presentation layer
└── README-ADMIN.md         # This file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
```

**Admin Panel (admin/.env)**:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Admin Panel
```

### API Proxy Configuration

The admin panel is configured to proxy API requests to the backend:
- Frontend requests to `/api/*` are automatically proxied to `http://localhost:3000`
- No CORS configuration needed for development

## 🔐 Security Features

### JWT Token Management
- Automatic token refresh on expiration
- Secure token storage in localStorage
- Automatic logout on token invalidation

### Permission System
- Role-based access control
- Dynamic permission checking
- UI components hide/show based on permissions

### 2FA Integration
- QR code generation for authenticator apps
- TOTP verification flow
- Backup codes (can be implemented)

## 🔍 Search & Filtering Features

### User Search
The admin panel includes comprehensive search functionality for user management:

**Frontend Features:**
- **Real-time search** - Filter users as you type in the email column
- **Filter dropdown** - Dedicated search interface in the email column header
- **Search icon indicators** - Visual cues for searchable columns
- **Responsive results** - Instant filtering without page refresh

**Backend Implementation:**
- **Case-insensitive search** - Finds results regardless of case
- **Multi-field search** - Searches across email, firstName, and lastName
- **Pagination support** - Search results are properly paginated
- **Performance optimized** - Uses database-level filtering for efficiency

**Usage:**
1. Navigate to the Users page in the admin panel
2. Click the filter icon (🔍) in the Email column header
3. Type your search term to filter users in real-time
4. Results automatically update with matching users

**API Example:**
```bash
GET /api/admin/users?search=john&page=1&limit=20
```

## 📊 Dashboard Features

### System Metrics
- Total users, active users, roles count
- File storage usage and statistics
- User growth charts (last 30 days)
- Role distribution pie chart

### Health Monitoring
- Database connection status
- Storage service health
- Cache status
- API response times
- System uptime

## 🛠️ Development

### Running the Application

1. **Start Backend**:
```bash
npm run start:dev
```

2. **Start Admin Panel**:
```bash
cd admin
npm run dev
```

### Building for Production

**Backend**:
```bash
npm run build
npm run start:prod
```

**Admin Panel**:
```bash
cd admin
npm run build
npm run preview
```

## 🔄 API Integration

The admin panel integrates with all your backend endpoints:

### User Management
- `GET /api/admin/users` - List users with pagination and search
  - Query parameters: `search`, `page`, `limit`
  - Search supports: email, firstName, lastName (case-insensitive)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/activate` - Activate/deactivate user

### Role Management
- `GET /api/roles` - List roles
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `GET /api/roles/permissions` - Get available permissions

### File Management
- `GET /api/storage/user/files` - List user files
- `GET /api/storage/:id` - Get file details
- `DELETE /api/storage/:id` - Delete file

### Health Monitoring
- `GET /api/health` - Overall health status
- `GET /api/health/database` - Database health
- `GET /api/health/readiness` - Readiness check
- `GET /api/health/liveness` - Liveness check

## 🎨 Customization

### Adding New Pages
1. Create a new page component in `admin/src/pages/`
2. Add the route to `App.tsx`
3. Add the resource to Refine configuration

### Customizing UI Theme
Edit `admin/src/App.tsx`:
```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: "#your-color",
      borderRadius: 6,
    },
  }}
>
```

### Adding New Charts
Use `@ant-design/charts` for data visualization:
```typescript
import { Line, Pie, Column } from '@ant-design/charts';
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is running on port 3000
2. **Authentication Issues**: Check JWT token configuration
3. **Build Errors**: Ensure all dependencies are installed

### Debug Mode
Enable debug logging in the admin panel:
```typescript
// In data provider
console.log('API Request:', { url, method, data });
```

Visit http://localhost:3001 to start using your admin panel!
