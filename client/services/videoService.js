import asyncUtilities from "../util/asyncUtilities";

//Note: Use Isomorphic-Unfetch when actually making rest calls
//Unlike other http clients, it'll work on server and client

export async function getVideosAsync() {
  await asyncUtilities.setTimeoutAsync(200);
  return {
    videos: [
      {
        title: "Epoch 1",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "landscape",
        size: "large",
        src: "https://cdna.artstation.com/p/assets/images/images/023/453/030/large/andreas-rocha-wizardstower01.jpg"
      },
      {
        title: "Epoch 2",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "portrait",
        size: "large",
        src: "https://cdnb.artstation.com/p/assets/images/images/023/551/031/large/jiwoo-lee-jiwoo-padawan-fanart.jpg"
      },
      {
        title: "Epoch 3",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "portrait",
        size: "large",
        src: "https://cdnb.artstation.com/p/assets/images/images/023/723/551/small/ishmael-hoover-eaglewarrior3.jpg"
      },
      {
        title: "Epoch 4",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "landscape",
        size: "medium",
        src: "https://cdna.artstation.com/p/assets/images/images/002/912/664/small/andreas-rocha-thegathering.jpg"
      },
      {
        title: "Epoch 5",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "portrait",
        size: "medium",
        src: "https://cdnb.artstation.com/p/assets/images/images/000/403/027/small/andreas-rocha-ill-tidings02.jpg"
      },
      {
        title: "Epoch 6",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "landscape",
        size: "medium",
        src: "https://cdna.artstation.com/p/assets/images/images/000/085/508/small/Alm-Atias-Refuge.jpg"
      },
      {
        title: "Epoch 7",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "landscape",
        size: "medium",
        src: "https://cdnb.artstation.com/p/assets/images/images/000/320/963/small/andreas-rocha-dangerousroads.jpg"
      },
      {
        title: "Epoch 8",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "portrait",
        size: "medium",
        src: "https://cdnb.artstation.com/p/assets/images/images/001/058/155/large/mike-hill-002-front-view3-copy.jpg"
      },
      {
        title: "Epoch 9",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "portrait",
        size: "medium",
        src: "https://cdnb.artstation.com/p/assets/images/images/000/286/213/small/sparth-firststrike-final.jpg"
      },
      {
        title: "Epoch 10",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "landscape",
        size: "medium",
        src: "https://cdnb.artstation.com/p/assets/images/images/000/244/079/large/aaron-limonick-lake-vista-key-2-logo.jpg"
      },
      {
        title: "Epoch 11",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "portrait",
        size: "medium",
        src: "https://cdnb.artstation.com/p/assets/images/images/000/201/563/small/yuri-shwedoff-ellie-the-last-of-us.jpg"
      },
      {
        title: "Epoch 12",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "portrait",
        size: "medium",
        src: "https://cdna.artstation.com/p/assets/images/images/018/461/496/small/moero-knight-0005-magical-girls.jpg"
      },
      {
        title: "Epoch 13",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "landscape",
        size: "medium",
        src: "https://cdna.artstation.com/p/assets/images/images/019/964/822/large/kyle-grech-spike.jpg"
      },
      {
        title: "Epoch 14",
        description: "This is some preview text. Ya dig?",
        datePosted: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        dateLastModified: "Thu Dec 29 2011 20:14:56 GMT-0600 (CST)",
        orientation: "landscape",
        size: "large",
        src: "https://cdna.artstation.com/p/assets/images/images/017/735/130/large/ege-ozteke-champaloo.jpg"
      }
    ]
  };
}
