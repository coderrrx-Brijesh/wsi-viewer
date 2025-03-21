# WSI Viewer

A Whole Slide Image Viewer application for visualizing and interacting with medical slide images, with a focus on blood cell detection and analysis.

## Features

- Interactive slide image viewing with zoom and pan functionality
- Bounding box visualization for detected cells
- Categorized cell data display
- Minimap for easy navigation
- Responsive design for different screen sizes

## Technology Stack

- React.js for the UI
- react-zoom-pan-pinch for image manipulation
- CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/wsi-viewer.git
cd wsi-viewer
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder ready for deployment.

## Deployment

The application is configured for easy deployment to Vercel:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. For production deployment:
```bash
vercel --prod
```

### Other Deployment Options

You can also deploy to other platforms:

- GitHub Pages: See [deployment guide](https://create-react-app.dev/docs/deployment/#github-pages)
- Netlify: Connect your GitHub repository or upload the build folder directly
- AWS S3/CloudFront: For static hosting with CDN support

## Usage

- Use the mouse wheel or zoom controls to zoom in/out
- Click and drag to pan around the image
- Click on detected cells to view more information
- Use the minimap for quick navigation around the slide
- Toggle between different view modes

## Project Structure

- `/src/components` - UI components
- `/src/context` - Context API for state management
- `/public` - Static assets and sample data

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- React team for the Create React App
- OpenCV and TensorFlow for image processing inspiration
- Medical imaging community for standards and best practices
