# Video Status Maker 2.0

A modern, AI-powered platform for creating stunning video status templates for WhatsApp, Instagram, and other social media platforms. Built with Laravel 12, Inertia.js, React 19, and TailwindCSS 4.

## 🌟 Features

### For Users
- **Template Browser**: Browse hundreds of professionally designed video templates
- **Real-time Editor**: Customize text, images, colors, and animations in real-time
- **Video Preview**: See your changes instantly with live preview
- **Export Options**: Download videos in multiple formats (MP4, WebM)
- **Social Sharing**: Direct sharing to WhatsApp, Instagram, and other platforms
- **Responsive Design**: Works perfectly on desktop and mobile devices

### For Admins
- **Template Management**: Create, edit, and manage video templates
- **Category System**: Organize templates by categories (Birthday, Diwali, Quotes, etc.)
- **Asset Library**: Upload and manage images, videos, and audio files
- **Analytics Dashboard**: Track downloads, views, and user engagement
- **SEO Optimization**: AI-powered meta tags and keyword suggestions
- **User Management**: Manage user accounts and permissions

### Technical Features
- **Modern UI**: Built with shadcn/ui components and Framer Motion animations
- **Video Rendering**: Integration with DiffusionStudio/core for high-quality video output
- **AI Integration**: OpenAI API for content suggestions and SEO optimization
- **Real-time Updates**: Live preview and instant feedback
- **Performance Optimized**: Lazy loading, CDN support, and efficient rendering

## 🚀 Tech Stack

### Backend
- **Laravel 12**: PHP framework for robust backend functionality
- **Inertia.js**: Modern SPA experience without API complexity
- **MySQL/PostgreSQL**: Database for storing templates and user data
- **Laravel Sanctum**: API authentication and security

### Frontend
- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **TailwindCSS 4**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible UI components
- **Framer Motion**: Smooth animations and transitions
- **React Lottie Player**: Animated stickers and effects

### Video Processing
- **DiffusionStudio/core**: High-performance video rendering
- **FFmpeg**: Video encoding and format conversion
- **Canvas API**: Real-time preview rendering

### AI & SEO
- **OpenAI API**: Content generation and optimization
- **react-helmet-async**: Dynamic meta tags and SEO
- **AI-powered**: Keyword suggestions and content optimization

## 📦 Installation

### Prerequisites
- PHP 8.2 or higher
- Node.js 18 or higher
- Composer
- MySQL/PostgreSQL
- FFmpeg (for video processing)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/video-status-maker.git
   cd video-status-maker
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Build assets**
   ```bash
   npm run build
   ```

7. **Start development servers**
   ```bash
   # Terminal 1: Laravel server
   php artisan serve
   
   # Terminal 2: Vite dev server
   npm run dev
   ```

## 🎨 Template Structure

Templates are stored as JSON configurations that define:
- **Duration**: Video length in seconds
- **Resolution**: Output resolution (default: 1080x1920)
- **Background**: Gradient, image, or solid color
- **Layers**: Text, images, videos, and Lottie animations
- **Animations**: Fade, bounce, glow, typewriter effects
- **Customization**: Editable text fields and image placeholders

### Example Template JSON
```json
{
  "duration": 15,
  "resolution": "1080x1920",
  "background": {
    "type": "gradient",
    "colors": ["#FF6B6B", "#4ECDC4"]
  },
  "layers": [
    {
      "type": "text",
      "content": "{{name}}",
      "position": [540, 400],
      "fontSize": 48,
      "color": "#FFFFFF",
      "fontFamily": "Arial",
      "textAlign": "center",
      "animation": "fadeInUp"
    },
    {
      "type": "image",
      "placeholder": "user_photo",
      "position": [540, 700],
      "size": [200, 200],
      "shape": "circle",
      "animation": "scaleIn"
    }
  ]
}
```

## 🎯 Usage

### For Users
1. **Browse Templates**: Visit the homepage to see featured templates
2. **Filter by Category**: Use the category filter to find specific types
3. **Preview Template**: Click on any template to see a preview
4. **Customize**: Edit text, upload images, adjust colors and fonts
5. **Export**: Download your customized video in your preferred format

### For Admins
1. **Access Admin Panel**: Navigate to `/admin` after authentication
2. **Manage Categories**: Create and organize template categories
3. **Create Templates**: Use the template builder to create new designs
4. **Upload Assets**: Add images, videos, and audio files to the library
5. **Monitor Analytics**: Track usage and performance metrics

## 🔧 Configuration

### Environment Variables
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=video_status_maker
DB_USERNAME=root
DB_PASSWORD=

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# File Storage
FILESYSTEM_DISK=local
# or for production:
# FILESYSTEM_DISK=s3
# AWS_ACCESS_KEY_ID=your_aws_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret
# AWS_DEFAULT_REGION=us-east-1
# AWS_BUCKET=your_bucket_name
```

### Video Processing
Configure FFmpeg path in your environment:
```env
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
```

## 📱 API Endpoints

### Public Endpoints
- `GET /` - Homepage with featured templates
- `GET /templates` - Browse all templates
- `GET /templates/{slug}` - View specific template
- `POST /templates/{id}/customize` - Customize template
- `POST /templates/{id}/export` - Export video

### Admin Endpoints
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/templates` - Manage templates
- `POST /admin/templates` - Create template
- `PUT /admin/templates/{id}` - Update template
- `DELETE /admin/templates/{id}` - Delete template
- `GET /admin/categories` - Manage categories
- `POST /admin/assets` - Upload assets

## 🎨 Customization

### Adding New Template Types
1. Create a new category in the admin panel
2. Design your template using the JSON structure
3. Add custom animations in the VideoRenderer component
4. Test with different content and resolutions

### Custom Animations
Add new animation types in `VideoRenderer.tsx`:
```typescript
case 'yourAnimation':
    // Your animation logic here
    break;
```

### Styling
- Modify TailwindCSS classes for visual changes
- Update shadcn/ui component themes
- Add custom CSS in `resources/css/app.css`

## 🚀 Deployment

### Production Build
```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Server Requirements
- PHP 8.2+
- Node.js 18+
- MySQL/PostgreSQL
- FFmpeg
- Web server (Nginx/Apache)

### Docker Deployment
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/) - The PHP framework
- [Inertia.js](https://inertiajs.com/) - Modern SPA approach
- [React](https://reactjs.org/) - UI library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [DiffusionStudio/core](https://github.com/diffusion-studio/core) - Video rendering

## 📞 Support

For support, email support@videostatusmaker.com or join our Discord community.

---

**Made with ❤️ for content creators worldwide**
