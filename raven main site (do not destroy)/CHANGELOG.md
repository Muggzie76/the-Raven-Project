# Changelog

All notable changes to the Raven Website project will be documented in this file.

## [Unreleased]

### Added
- Article scheduling functionality in the admin dashboard
  - Added ability to schedule posts for future publication
  - Added visual indicators for post status (published/scheduled)
  - Enhanced post creation form with scheduling options
  - Implemented conditional date picker for scheduled posts

### Changed
- Updated PostsTab component with improved UI for post management
- Extended post data model to support scheduling metadata

### Fixed
- Delete functionality now properly removes posts from the list

## [0.2.0] - 2024-05-14

### Added
- Admin dashboard with basic post management
- Post creation and deletion functionality
- Simple post listing with image preview

## [0.1.0] - 2024-04-30

### Added
- Initial project structure
- Basic article display functionality
- Article crawler integration with Nuance.xyz 

## [1.1.0] - 2024-04-12

### Added
- Added `minify.js` script for CSS, JS, and HTML minification
- Implemented directory cleanup before minification to prevent recursive file copying
- Added specific file type handlers for CSS, JS, and HTML files
- Created robust error handling throughout the minification process
- Added file size statistics for minified files (before/after comparison)

### Fixed
- Fixed naming conflict between imported `html-minifier` function and custom minification function
- Implemented proper directory structure handling to prevent recursive directory copying
- Added safeguards to prevent processing the dist directory itself
- Fixed issue where spaces in filenames caused errors during file copying
- Added proper error handling to prevent script crashes during file operations

### Changed
- Updated `package.json` to include minify script command
- Improved console output during minification for better debugging
- Enhanced error messages for troubleshooting minification issues

## [1.0.0] - 2024-03-15

### Added
- Initial website structure and components
- Blog system implementation
- Internet Identity authentication integration
- Admin dashboard and blog management
- Image optimization utilities

### Dependencies Added
- @tiptap/react: ^2.1.0
- @tiptap/starter-kit: ^2.1.0
- @tiptap/extension-image: ^2.1.0
- @tiptap/extension-link: ^2.1.0
- @tiptap/extension-placeholder: ^2.1.0
- react-icons: ^4.10.0

### Components Added
- src/components/admin/AdminEditor.jsx
  - Rich text editor component
  - Post metadata management
  - Publishing workflow controls
  - Image upload handling
  - Autosave functionality

### Styling Added
- src/components/admin/AdminEditor.css
  - Editor layout and styling
  - Dark mode support
  - Responsive design
  - TipTap editor customization

### Technical Details
- Autosave interval: 30 seconds
- Image formats supported: All standard web formats
- Editor toolbar features:
  - Bold, Italic
  - Links
  - Images
  - Bullet lists
  - Numbered lists
  - Blockquotes
  - Undo/Redo

### TODO
- Implement API endpoints for:
  - Post saving
  - Image upload
  - Post publishing
- Add version history
- Implement collaborative editing
- Add markdown support
- Create image gallery/asset manager
- Add accessibility checker

### Notes
- Internet Identity integration pending for admin authentication
- API endpoints are currently stubbed with TODO comments
- Image upload functionality requires backend implementation 