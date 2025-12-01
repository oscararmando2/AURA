# AURA STUDIO - Pilates Website Customization Guide

## Overview
This guide explains how to customize the AURA STUDIO Pilates website (`index.html`) for your needs.

## Quick Start

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **Test locally**: Use a local server (e.g., `python3 -m http.server 8080`)
3. **Deploy**: Upload to any web hosting service (GitHub Pages, Netlify, etc.)

## Customization Options

### 1. Replacing Images

The website uses Unsplash placeholder images. To use your own images:

**Hero Section (line ~28):**
```html
background-image: url('YOUR_IMAGE_URL_HERE');
```

**About Section Images (lines ~261-265):**
```html
<img src="YOUR_IMAGE_URL" alt="Pilates Studio">
<img src="YOUR_IMAGE_URL" alt="Pilates Instructor">
<img src="YOUR_IMAGE_URL" alt="Pilates Practice">
```

**Image Scroll Section (lines ~347-354):**
```html
<img src="YOUR_IMAGE_URL" alt="Studio 1" class="scroll-image">
<!-- Repeat for all 8 images -->
```

**Recommended image sizes:**
- Hero background: 1600x900px or larger
- About images: 600x400px
- Scroll images: 300x200px

### 2. Updating Contact Information

**WhatsApp Number (line ~368):**
```html
<a href="https://wa.me/+527151596586" class="contact-btn" target="_blank">
```
Replace `+527151596586` with your WhatsApp number (include country code).

**Operating Hours (line ~369):**
```html
<p class="hours">Abre hoy: 06:00 a.m. – 08:00 p.m.</p>
```

### 3. Modifying Class Plans

**Update pricing and class counts (lines ~286-340):**

Example for the 8-class plan:
```html
<div class="plan-card">
    <h3>8 Clases</h3>
    <div class="price">$1000</div>
    <select disabled>
        <option>8 Clases</option>
    </select>
    <button class="plan-btn" onclick="selectPlan(8, 1000)">Seleccionar</button>
</div>
```

Change the numbers in:
- `<h3>` tag (display name)
- `<div class="price">` tag (price display)
- `<option>` tag (dropdown text)
- `onclick="selectPlan(8, 1000)"` (classes count, price)

### 4. Adjusting Booking Hours

**Current schedule:** Monday-Saturday, 6-11 AM and 5-8 PM

To modify (lines ~463-478):

```javascript
const allowedHours = [6, 7, 8, 9, 10, 17, 18, 19]; // Hours in 24-hour format
```

And update business hours:
```javascript
businessHours: [
    {
        daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
        startTime: '06:00',
        endTime: '11:00'
    },
    {
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        startTime: '17:00',
        endTime: '20:00'
    }
]
```

### 5. Changing Colors

The color palette is defined in CSS. Search and replace:

- `#f6c8c7` → Your primary color (About, Image Scroll backgrounds)
- `#eebbbb` → Your secondary color (Plan cards, Contact background, text boxes)
- `#fbe3e3` → Your button color
- `#e8cccc` → Your button hover color

### 6. Updating Text Content

Simply find the text in the HTML and replace it:

**Hero Section (lines ~249-253):**
```html
<h1>Bienvenida</h1>
<h2>Pilates a tu medida</h2>
<p>Fortalece tu cuerpo y mente con Pilates.</p>
```

**About Section (lines ~259, 267, 275):**
Update the paragraph text in each `.about-text` div.

**Contact Section (lines ~358-362):**
```html
<p>WhatsApp</p>
<p>¿Preguntas?</p>
<p>¡Estamos aquí para ti!</p>
```

## Hosting Options

### GitHub Pages (Free)
1. Create a GitHub repository
2. Upload `index.html` to the repository
3. Go to Settings → Pages
4. Select branch and save
5. Your site will be live at `https://yourusername.github.io/repo-name`

### Netlify (Free)
1. Sign up at netlify.com
2. Drag and drop your folder containing `index.html`
3. Site is live instantly with a custom URL

### Traditional Hosting
Upload `index.html` to your web hosting via FTP/cPanel file manager.

## Browser Compatibility

✅ **Supported browsers:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

⚠️ **Note:** The FullCalendar booking system requires JavaScript enabled.

## Troubleshooting

### Images not loading
- Check image URLs are correct and accessible
- Use absolute URLs for hosted images
- Consider hosting images on ImgBB, Cloudinary, or your server

### Calendar not showing
- Verify FullCalendar CDN is accessible
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

### Mobile view issues
- Clear browser cache
- Test on actual devices, not just browser dev tools
- Verify viewport meta tag is present

## Advanced Customization

### Adding a Logo
Add before the hero content (around line 247):
```html
<img src="YOUR_LOGO.png" alt="AURA STUDIO" style="position: absolute; top: 20px; left: 20px; width: 150px; z-index: 2;">
```

### Backend Integration
To persist bookings, you'll need:
1. A backend server (Node.js, PHP, Python, etc.)
2. A database (MySQL, MongoDB, Firebase, etc.)
3. API endpoints for saving/loading bookings
4. Modify the JavaScript to send data to your API

Example with Firebase:
```javascript
// Add Firebase SDK
// Save booking
firebase.firestore().collection('bookings').add({
    date: info.startStr,
    plan: selectedPlan.classes,
    timestamp: new Date()
});
```

### Google Analytics
Add before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

## Support

For issues or questions about the website structure, refer to:
- The HTML comments in `index.html` (sections are clearly marked)
- FullCalendar documentation: https://fullcalendar.io/docs
- CSS Flexbox guide: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

## License

This website template is provided as-is for AURA STUDIO. Customize as needed for your business.
