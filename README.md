<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/nickprovs/showcase">
    <img src="_meta/images/logo.png" alt="Logo" width="256" height="256">
  </a>

  <h3 align="center">Showcase</h3>

  <p align="center">
    A full-stack solution to a personal portfolio with a built-in content management system.
    <br />
    <a href="https://github.com/nickprovs/showcase"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/nickprovs/showcase/issues">Submit a Bug</a>
    ·
    <a href="https://github.com/nickprovs/showcase/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->

## About The Project

I've always wanted to build my own corner of the internet. A digital "place for my stuff".
Showcase is my answer to that desire. It's an after-hours project I've been building for months.

It has an expansive feature set that a variety of users can leverage.

- Authentication: Two-Factor (w/ email) or Single-Factor Auth
- Integrated Content-Management System: Add, Edit, Delete, and Feature your content.
- Contact System: Receive messages from prospective users.
- Themeing: Change the entire site's theme (Background Image and Colors) on-the-fly.
- SEO
  - next.js provides server-side-rendering critical to seo.
  - All articles support user-defined slugs for your search-engine needs.
  - All content sections and articles have the appropriate meta tags
    - SEO is improved
    - Pages are shared to social media as a card (w/ title, preview image, etc.)
- General Versatility
  - Change the website's title
  - Change the website's footnote
  - Change whether or not certain sections are shown.
  - Add or omit desired social media links
- Content Sections
  - Featured (Home):
    - Top: A primary featured section is completely customizable via rich-text editor.
    - Bottom: Feature content from any section.
      - Can be done simply by toggling content from other sections.
      - Can change the display order of featured content.
  - Blog: A place to post your personal or business articles.
    - Interactive Rich Text Editor for creating your article via integrated tinyMce.
    - Displays articles in a simple, device optimized grid.
  - Photo: A place to post your photos.
    - Choose your desired display size and orientation for each photo
    - Photos for each paginated page will automatically be placed in a space-optimized css grid.
  - Media: A place to post embeddable stuff -- videos, music playlists, social media posts, etc.
    - Embed content from sources that you can whitelist via environment variable.
  - Portfolio: A place to post your professional content in an open-ended article format,
    - Ability to rename this section to whatever you want. In my case, I'd call it "Software"
    - Ability to hide this section if you simply want to use Showcase as a non-professional website.
- Common Content Section Features
  - Pagination: Pagination is implemented both client and server side.
  - Categories
  - Tags
  - Search
  - Hot Refresh (no page reload) when searching, changing category, or clicking tags.
  - Addressable Highlights: Adds named links to your content posts.
  - Sanitization: Places where user-generated content will be dangerously rendered are sanitized for malicious content.
    - Users can prevent their iframes/scripts from being sanitized by whitelisting their source in the environment configuration.

* Blog: Write

[![Product Name Screen Shot][product-screenshot]](https://example.com)

### Built With

- [next.js](https://github.com/vercel/next.js)
- [node.js](https://github.com/nodejs)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

```sh
npm install npm@latest -g
```

### Installation

1. Clone the showcase

```sh
git clone https://github.com/nickprovs/showcase.git
```

2. Install NPM packages

```sh
npm install
```

<!-- USAGE EXAMPLES -->

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/nickprovs/showcase/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the GNU GPLv3 License. See [License](LICENSE.md) for more information.

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

### Client

- [massively - design influences](https://html5up.net/massively)
- [isomorphic-unfetch - isomorphic fetch for next.js](https://github.com/developit/unfetch/tree/master/packages/isomorphic-unfetch)
- [@hapi/joi - validation](https://github.com/hapijs/joi)
- [tinymce - rich text editing](https://github.com/tinymce/tinymce)
- [DOMPurify - sanitization](https://github.com/cure53/DOMPurify)
- [fontawesome - icons](https://github.com/FortAwesome/react-fontawesome)
- [nookies - next.js cookie interaction](https://github.com/maticzav/nookies)
- [reframe.js - automatic iframe sizing](https://github.com/dollarshaveclub/reframe.js/blob/master/src/reframe.js)
- [text-encoding-shim - older browser text-encoding](https://gitlab.com/PseudoPsycho/text-encoding-shim)
- [reCAPTCHA v2 - turing test](https://developers.google.com/recaptcha/intro)

### Server

- [express - REST API tooling](https://github.com/expressjs/express)
- [cors - cross-origin resource sharing](https://github.com/expressjs/cors)
- [mongoose - mongodb interaction](https://github.com/Automattic/mongoose)
- [@hapi/joi - validation](https://github.com/hapijs/joi)
- [bcrypt - encryption](https://www.npmjs.com/package/bcrypt)
- [nodemailer - email](https://github.com/nodemailer/nodemailer)
- [isomorphic-dompurify - sanitization](https://github.com/kkomelin/isomorphic-dompurify)
- [reCAPTCHA v2 - turing test validation](https://developers.google.com/recaptcha/intro)
- [moment - date interaction](https://github.com/moment/moment)
- [node-fetch - server-side http requests](https://github.com/node-fetch/node-fetch)
- [config - environment configuration clearing house](https://github.com/lorenwest/node-config)
- [jest - automated testing](https://github.com/facebook/jest)
- [supertest - automated testing http assertions](https://github.com/visionmedia/supertest)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/nickprovs/showcase.svg?style=flat-square
[contributors-url]: https://github.com/nickprovs/showcase/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/nickprovs/showcase.svg?style=flat-square
[forks-url]: https://github.com/nickprovs/showcase/network/members
[stars-shield]: https://img.shields.io/github/stars/nickprovs/showcase.svg?style=flat-square
[stars-url]: https://github.com/nickprovs/Showcase/stargazers
[issues-shield]: https://img.shields.io/github/issues/nickprovs/Showcase.svg?style=flat-square
[issues-url]: https://github.com/nickprovs/Showcase/issues
[license-shield]: https://img.shields.io/github/license/nickprovs/Showcase.svg?style=flat-square
[license-url]: https://github.com/nickprovs/Showcase/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/nickprovs
[product-screenshot]: _meta/images/sample/light_theme_home.jpg
