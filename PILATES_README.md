# AURA STUDIO - Pilates Website

## Quick Start

The AURA STUDIO Pilates website is ready to use! Here's how to get started:

### Option 1: Open Directly in Browser
Simply double-click `index.html` to open it in your default web browser.

### Option 2: Local Server (Recommended)
For the best experience with external resources (images, FullCalendar):

```bash
# Using Python 3
python3 -m http.server 8080

# Or using PHP
php -S localhost:8080

# Or using Node.js (if http-server is installed)
npx http-server -p 8080
```

Then open your browser to: `http://localhost:8080/index.html`

### Option 3: Deploy Online
Upload `index.html` to any web hosting service:
- **GitHub Pages**: Free hosting for static sites
- **Netlify**: Instant deployment with drag-and-drop
- **Vercel**: Free hosting with automatic HTTPS
- **Traditional hosting**: Upload via FTP to your web host

## What's Included

### ✅ Complete Website with 5 Sections:

1. **Hero Section**: Full-screen welcome with call-to-action button
2. **About Section**: 3 alternating image/text layouts describing the studio
3. **Booking Section**: 5 class plans with integrated calendar booking system
4. **Image Gallery**: Horizontal scrolling showcase of studio facilities
5. **Contact Section**: WhatsApp integration and operating hours

### ✅ Key Features:

- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Design**: Clean, wellness-focused aesthetic with soft pink color palette
- **Interactive Booking**: FullCalendar integration for class scheduling
- **Easy Customization**: Single HTML file with inline CSS and JavaScript
- **No Database Required**: Client-side functionality, ready to deploy

## Color Palette

The website uses a cohesive color scheme:
- **#f6c8c7**: Primary background (About & Image Scroll sections)
- **#eebbbb**: Secondary background (Booking cards & Contact section)
- **#fbe3e3**: Button color with white text
- **#e8cccc**: Button hover effect
- **#333**: Dark text on light backgrounds
- **#fff**: White text on hero section

## Booking System

### Features:
- 5 class packages: 1, 4, 8, 12, and 15 classes
- Prices: $150, $450, $1000, $1400, $1700
- Available times: 6-11 AM and 5-8 PM
- Available days: Monday through Saturday (no Sunday bookings)
- Automatic tracking of booked vs. available classes
- User-friendly alerts for booking status

### How It Works:
1. User selects a class package (e.g., 8 classes for $1000)
2. Calendar appears showing available time slots
3. User clicks time slots to book classes
4. System tracks bookings and prevents over-booking
5. User can cancel bookings by clicking on them

**Note**: Bookings are client-side only and reset on page refresh. For persistent bookings, a backend database is required.

## Customization

See `PILATES_CUSTOMIZATION.md` for detailed instructions on:
- Replacing placeholder images
- Updating contact information and WhatsApp number
- Modifying class plans and pricing
- Adjusting booking hours
- Changing colors
- Adding your logo
- Integrating with backend services

## Browser Compatibility

✅ **Fully supported:**
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)

⚠️ **Requirements:**
- JavaScript must be enabled for booking functionality
- Internet connection required for FullCalendar and Unsplash images

## Technical Details

- **File size**: ~20KB
- **Dependencies**: FullCalendar v5 (loaded from CDN)
- **Images**: Hosted on Unsplash (placeholder images)
- **Frameworks**: None (vanilla HTML/CSS/JavaScript)
- **Responsive breakpoint**: 768px

## Support & Documentation

- **Customization Guide**: `PILATES_CUSTOMIZATION.md`
- **FullCalendar Docs**: https://fullcalendar.io/docs
- **Flexbox Guide**: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

## Screenshots

The website includes:
- Full-screen hero with background image and overlay
- Three-column about section with alternating layouts
- Card-based booking interface with calendar
- Horizontal scrolling image gallery
- Contact form with WhatsApp integration

All sections are fully responsive and optimized for mobile viewing.

## Next Steps

1. **Test the website**: Open `index.html` in your browser
2. **Customize content**: Update text, images, and contact info
3. **Replace images**: Upload your studio photos and update URLs
4. **Deploy online**: Choose a hosting service and go live
5. **Optional**: Add backend for persistent bookings

## Contact Information

Current configuration:
- **WhatsApp**: +527151596586
- **Hours**: 06:00 AM – 08:00 PM

Update these in the HTML as needed.

---

**Ready to launch?** Simply open `index.html` and start customizing!
