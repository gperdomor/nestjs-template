# Admin Panel - NestJS Template

## 🎉 Congratulations! 

You now have a **super admin area** built with **Refine** that connects seamlessly to your NestJS backend! 

## 🚀 Quick Start

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

## 🎯 Features Implemented

### ✅ Complete Admin Interface
- **Dashboard** - System overview with metrics and charts
- **User Management** - Full CRUD operations with role assignment
- **Role & Permission Management** - Dynamic permission system
- **File Storage Management** - View and manage uploaded files
- **Health Monitoring** - Real-time system health checks
- **Settings Panel** - Profile management and 2FA setup

### ✅ Authentication & Security
- **JWT-based authentication** with automatic token refresh
- **Two-Factor Authentication (2FA)** setup and verification
- **Email verification** flow
- **Role-based access control** (RBAC)
- **Session management** with secure logout

### ✅ Advanced Features
- **Real-time health monitoring** with service status
- **File upload and management** with preview capabilities
- **Permission-based UI** hiding/showing features based on user roles
- **Responsive design** works on desktop and mobile
- **Search and filtering** across all data tables
- **Data visualization** with charts and graphs

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
- `GET /api/users` - List users with pagination
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

## 🔄 Future Enhancements

### Planned Features
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Bulk operations for users/roles
- [ ] Audit log viewer
- [ ] System configuration panel
- [ ] Email template editor
- [ ] Advanced reporting system

### Performance Optimizations
- [ ] Implement virtual scrolling for large datasets
- [ ] Add data caching with React Query
- [ ] Optimize bundle size with code splitting
- [ ] Add service worker for offline support

## 📝 Contributing

1. Follow the existing code structure
2. Add TypeScript types for all new features
3. Test authentication flows thoroughly
4. Update documentation for new features

## 🎉 You're All Set!

Your super admin area is now ready! You have:
- ✅ A fully functional admin panel
- ✅ Complete user and role management
- ✅ Real-time health monitoring
- ✅ File management system
- ✅ 2FA security features
- ✅ Responsive design
- ✅ Professional UI with Ant Design

Visit http://localhost:3001 to start using your admin panel!
