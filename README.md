# Housing Eligibility Quiz WordPress Plugin

A WordPress plugin that converts the Housing Eligibility Quiz into a shortcode-enabled component for WordPress sites.

## Installation

1. **Upload the plugin folder** to your WordPress site:
   - Navigate to `/wp-content/plugins/`
   - Upload the `housing-quiz` folder

2. **Activate the plugin** from WordPress Admin:
   - Go to **Plugins** in your WordPress dashboard
   - Find "Housing Eligibility Quiz"
   - Click **Activate**

## Usage

Add the quiz to any page or post using the shortcode:

```
[housing_quiz]
```

## Local Preview

Open `preview.html` in a browser to render and interact with the quiz without WordPress. The preview loads the same CSS and JavaScript files used by the plugin, so refresh the page after making changes to those assets.

## Features

- ✅ All original logic and styling preserved
- ✅ 8-question interactive quiz
- ✅ Keyboard navigation support (A/B/C keys, Enter)
- ✅ Smooth animations and transitions
- ✅ Responsive design (mobile-friendly)
- ✅ No tracking, cookies, or external data transmission
- ✅ Accessibility compliant (ARIA labels)

## File Structure

```
housing-quiz/
├── housing-quiz.php           # Main plugin file
├── preview.html            # Standalone local preview
├── assets/
│   ├── css/
│   │   └── housing-quiz.css   # All styling
│   └── js/
│       └── housing-quiz.js    # All quiz logic
└── README.md               # This file
```

## Customization

### Changing Colors

Edit the CSS variables in `assets/css/housing-quiz.css`:

```css
:root {
  --bg: #942020; /* Main background color */
  --white: #ffffff; /* Text color */
  /* ... other colors ... */
}
```

### Modifying Questions or Results

Edit the data arrays in `assets/js/housing-quiz.js`:

- `QUESTIONS` array - contains all 8 questions
- `RESULTS` array - contains the two possible result screens

## License

GPL v2 or later
