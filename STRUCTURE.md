# Portfolio Website Structure Documentation

This document outlines the main structural components, content, and layout patterns of the portfolio website for reference when rebuilding styles from scratch.

## 📁 File Structure

```
src/
├── layouts/
│   └── BaseLayout.astro          # Main layout wrapper
├── pages/
│   └── index.astro               # Main portfolio page
├── components/
│   ├── SidebarNav.astro          # Fixed sidebar navigation
│   ├── MobileNav.astro           # Mobile hamburger navigation
│   ├── ContactForm.astro         # Contact form section
│   ├── Footer.astro              # Site footer
│   ├── GlassCard.astro           # Reusable glass card component
│   ├── ProjectCard.astro         # Individual project cards
│   └── FormInput.astro           # Form input component
├── styles/
│   └── global.css                # Global styles and design tokens
└── types/
    └── index.ts                  # TypeScript type definitions
```

## 🎨 Design System Elements

### Brand Colors
- **Warm White**: #FEFCF8 (primary background)
- **Coral Primary**: #E85A2B (brand accent, CTAs)
- **Text Dark**: #1A0D08 (primary text)
- **Accent Yellow**: #FFD644 (secondary accent)
- **Mocha Mousse**: #A47864 (secondary text, muted elements)
- **Cool Contrast**: #2563EB (blue accent)

### Typography
- **Font Family**: RST Thermal (custom font with multiple weights)
- **Weights**: Light (300), Regular (400), Medium (500), Bold (700)
- **Scale**: Uses responsive typography from small mobile to large desktop

### Visual Effects
- **Glassmorphism**: Backdrop blur effects with semi-transparent backgrounds
- **Organic Shapes**: Cell-like morphing animations
- **Floating Elements**: Subtle movement animations
- **Gradient Text**: Multi-color gradient text effects

## 📱 Layout Structure

### BaseLayout.astro
- HTML document wrapper
- Meta tags and SEO
- Font loading
- Global styles import
- Sidebar and mobile navigation integration

### Main Page Sections (index.astro)

#### 1. Hero Section (`#hero`)
**Content:**
- Large title: "Shyam" (coral) / "Ajudia" (dark, offset)
- Tagline: "Infrastructure Engineer specializing in DevOps, system administration, and data engineering"
- Bio paragraph about transition from biology to infrastructure
- Two CTA buttons: "Learn More" (yellow glass) and "Get In Touch" (mocha glass)
- Scroll indicator at bottom

**Layout:**
- Asymmetrical grid: 2/3 content, 1/3 CTAs
- Responsive: stacked on mobile, side-by-side on desktop
- Hero title uses massive responsive typography
- Bio text is offset to match "Ajudia" alignment

#### 2. Professional Evolution Timeline (`#evolution`)
**Content:**
- Section title: "Professional Evolution"
- Description about journey from biology to cloud architecture
- 4 timeline phases:
  1. **2019-2021**: Biology Research Associate (coral theme)
  2. **2021-2022**: Computational Integration (mocha theme)
  3. **2022-2024**: Technical Leadership (mocha theme)
  4. **2024+ Current**: Infrastructure & Data Engineering (blue theme)

**Layout:**
- Vertical timeline with central line
- Alternating left/right content cards
- Glass morphism cards with theme colors
- Technology tags for each phase
- Mobile: all cards align left

#### 3. Featured Work Section (`#projects`)
**Content:**
- Section title: "Featured Work"
- Description about infrastructure projects
- Project grid with 2 main projects:
  1. **Homelab Kubernetes** (large card, coral theme)
  2. **Portfolio Website** (medium card, mocha theme)
- Placeholder for additional projects (blue theme)

**Layout:**
- Asymmetrical Bento grid (12-column system)
- Large project: 8 columns
- Medium project: 4 columns
- Placeholder: 4 columns
- Glass morphism cards with hover effects
- Technology tags for each project

