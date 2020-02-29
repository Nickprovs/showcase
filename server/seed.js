const { Article } = require("./models/article");
const { ArticleCategory } = require("./models/articleCategory");
const { Software } = require("./models/software");
const { SoftwareCategory } = require("./models/softwareCategory");
const { Photo } = require("./models/photo");
const { PhotoCategory } = require("./models/photoCategory");

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const config = require("config");
const moment = require("moment");

const data = {
  articles: [
    {
      categoryName: "Science and Technology",
      items: [
        {
          slug: "is-google-taking-over",
          title: "Is Google Taking Over?",
          description: "What's the deal with google?.",
          image:
            "https://storage.googleapis.com/gd-wagtail-prod-assets/images/evolving_google_identity_2x.max-4000x2000.jpegquality-90.jpg",
          body: "I think google is taking over and it's so crazy. Wow.",
          tags: ["is", "google", "taking", "over", "alphabet"]
        },
        {
          slug: "will-microsoft-make-it-in-the-cloud",
          title: "Will microsoft make it in the cloud?",
          description: "What's the deal with microsft?.",
          image: "https://3er1viui9wo30pkxh1v2nh4w-wpengine.netdna-ssl.com/wp-content/uploads/2016/05/Microsoft-Logo-2012.jpg",
          body: "I think microsoft is going to make it in the cloud. Wow.",
          tags: ["is", "microsoft", "make", "cloud", "windows"]
        },
        {
          slug: "how-cool-is-reddit",
          title: "How Cool Is Reddit!?",
          description: "Reddit is just so damn cool...",
          image: "https://miro.medium.com/max/3840/1*e3E0OQzfYCuWk0pket5dAA.png",
          body: "I think reddit is do cool. It's such a fun website. Wow.",
          tags: ["how", "cool", "is", "reddit", "website"]
        }
      ]
    },
    {
      categoryName: "Music",
      items: [
        {
          slug: "hozier-is-this-decades-goat",
          title: "Hozier Is This Decade's Goat",
          description: "TAKE US TO CHURCH BOI.",
          image: "https://www.grammy.com/sites/com/files/styles/image_landscape_hero/public/hozier-hero-467855840.jpg",
          body: "Hozier is just so good. I love his music. Take us to the church. Wow.",
          tags: ["hozier", "is", "good", "great"]
        },
        {
          slug: "king-krule-is-getting-more-depressing-with-each-new-album",
          title: "King Krule is getting more depressing with each new album",
          description: "Why is he such a sad boi?",
          image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Melt-2013-King_Krule-16.jpg",
          body: "King Krule is truly one of the saddest bois out there.",
          tags: ["king", "krule", "sad", "boi", "aaargh"]
        }
      ]
    }
  ],
  software: [
    {
      categoryName: "Web",
      items: [
        {
          slug: "ascii-art-automation-with-ascmii",
          title: "ASCII art automation with ASCMII",
          description: "A website built for visualizing your stuff in ascii!",
          addressableHighlight: {
            label: "View App",
            address: "www.ascmii.com"
          },
          image: "https://www.w3resource.com/w3r_images/python-basic-image-exercise-86.png",
          body: "This is a project for making ascii art! It's made with react. Wow!",
          tags: ["ascii", "art", "automation", "react"]
        },
        {
          slug: "your-own-spotify-universe-with-spotimon",
          title: "Your Own Spotify Universe with Spotimon",
          description: "Visualize your tunes.",
          addressableHighlight: {
            label: "View App",
            address: "www.spotimon.com"
          },
          image: "https://cdn.worldsciencefestival.com/wp-content/uploads/2019/04/EYES_IN_THE_SKIES-800x494.jpg",
          body: "A website built for visualizing your spotify with a universe analogy. It's made with react. Wow!",
          tags: ["spotify", "universe", "visualizer", "react"]
        }
      ]
    },
    {
      categoryName: "Games",
      items: [
        {
          slug: "the-ballpit-experience",
          title: "The Ballpit Experience",
          description: "The best ballpit experience ever.",
          image: "https://live.staticflickr.com/171/398197114_b3c605240a_b.jpg",
          body: "A game in which you dodge the bad balls and eat the good balls to get power ups! Made with python.",
          tags: ["ball", "pit", "ballpit", "python"]
        }
      ]
    }
  ],
  photos: [
    {
      categoryName: "Portrait",
      items: [
        {
          title: "Dog Photo Brown",
          description: "A photo of a browndog.",
          orientation: "portrait",
          displaySize: "medium",
          source: "https://s3.amazonaws.com/newpyl/pyl_showcase/11459791713040416.jpg",
          tags: ["brown", "dog", "doggo", "mammal", "canine"]
        },
        {
          title: "Dog Photo Black",
          description: "A photo of a dog.",
          orientation: "portrait",
          displaySize: "medium",
          source: "https://mymodernmet.com/wp/wp-content/uploads/2017/08/black-dog-portraits-shaina-fishman-2.jpg",
          tags: ["black", "dog", "doggo", "mammal", "canine"]
        },
        {
          title: "Cat Photo Orange",
          description: "A photo of an orange cat.",
          orientation: "portrait",
          displaySize: "medium",
          source: "https://www.splendidbeast.com/wp-content/uploads/2017/10/Regal-Cat-resized.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Portrait 1",
          description: "A photo of a switzerland thing.",
          orientation: "portrait",
          displaySize: "small",
          source: "https://i.pinimg.com/originals/5b/ac/b9/5bacb9333e171aa89e0a01fff3f9a60f.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        }
      ]
    },
    {
      categoryName: "Landscape",
      items: [
        {
          title: "Swiss Landscape 1",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "medium",
          source: "https://cdn.pixabay.com/photo/2019/08/29/20/10/lake-4439929_960_720.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 2",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "medium",
          source: "https://previews.123rf.com/images/ncaimages/ncaimages1402/ncaimages140200019/25640198-swiss-landscape-switzerland.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 3",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "medium",
          source: "https://jakubpolomski.com/wp-content/uploads/2018/01/Switzerland-Landscape-Photo-Jakub-Polomski-12ALP0680.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 4",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "large",
          source: "https://wallpaperaccess.com/full/144954.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 5",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "large",
          source: "https://www.olgafinearts.com/wp-content/gallery/switzerland-landscape/SWZ-OL-810_0902.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 6",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source:
            "https://www.presetpro.com/wp-content/uploads/2019/05/Landscape-Photography-Velley-Road-in-Luaterbrunnen-Switzerland-1024x683.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 6",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source:
            "https://www.presetpro.com/wp-content/uploads/2019/05/Landscape-Photography-Velley-Road-in-Luaterbrunnen-Switzerland-1024x683.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 7",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source: "https://remakebox.com/wp-content/uploads/2019/12/7bis.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 8",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source:
            "https://www.build-green.fr/wp-content/uploads/2017/02/Vue-densemble-illumin%C3%A9-Grange-par-Savioz-Fabrizzi-Praz-de-fort-Suisse.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 9",
          description: "A photo of a swiss landscape.",
          orientation: "landscape",
          displaySize: "small",
          source: "https://www.architectes-toulouse.com/images/image_projet_97928.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        },
        {
          title: "Swiss Landscape 10",
          description: "A photo of a swiss landscape.",
          orientation: "panorama",
          displaySize: "medium",
          source:
            "https://previews.123rf.com/images/somatuscani/somatuscani1110/somatuscani111000170/11064849-grindelwald-village-panorama-switzerland.jpg",
          tags: ["swiss", "switzerland", "landscape", "nature"]
        }
      ]
    }
  ]
};

async function saveCollection(data, MainModel, CategoryModel) {
  for (let dataItem of data) {
    const { _id: categoryId } = await new CategoryModel({ name: dataItem.categoryName }).save();
    const items = dataItem.items.map(item => ({
      ...item,
      category: { _id: categoryId, name: dataItem.categoryName }
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
    await saveCollection(data.photos, Photo, PhotoCategory);
  } catch (ex) {
    console.log(ex);
  } finally {
    mongoose.disconnect();
  }
}

seed();
