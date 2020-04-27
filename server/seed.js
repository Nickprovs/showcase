const { Article } = require("./models/article");
const { ArticleCategory } = require("./models/articleCategory");
const { Software } = require("./models/software");
const { SoftwareCategory } = require("./models/softwareCategory");
const { PhotoModel } = require("./models/photo");
const { PhotoCategoryModel } = require("./models/photoCategory");
const { VideoModel } = require("./models/video");
const { VideoCategoryModel } = require("./models/videoCategory");

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const config = require("config");
const moment = require("moment");

const data = {
  articles: [
    {
      category: { name: "Science and Technology", slug: "science-and-technology" },
      items: [
        {
          slug: "is-google-taking-over",
          title: "Is Google Taking Over?",
          description: "What's the deal with google?.",
          image:
            "https://storage.googleapis.com/gd-wagtail-prod-assets/images/evolving_google_identity_2x.max-4000x2000.jpegquality-90.jpg",
          body: "I think google is taking over and it's so crazy. Wow.",
          tags: ["is", "google", "taking", "over", "alphabet"],
        },
        {
          slug: "will-microsoft-make-it-in-the-cloud",
          title: "Will microsoft make it in the cloud?",
          description: "What's the deal with microsft?.",
          image: "https://3er1viui9wo30pkxh1v2nh4w-wpengine.netdna-ssl.com/wp-content/uploads/2016/05/Microsoft-Logo-2012.jpg",
          body: "I think microsoft is going to make it in the cloud. Wow.",
          tags: ["is", "microsoft", "make", "cloud", "windows"],
        },
        {
          slug: "how-cool-is-reddit",
          title: "How Cool Is Reddit!?",
          description: "Reddit is just so damn cool...",
          image: "https://miro.medium.com/max/3840/1*e3E0OQzfYCuWk0pket5dAA.png",
          body: "I think reddit is do cool. It's such a fun website. Wow.",
          tags: ["how", "cool", "is", "reddit", "website"],
        },
        {
          slug: "amazon-robots-become-sentient",
          title: "The Amazon Robots Have Become Sentient",
          description: "And their sick of moving boxes...",
          image: "https://singularityhub.com/wp-content/uploads/2017/02/amazon-robots-1068x600.jpg",
          body: "Them amazon bots be pissed.",
          tags: ["amazon", "robots", "sentient", "pissed", "warehouse"],
        },
        {
          slug: "stack-overflow-overflows",
          title: "Stack Overflow Is Full",
          description: "They full up.",
          image: "https://jessehouwing.net/content/images/size/w2000/2018/07/stackoverflow-1.png",
          body: "THEY SO FULL!",
          tags: ["stack", "overflow", "overflows"],
        },
        {
          slug: "apple-releases-smart-socks",
          title: "Apple Releases Smart Socks",
          description: "They apparently get cold unless you're connected to wifi.",
          image: "https://as-images.apple.com/is/og-default?wid=1200&hei=630&fmt=jpeg",
          body: "They come is rose gold and silver!",
          tags: ["apple", "releases", "socks"],
        },
      ],
    },
    {
      category: { name: "Music", slug: "music" },
      items: [
        {
          slug: "hozier-is-this-decades-goat",
          title: "Hozier Is This Decade's Goat",
          description: "TAKE US TO CHURCH BOI.",
          image: "https://www.grammy.com/sites/com/files/styles/image_landscape_hero/public/hozier-hero-467855840.jpg",
          body: "Hozier is just so good. I love his music. Take us to the church. Wow.",
          tags: ["hozier", "is", "good", "great"],
        },
        {
          slug: "king-krule-is-getting-more-depressing-with-each-new-album",
          title: "King Krule is getting more depressing with each new album",
          description: "Why is he such a sad boi?",
          image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Melt-2013-King_Krule-16.jpg",
          body: "King Krule is truly one of the saddest bois out there.",
          tags: ["king", "krule", "sad", "boi", "aaargh"],
        },
        {
          slug: "thom-yorke-becomes-painter-like-jim-carrey",
          title: "Thom Yorke Becomes Painter Like Jim Carrey",
          description: "Thom Yorke's decided to throw in with the painting lot.",
          image: "https://i.redd.it/6t3zljhof4j11.jpg",
          body: "Thom Yorke decides on being a painty painter. WOWWW!",
          tags: ["thom", "yorke", "painter", "art", "oil"],
        },
        {
          slug: "my-chemical-romance-are-making-a-comeback",
          title: "My Chemical Romance are Making a Comeback!",
          description: "They're doing the stuff and the things.",
          image: "https://consequenceofsound.net/wp-content/uploads/2020/01/My-Chemical-Romance-photo-by-Pooneh-Ghana-.png",
          body: "My Chemical Romance is ready to pounce on them fools.",
          tags: ["my", "chemical", "romance", "comeback", "emo"],
        },
        {
          slug: "the-new-strokes-album-is-sci-fi",
          title: "The New Strokes Album is Sci Fi",
          description: "Bleep Bloop.",
          image: "https://consequenceofsound.net/wp-content/uploads/2020/02/The-Strokes.jpg",
          body: "The Strokes? More like the strokemos.",
          tags: ["the", "strokes", "sci", "fi", "scifi"],
        },
        {
          slug: "mf-doom-comes-out-with-new-album-about-cats",
          title: "MF DOOM Comes Out With New Album About Cats",
          description: "MEOWEMDOOM",
          image: "https://swordsswords.com/blog/wp-content/uploads/2018/10/masks-swordsswords.png",
          body: "Best get ready for it. MEOW ATTACK.",
          tags: ["mf", "doom", "cat", "album"],
        },
      ],
    },
  ],
  software: [
    {
      category: { name: "Web", slug: "web" },
      items: [
        {
          slug: "ascii-art-automation-with-ascmii",
          title: "ASCII art automation with ASCMII",
          description: "A website built for visualizing your stuff in ascii!",
          addressableHighlight: {
            label: "View App",
            address: "www.ascmii.com",
          },
          image: "https://www.w3resource.com/w3r_images/python-basic-image-exercise-86.png",
          body: "This is a project for making ascii art! It's made with react. Wow!",
          tags: ["ascii", "art", "automation", "react"],
        },
        {
          slug: "your-own-spotify-universe-with-spotimon",
          title: "Your Own Spotify Universe with Spotimon",
          description: "Visualize your tunes.",
          addressableHighlight: {
            label: "View App",
            address: "www.spotimon.com",
          },
          image: "https://cdn.worldsciencefestival.com/wp-content/uploads/2019/04/EYES_IN_THE_SKIES-800x494.jpg",
          body: "A website built for visualizing your spotify with a universe analogy. It's made with react. Wow!",
          tags: ["spotify", "universe", "visualizer", "react"],
        },
      ],
    },
    {
      category: { name: "Games", slug: "games" },
      items: [
        {
          slug: "the-ballpit-experience",
          title: "The Ballpit Experience",
          description: "The best ballpit experience ever.",
          image: "https://live.staticflickr.com/171/398197114_b3c605240a_b.jpg",
          body: "A game in which you dodge the bad balls and eat the good balls to get power ups! Made with python.",
          tags: ["ball", "pit", "ballpit", "python"],
        },
      ],
    },
  ],
  photos: [
    {
      category: { name: "Portrait", slug: "portrait" },
      items: [
        {
          title: "Dog Photo Brown",
          description: "A photo of a browndog.",
          orientation: "portrait",
          displaySize: "medium",
          source: "https://s3.amazonaws.com/newpyl/pyl_showcase/11459791713040416.jpg",
          tags: ["brown", "dog", "doggo", "mammal", "canine"],
        },
        {
          title: "Dog Photo Black",
          description: "A photo of a dog.",
          orientation: "portrait",
          displaySize: "medium",
          source: "https://mymodernmet.com/wp/wp-content/uploads/2017/08/black-dog-portraits-shaina-fishman-2.jpg",
          tags: ["black", "dog", "doggo", "mammal", "canine"],
        },
        {
          title: "Cat Photo Orange",
          description: "A photo of an orange cat.",
          orientation: "portrait",
          displaySize: "medium",
          source: "https://www.splendidbeast.com/wp-content/uploads/2017/10/Regal-Cat-resized.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Portrait 1",
          description: "A photo of a switzerland thing.",
          orientation: "portrait",
          displaySize: "small",
          source: "https://i.pinimg.com/originals/5b/ac/b9/5bacb9333e171aa89e0a01fff3f9a60f.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
      ],
    },
    {
      category: { name: "Landscape", slug: "landscape" },
      items: [
        {
          title: "Swiss Landscape 1",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "medium",
          source: "https://cdn.pixabay.com/photo/2019/08/29/20/10/lake-4439929_960_720.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 2",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "medium",
          source: "https://previews.123rf.com/images/ncaimages/ncaimages1402/ncaimages140200019/25640198-swiss-landscape-switzerland.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 4",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "large",
          source: "https://wallpaperaccess.com/full/144954.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 5",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "large",
          source: "https://www.olgafinearts.com/wp-content/gallery/switzerland-landscape/SWZ-OL-810_0902.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 6",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source:
            "https://www.presetpro.com/wp-content/uploads/2019/05/Landscape-Photography-Velley-Road-in-Luaterbrunnen-Switzerland-1024x683.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 6",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source:
            "https://www.presetpro.com/wp-content/uploads/2019/05/Landscape-Photography-Velley-Road-in-Luaterbrunnen-Switzerland-1024x683.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 7",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source: "https://remakebox.com/wp-content/uploads/2019/12/7bis.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 8",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source:
            "https://www.build-green.fr/wp-content/uploads/2017/02/Vue-densemble-illumin%C3%A9-Grange-par-Savioz-Fabrizzi-Praz-de-fort-Suisse.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 9",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source: "https://www.architectes-toulouse.com/images/image_projet_97928.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
        {
          title: "Swiss Landscape 10",
          description: "A photo of a swiss landscape.",
          orientation: "panorama",
          displaySize: "medium",
          source:
            "https://previews.123rf.com/images/somatuscani/somatuscani1110/somatuscani111000170/11064849-grindelwald-village-panorama-switzerland.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"],
        },
      ],
    },
  ],
  videos: [
    {
      category: { name: "Life", slug: "life" },
      items: [
        {
          title: "Tree Fiddy",
          description: "A film by the incredible Drew Network.",
          markup: `<iframe src="https://player.vimeo.com/video/138343914" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`,
          tags: ["tree", "fiddy", "life"],
        },
        {
          title: "Kittens",
          description: "A video that took about tree fiddy to make.",
          markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/OE2snz8_BnE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
          tags: ["drew", "network", "kittens"],
        },
        {
          title: "Sicily",
          description: "A video by Lorenz Hideyoshi",
          markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/MIuD7B8ys2o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
          tags: ["sicily", "lorenz", "hideyoshi"],
        },
        {
          title: "A Drop in the Ocean",
          description: "A film by the incredible Kendy Ty.",
          markup: `<iframe src="https://player.vimeo.com/video/94390460" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
          <p><a href="https://vimeo.com/94390460">A Drop In The Ocean - Shortfilm</a> from <a href="https://vimeo.com/kendyty">Kendy</a> on <a href="https://vimeo.com">Vimeo</a>.</p>`,
          tags: ["drop", "in", "ocean", "kendy", "ty"],
        },
        {
          title: "NYC",
          description: "A film by Paul Tkachenko.",
          markup: `<iframe src="https://player.vimeo.com/video/276083030" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
          <p><a href="https://vimeo.com/276083030">NYC (Panasonic GH5)</a> from <a href="https://vimeo.com/paultkachenko">Paul Tkachenko</a> on <a href="https://vimeo.com">Vimeo</a>.</p>`,
          tags: ["nyc", "paul", "tkachenko"],
        },
        {
          title: "Biking in Paris",
          description: "A film by Leonard Raaf.",
          markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/Zl50J5cyta0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
          tags: ["biking", "in", "paris"],
        },

        {
          title: "New Zealand",
          description: "A film by Iswan Arif.",
          markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/2ABPmCElIGw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
          tags: ["new", "zealand", "iswan"],
        },
        {
          title: "Better Cartoon Show",
          description: "A film by Toonami.",
          markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/qKmZaCmAR6I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
          tags: ["better", "cartoon", "show"],
        },
        {
          title: "Samurai Champloo Opening",
          description: "This is the show's opening.",
          markup: `<iframe width="560" height="315" src="https://www.youtube.com/embed/Eq6EYcpWB_c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
          tags: ["samurai", "champloo", "opening"],
        },
        {
          title: "Coming Home",
          description: "A film by dooster.",
          markup: `<iframe src="https://player.vimeo.com/video/406878212?title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
          <p><a href="https://vimeo.com/406878212">COMING HOME - Ag Teacht Abhaile</a> from <a href="https://vimeo.com/dooster">Dooster</a> on <a href="https://vimeo.com">Vimeo</a>.</p>`,
          tags: ["coming", "home", "dooster"],
        },
      ],
    },
  ],
};

async function saveCollection(data, MainModel, CategoryModel) {
  for (let dataItem of data) {
    const category = await new CategoryModel({ ...dataItem.category }).save();
    const items = dataItem.items.map((item) => ({
      ...item,
      category: category,
    }));
    await MainModel.insertMany(items);
  }
}

async function seed() {
  try {
    const connection = await mongoose.connect(config.get("db"), { useNewUrlParser: true, useUnifiedTopology: true });
    await connection.connection.db.dropDatabase();
    await saveCollection(data.articles, Article, ArticleCategory);
    await saveCollection(data.software, Software, SoftwareCategory);
    await saveCollection(data.photos, PhotoModel, PhotoCategoryModel);
    await saveCollection(data.videos, VideoModel, VideoCategoryModel);
  } catch (ex) {
    console.log(ex);
  } finally {
    mongoose.disconnect();
  }
}

seed();
