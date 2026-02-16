the below test worked:

# Media Move Test

This is a test document for moving media elements.

## Image 1 - Red

![Red Square](https://placehold.co/300x200/ff0000/white?text=RED+IMAGE+1)

Some text between images.

## Image 2 - Blue

![Blue Square](https://placehold.co/300x200/0000ff/white?text=BLUE+IMAGE+2)

More text here.

## Image 3 - Green

![Green Square](https://placehold.co/300x200/00ff00/black?text=GREEN+IMAGE+3)

Final text.

## Instructions

Right-click on any colored image above to:
- Move Up/Down
- Move to Top/Bottom
- Jump to Code
- Delete Media

Each image has a distinct color so you can track which one moved!



the below test DIDNT work:

# Image Embed Test

This is a normal Markdown paragraph before the images.

<img
  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
  alt="Desert Road"
  width="400"
/>

Some text between images to force separation.

<img
  src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg"
  alt="Mountain Landscape"
  width="400"
/>

More text again.

<img
  src="https://picsum.photos/id/1015/800/500"
  alt="Random Landscape"
  width="400"
/>

End of document.


console of the failed test:

19:49:53.507 main.js:3474 Right-clicked on media: <img src=​"https:​/​/​picsum.photos/​id/​1015/​800/​500" alt=​"Random Landscape" width=​"400" class=​"media-selected">​
19:49:53.508 main.js:3504 Media container: null
19:49:53.508 main.js:3505 Container tag: undefined
19:49:53.508 main.js:3506 Container data-source-line: undefined
19:49:53.508 main.js:3518 All media containers: 3
19:49:53.509 main.js:3520 Current index: -1
19:49:55.690 main.js:3474 Right-clicked on media: <img src=​"https:​/​/​images.unsplash.com/​photo-1500530855697-b586d89ba3ee?w=800" alt=​"Desert Road" width=​"400" class=​"media-selected">​
19:49:55.691 main.js:3504 Media container: null
19:49:55.691 main.js:3505 Container tag: undefined
19:49:55.691 main.js:3506 Container data-source-line: undefined
19:49:55.691 main.js:3518 All media containers: 3
19:49:55.691 main.js:3520 Current index: -1
19:49:57.642 main.js:3474 Right-clicked on media: <img src=​"https:​/​/​upload.wikimedia.org/​wikipedia/​commons/​3/​3f/​Fronalpstock_big.jpg" alt=​"Mountain Landscape" width=​"400" class=​"media-selected">​
19:49:57.642 main.js:3504 Media container: null
19:49:57.643 main.js:3505 Container tag: undefined
19:49:57.643 main.js:3506 Container data-source-line: undefined
19:49:57.643 main.js:3518 All media containers: 3
19:49:57.643 main.js:3520 Current index: -1
19:49:59.802 main.js:3474 Right-clicked on media: <img src=​"https:​/​/​picsum.photos/​id/​1015/​800/​500" alt=​"Random Landscape" width=​"400" class=​"media-selected">​
19:49:59.802 main.js:3504 Media container: null
19:49:59.802 main.js:3505 Container tag: undefined
19:49:59.803 main.js:3506 Container data-source-line: undefined
19:49:59.803 main.js:3518 All media containers: 3
19:49:59.803 main.js:3520 Current index: -1
19:50:01.371 main.js:3474 Right-clicked on media: <img src=​"https:​/​/​images.unsplash.com/​photo-1500530855697-b586d89ba3ee?w=800" alt=​"Desert Road" width=​"400" class=​"media-selected">​
19:50:01.371 main.js:3504 Media container: null
19:50:01.371 main.js:3505 Container tag: undefined
19:50:01.372 main.js:3506 Container data-source-line: undefined
19:50:01.372 main.js:3518 All media containers: 3
19:50:01.372 main.js:3520 Current index: -1
19:50:03.546 main.js:3474 Right-clicked on media: <img src=​"https:​/​/​picsum.photos/​id/​1015/​800/​500" alt=​"Random Landscape" width=​"400" class=​"media-selected">​
19:50:03.546 main.js:3504 Media container: null
19:50:03.546 main.js:3505 Container tag: undefined
19:50:03.546 main.js:3506 Container data-source-line: undefined
19:50:03.547 main.js:3518 All media containers: 3
19:50:03.547 main.js:3520 Current index: -1