#### 4. Contact Form Section (`#contact`)
**Content:**
- Section title: "Get In Touch"
- Description about collaboration
- Contact form with fields:
  - Name (required)
  - Email (required)
  - Subject (required)
  - Message (required, textarea)
- Submit button with success/error states
- Direct contact info: email and GitHub links

**Layout:**
- Centered content with max-width
- Glass morphism form container
- Responsive form layout
- Floating labels or placeholder text

#### 5. Footer
**Content:**
- Name: "Shyam Ajudia"
- Copyright: "© 2025 Shyam Ajudia. All rights reserved."
- Links: Contact, GitHub, Resume

**Layout:**
- Simple centered layout
- Minimal styling
- Consistent with overall brand

## 🧭 Navigation Components

### SidebarNav.astro
**Content:**
- Fixed position sidebar (desktop only)
- Navigation items:
  - Home (#hero)
  - Experience (#evolution)
  - Projects (#projects)
  - Contact (#contact)
- Progress indicator showing scroll position
- Organic cell-like design with morphing animations

**Layout:**
- Fixed left sidebar
- Vertical navigation list
- Active state indicators
- Smooth scroll behavior
- Cell-like background shapes

### MobileNav.astro
**Content:**
- Hamburger menu button
- Slide-out navigation panel
- Same navigation items as sidebar
- Close button

**Layout:**
- Fixed top position
- Hamburger icon (3 lines)
- Full-screen overlay when open
- Slide animation from top/side

## 🎯 Interactive Elements

### Buttons & CTAs
- Primary CTA: Yellow glass background, dark text
- Secondary CTA: Mocha glass background, dark text
- Hover effects: scale, color changes, shadow enhancement
- Consistent padding and border radius

### Form Elements
- Glass morphism input fields
- Floating labels or clear placeholders
- Focus states with brand color outlines
- Validation states (error/success)

### Cards & Containers
- Glass morphism backgrounds
- Subtle borders with brand colors
- Hover effects: scale, shadow, color shifts
- Consistent padding and border radius
- Responsive sizing

## 📐 Responsive Breakpoints

### Mobile First Approach
- **Mobile**: < 640px (stacked layouts, full-width elements)
- **Tablet**: 640px - 1024px (mixed layouts, some side-by-side)
- **Desktop**: 1024px+ (full asymmetrical layouts, sidebar visible)
- **Large Desktop**: 1280px+ (enhanced typography scaling)

### Key Responsive Patterns
- Hero: Stacked → Asymmetrical grid
- Timeline: Left-aligned → Alternating
- Projects: Stacked → Bento grid
- Navigation: Mobile hamburger → Fixed sidebar
- Typography: Scales significantly across breakpoints

## ✨ Animation & Interaction Patterns

### Page Load Animations
- Staggered fade-in effects
- Growth animations for cards
- Slide-up animations for timeline items
- Delays for sequential appearance

### Hover Interactions
- Subtle scale transforms (1.02x - 1.05x)
- Color transitions
- Shadow enhancements
- Arrow/icon movements

### Organic Animations
- Cell morphing shapes
- Floating elements with subtle movement
- Gradient text color shifts
- Breathing/pulsing effects

### Scroll Interactions
- Progress indicator in sidebar
- Smooth scroll to sections
- Bounce animation on scroll indicator

## 🔧 Technical Implementation Notes

### Component Architecture
- Astro components with scoped styles
- TypeScript for props and interfaces
- Semantic CSS class names
- Modular, reusable components

### Performance Considerations
- Optimized animations with `will-change`
- Efficient CSS selectors
- Minimal JavaScript usage
- Responsive images and assets

### Accessibility Features
- Semantic HTML structure
- Focus management and visible focus states
- Screen reader considerations
- Keyboard navigation support
- Reduced motion preferences

---

This structure serves as the foundation for rebuilding the visual design while maintaining the core content organization and user experience patterns.
