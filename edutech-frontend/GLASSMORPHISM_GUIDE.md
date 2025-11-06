# Glassmorphism Style Guide

## Overview

This project uses a comprehensive glassmorphism design system that provides modern, frosted-glass effects across all UI components. The styles are defined globally in `src/app/globals.css` and can be applied to any component using simple CSS classes.

## Features

- ✨ Semi-transparent backgrounds with backdrop blur
- 🎨 Soft box shadows and subtle borders
- 📱 Fully responsive design
- 🌙 Dark mode support
- ♿ Accessibility-friendly focus states
- 🎯 Component-specific pre-configured classes
- 🔧 Easy to customize

## Quick Start

Simply add the appropriate glassmorphism class to your component:

```tsx
// Card example
<div className="glass-card">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>

// Section example
<section className="glass-section">
  <h2>Section Title</h2>
  <p>Section content...</p>
</section>
```

## Base Classes

### Standard Glassmorphism

- `.glass` - Standard light glassmorphism effect
- `.glass-dark` - Standard dark glassmorphism effect
- `.glass-strong` - Stronger blur and opacity (light)
- `.glass-dark-strong` - Stronger blur and opacity (dark)
- `.glass-subtle` - Lighter, more subtle effect (light)

## Component Classes

### Cards

```tsx
<div className="glass-card">Standard card</div>
<div className="glass-card-dark">Dark card</div>
<div className="glass-card-strong">Strong card</div>
```

### Sections

```tsx
<section className="glass-section">Standard section</section>
<section className="glass-section-dark">Dark section</section>
<section className="glass-section-strong">Strong section</section>
```

### Navbars

```tsx
<nav className="glass-navbar">
  <a href="/" className="glass-nav-link">Home</a>
</nav>
```

### Forms

```tsx
<form className="glass-form">
  <div className="glass-form-group">
    <label>Email</label>
    <input type="email" className="glass-input" />
  </div>
  <button type="submit" className="glass-btn-primary">Submit</button>
</form>
```

### Modals

```tsx
<div className="glass-modal-backdrop">
  <div className="glass-modal">
    <h2>Modal Title</h2>
    <p>Modal content...</p>
  </div>
</div>
```

### Chat Windows

```tsx
<div className="glass-chat">
  <div className="glass-chat-message">Bot message</div>
  <div className="glass-chat-message-user">User message</div>
</div>
```

### Dashboards

```tsx
<div className="glass-dashboard">
  <div className="glass-dashboard-section">
    <h2>Analytics</h2>
    <div className="glass-card">Stat card</div>
  </div>
</div>
```

## Form Elements

### Inputs

```tsx
<input type="text" className="glass-input" placeholder="Enter text" />
<input type="text" className="glass-input-dark" placeholder="Dark input" />
```

### Textareas

```tsx
<textarea className="glass-textarea" rows={5}></textarea>
<textarea className="glass-textarea-dark" rows={5}></textarea>
```

### Selects

```tsx
<select className="glass-select">
  <option>Option 1</option>
</select>
```

## Buttons

```tsx
<button className="glass-btn">Standard Button</button>
<button className="glass-btn-primary">Primary Button</button>
<button className="glass-btn-secondary">Secondary Button</button>
<button className="glass-btn-dark">Dark Button</button>
```

## Utility Classes

### Hover Effects

Add hover effects to any glass element:

```tsx
<div className="glass-card glass-hover">Hover me!</div>
<div className="glass-card glass-dark-hover">Dark hover</div>
```

### Tailwind Utilities

```tsx
<div className="bg-glass border-glass shadow-glass">
  Custom glass element
</div>
```

## Responsive Design

All glassmorphism classes are fully responsive:

- **Mobile (< 768px)**: Reduced border radius, adjusted padding, disabled hover transforms
- **Tablet (768px - 1024px)**: Standard styling
- **Desktop (> 1024px)**: Full effects with all enhancements

## Dark Mode

Dark mode is automatically supported through:

1. **System preference detection** - Uses `@media (prefers-color-scheme: dark)`
2. **Dark variant classes** - Use `-dark` suffix classes
3. **Automatic adjustments** - Base classes adapt to dark mode

## Customization

### Adjusting Opacity

Edit the alpha value in `rgba()` backgrounds:

```css
.glass {
  background: rgba(255, 255, 255, 0.25); /* Change 0.25 to 0.35 for more opacity */
}
```

### Adjusting Blur

Modify the `blur()` value:

```css
.glass {
  backdrop-filter: blur(10px); /* Change 10px to 15px for stronger blur */
}
```

### Adjusting Borders

Change border width or opacity:

```css
.glass {
  border: 1px solid rgba(255, 255, 255, 0.18); /* Change to 2px or increase opacity */
}
```

### Themed Colors

Create color-themed glassmorphism:

```css
.glass-blue {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.3);
}
```

## Best Practices

1. **Use appropriate variants**: Choose `glass`, `glass-strong`, or `glass-subtle` based on importance
2. **Maintain contrast**: Ensure text is readable over glass backgrounds
3. **Combine with gradients**: Glassmorphism works beautifully over gradient backgrounds
4. **Test on mobile**: Always test responsive behavior on mobile devices
5. **Accessibility**: Use focus states and ensure keyboard navigation works

## Example Components

See the example components in `components/examples/`:

- `GlassSectionExample.tsx` - Section usage examples
- `GlassCardExample.tsx` - Card usage examples
- `GlassNavbarExample.tsx` - Navbar usage examples
- `GlassFormExample.tsx` - Form usage examples

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: `backdrop-filter` requires modern browsers. Older browsers will show the background without blur.

## Troubleshooting

### Glass effect not showing

1. Ensure the element has a background behind it (glassmorphism needs something to blur)
2. Check that `backdrop-filter` is supported in your browser
3. Verify the class is correctly applied

### Text not readable

1. Increase the opacity of the glass background
2. Use `glass-strong` for more opaque backgrounds
3. Ensure sufficient contrast between text and background

### Performance issues

1. Reduce blur intensity for better performance
2. Limit the number of glass elements on a single page
3. Use `will-change: transform` sparingly

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Backdrop Filter MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [Glassmorphism Design Trend](https://www.designsystems.com/glassmorphism-design-trend/)

---

**Created for EduTech Platform** - Modern education technology with beautiful UI

