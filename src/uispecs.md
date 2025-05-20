# MBTI Daily Quotes - UI Specifications

## Color Palette

### Primary Colors
- Main Green: `#4CAF50` (Material Green 500)
- Light Green: `#81C784` (Material Green 300)
- White: `#FFFFFF`
- Background: `#F5F5F5` (Light Gray)

### Accent Colors
- Success Green: `#66BB6A` (Material Green 400)
- Hover Green: `#43A047` (Material Green 600)
- Text Primary: `#212121`
- Text Secondary: `#757575`

## Typography
- Primary Font: 'Inter', sans-serif
- Secondary Font: 'Roboto', sans-serif
- Heading Sizes:
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.75rem (28px)
  - H4: 1.5rem (24px)
  - Body: 1rem (16px)

## Animations

### Page Transitions
```javascript
const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98
  },
  transition: { 
    duration: 0.4,
    ease: "easeInOut"
  }
};
```

### Interactive Elements
- Button Hover: Scale up by 1.05
- Card Hover: Elevate with shadow
- Input Focus: Smooth border color transition
- Quote Generation: Pop-up animation with bounce effect

### Animation Guidelines
- Duration: 0.3s - 0.5s for most interactions
- Easing: "easeInOut" for smooth transitions
- Scale: Max 1.1 for hover effects
- Bounce: Subtle bounce effect (spring animation) for important actions

## Component Styling

### Cards
- Border Radius: 12px
- Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Hover Effect: Elevate shadow and slight scale
- Background: White
- Padding: 24px

### Buttons
- Primary:
  - Background: Main Green
  - Text: White
  - Hover: Darker Green
  - Border Radius: 8px
  - Padding: 12px 24px

- Secondary:
  - Background: White
  - Text: Main Green
  - Border: 2px solid Main Green
  - Hover: Light Green background

### Input Fields
- Border: 1px solid #E0E0E0
- Focus Border: Main Green
- Border Radius: 8px
- Padding: 12px 16px

### Avatar
- Size: 120px x 120px
- Border: 4px solid Main Green
- Border Radius: 50%
- Shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

## Layout
- Container Max Width: 1200px
- Section Padding: 32px
- Grid Gap: 24px
- Responsive Breakpoints:
  - Mobile: < 600px
  - Tablet: 600px - 960px
  - Desktop: > 960px

## Accessibility
- Color Contrast Ratio: Minimum 4.5:1
- Focus States: Visible and clear
- Interactive Elements: Minimum touch target size of 44px
- Text Size: Minimum 16px for body text

## Loading States
- Skeleton Loading: Subtle pulse animation
- Loading Spinner: Main Green with fade effect
- Progress Bar: Gradient animation

## Error States
- Error Messages: Red with shake animation
- Invalid Input: Red border with pulse effect
- Success Messages: Green with fade-in animation 