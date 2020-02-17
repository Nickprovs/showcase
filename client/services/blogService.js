import asyncUtilities from "../util/asyncUtilities";

//Note: Use Isomorphic-Unfetch when actually making rest calls
//Unlike other http clients, it'll work on server and client

const previews = [
  {
    id: "193819391j",
    title: "The Dogs of Ein",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/023/453/030/large/andreas-rocha-wizardstower01.jpg"
  },
  {
    id: "11231o3io1j4",
    title: "The Homunculous Speaks",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/023/551/031/large/jiwoo-lee-jiwoo-padawan-fanart.jpg"
  },
  {
    id: "adkahd82822",
    title: "Them Bois Are Back In Town",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/023/723/551/small/ishmael-hoover-eaglewarrior3.jpg"
  },
  {
    id: "2492u4jskfs",
    title: "What It Do",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/002/912/664/small/andreas-rocha-thegathering.jpg"
  },
  {
    id: "123193udigjdkg",
    title: "What It Is",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/403/027/small/andreas-rocha-ill-tidings02.jpg"
  },
  {
    id: "19713901jksjd",
    title: "What's Big Is Small",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/000/085/508/small/Alm-Atias-Refuge.jpg"
  },
  {
    id: "90489104jskg",
    title: "Random Fandom",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/320/963/small/andreas-rocha-dangerousroads.jpg"
  },
  {
    id: "1398173hjsjgkh",
    title: "Speakasy Chicken Cheesy",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/001/058/155/large/mike-hill-002-front-view3-copy.jpg"
  },
  {
    id: "90149014ujskg",
    title: "Winds of Winnie The Pooh",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/286/213/small/sparth-firststrike-final.jpg"
  },
  {
    id: "4u289jdkgjkdg",
    title: "Cremativity",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/244/079/large/aaron-limonick-lake-vista-key-2-logo.jpg"
  },
  {
    id: "901904ujskgjs",
    title: "Hounds of Houndage",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/201/563/small/yuri-shwedoff-ellie-the-last-of-us.jpg"
  },
  {
    id: "183uskfjskgs",
    title: "Sue Mo Sumo",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/018/461/496/small/moero-knight-0005-magical-girls.jpg"
  },
  {
    id: "1984uskhjgkdg",
    title: "Elfs but Large",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/019/964/822/large/kyle-grech-spike.jpg"
  },
  {
    id: "1498udkghjdgkd",
    title: "Tigger in the House",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/017/735/130/large/ege-ozteke-champaloo.jpg"
  },
  {
    id: "193819391j",
    title: "The Dogs of Ein",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/023/453/030/large/andreas-rocha-wizardstower01.jpg"
  },
  {
    id: "11231o3io1j4",
    title: "The Homunculous Speaks",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/023/551/031/large/jiwoo-lee-jiwoo-padawan-fanart.jpg"
  },
  {
    id: "adkahd82822",
    title: "Them Bois Are Back In Town",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/023/723/551/small/ishmael-hoover-eaglewarrior3.jpg"
  },
  {
    id: "2492u4jskfs",
    title: "What It Do",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/002/912/664/small/andreas-rocha-thegathering.jpg"
  },
  {
    id: "123193udigjdkg",
    title: "What It Is",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/403/027/small/andreas-rocha-ill-tidings02.jpg"
  },
  {
    id: "19713901jksjd",
    title: "What's Big Is Small",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/000/085/508/small/Alm-Atias-Refuge.jpg"
  },
  {
    id: "90489104jskg",
    title: "Random Fandom",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/320/963/small/andreas-rocha-dangerousroads.jpg"
  },
  {
    id: "1398173hjsjgkh",
    title: "Speakasy Chicken Cheesy",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/001/058/155/large/mike-hill-002-front-view3-copy.jpg"
  },
  {
    id: "90149014ujskg",
    title: "Winds of Winnie The Pooh",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/286/213/small/sparth-firststrike-final.jpg"
  },
  {
    id: "4u289jdkgjkdg",
    title: "Cremativity",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/244/079/large/aaron-limonick-lake-vista-key-2-logo.jpg"
  },
  {
    id: "901904ujskgjs",
    title: "Hounds of Houndage",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdnb.artstation.com/p/assets/images/images/000/201/563/small/yuri-shwedoff-ellie-the-last-of-us.jpg"
  },
  {
    id: "183uskfjskgs",
    title: "Sue Mo Sumo",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/018/461/496/small/moero-knight-0005-magical-girls.jpg"
  },
  {
    id: "1984uskhjgkdg",
    title: "Elfs but Large",
    datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
    previewText: "This is some preview text. Ya dig?",
    previewImageSrc: "https://cdna.artstation.com/p/assets/images/images/019/964/822/large/kyle-grech-spike.jpg"
  }
];

export async function getBlogPreviewsAsync(options = null) {
  await asyncUtilities.setTimeoutAsync(200);
  let offset = 0;
  let limit = 7;

  if (options) {
    if (options.offset) offset = options.offset;
    if (options.limit) limit = options.limit;
  }

  try {
    return {
      previews: previews.slice(offset, offset + limit),
      total: previews.length
    };
  } catch (Error) {
    return {
      previews: [],
      total: previews.length
    };
  }
}
