# Domaine & B&B in the Ardèche for Sale

This is a multilingual website to showcase a property for sale in the Ardèche region of France.

## Website Structure

- **Languages**: English, French, German, Italian
- **Pages**: Home, Gallery, Plans, FAQ, Contact
- **Images**: The website is designed to showcase 70 property photos

## Development

This website is built with Jekyll and designed to be hosted on GitHub Pages.

### Local Development

To run the site locally:

1. Make sure you have Ruby and Bundler installed
2. Run `bundle install` to install dependencies
3. Run `bundle exec jekyll serve` to start the local server
4. Visit `http://localhost:4000` in your browser

### Deployment

To deploy to GitHub Pages:

1. Push your changes to GitHub
2. Enable GitHub Pages in your repository settings
3. The site will be available at `https://yourusername.github.io/repositoryname`

## Customization

### Adding Images

1. Place your images in the `assets/images/` directory
2. Update the `_data/gallery.yml` file with references to your images
3. Make sure to set a featured image at `assets/images/featured.jpg`
4. Add thumbnail images as `assets/images/thumb1.jpg`, `assets/images/thumb2.jpg`, etc.

### Updating Content

1. Edit the Markdown files in the language directories (`en`, `fr`, `de`, `it`)
2. Update property details, prices, and contact information
3. Customize the CSS in `css/main.css` if needed

### Google Analytics

Replace the placeholder Google Analytics ID in `_layouts/default.html` with your actual ID.

## License

All rights reserved. This website and its content are not available for reuse.