#!/usr/bin/env python3
"""
Generate all iOS/iPadOS/macOS Apple Touch Icons
Creates icons with white background for perfect display on home screen
"""

from PIL import Image
import os

# Icon sizes required for iOS/iPadOS/macOS
# Based on Apple's official guidelines
ICON_SIZES = {
    # iPhone
    'apple-touch-icon-120x120.png': (120, 120),  # iPhone (iOS 7+)
    'apple-touch-icon-152x152.png': (152, 152),  # iPad (iOS 7+)
    'apple-touch-icon-167x167.png': (167, 167),  # iPad Pro (iOS 10+)
    'apple-touch-icon-180x180.png': (180, 180),  # iPhone (iOS 8+, Retina)
    
    # Standard fallback (the main one)
    'apple-touch-icon.png': (180, 180),  # Default (highest resolution)
    
    # Legacy sizes (for older devices)
    'apple-touch-icon-57x57.png': (57, 57),      # iPhone (iOS 6 and older)
    'apple-touch-icon-60x60.png': (60, 60),      # iPhone (iOS 7)
    'apple-touch-icon-72x72.png': (72, 72),      # iPad (iOS 6 and older)
    'apple-touch-icon-76x76.png': (76, 76),      # iPad (iOS 7)
    'apple-touch-icon-114x114.png': (114, 114),  # iPhone Retina (iOS 6)
    'apple-touch-icon-144x144.png': (144, 144),  # iPad Retina (iOS 6)
}

def create_icon_with_white_background(source_path, output_path, size):
    """
    Create an icon with white background
    
    Args:
        source_path: Path to source logo image
        output_path: Path where to save the icon
        size: Tuple (width, height) for the icon
    """
    # Open the source image
    logo = Image.open(source_path)
    
    # Convert to RGBA if not already
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
    
    # Create a white background
    background = Image.new('RGBA', size, (255, 255, 255, 255))
    
    # Calculate the size to fit the logo (with 10% padding)
    logo_max_size = int(min(size) * 0.90)
    
    # Resize logo maintaining aspect ratio
    logo.thumbnail((logo_max_size, logo_max_size), Image.Resampling.LANCZOS)
    
    # Calculate position to center the logo
    logo_x = (size[0] - logo.size[0]) // 2
    logo_y = (size[1] - logo.size[1]) // 2
    
    # Paste logo onto white background
    background.paste(logo, (logo_x, logo_y), logo)
    
    # Convert to RGB (remove alpha channel for PNG)
    final_image = background.convert('RGB')
    
    # Save the icon
    final_image.save(output_path, 'PNG', optimize=True, quality=95)
    print(f"✓ Created: {output_path} ({size[0]}x{size[1]})")

def main():
    # Source logo path
    source_logo = 'auralogo2.png'
    
    if not os.path.exists(source_logo):
        print(f"❌ Error: Source logo '{source_logo}' not found!")
        return
    
    print(f"📱 Generating iOS/iPadOS/macOS icons from {source_logo}")
    print(f"🎨 Background: White")
    print(f"📏 Total icons to generate: {len(ICON_SIZES)}")
    print()
    
    # Create all icons
    for filename, size in ICON_SIZES.items():
        output_path = filename
        create_icon_with_white_background(source_logo, output_path, size)
    
    print()
    print("✅ All icons generated successfully!")
    print()
    print("📋 Next steps:")
    print("1. Add the following lines to the <head> section of index.html:")
    print()
    print('   <!-- iOS/iPadOS/macOS Touch Icons -->')
    for filename in ICON_SIZES.keys():
        if filename == 'apple-touch-icon.png':
            print(f'   <link rel="apple-touch-icon" href="{filename}">')
        else:
            size = ICON_SIZES[filename]
            print(f'   <link rel="apple-touch-icon" sizes="{size[0]}x{size[1]}" href="{filename}">')
    print()

if __name__ == '__main__':
    main()
