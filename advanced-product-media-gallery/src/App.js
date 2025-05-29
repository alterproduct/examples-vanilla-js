const responseApi = [
  // Array containing different media types (image, video, 3D viewer) for product previews
  {
    type: 'img',
    urlThumb: './assets/tshirt/black/image_0_thumb.png',
    urlContent: './assets/tshirt/black/image_0_big.png',
    alt: 'T-Shirt front',
  },
  {
    type: 'img',
    urlThumb: './assets/tshirt/black/image_1_thumb.png',
    urlContent: './assets/tshirt/black/image_1_big.png',
    alt: 'T-Shirt back',
  },
  {
    type: 'video',
    urlThumb: './assets/tshirt/black/image_2_thumb.png',
    urlContent: './assets/tshirt/black/image_0_big.png',
    alt: 'T-Shirt video thumbnail',
  },
  {
    type: 'viewer3D',
    urlThumb: './assets/tshirt/black/image_3_thumb.png',
    urlContent: './assets/tshirt/black/image_0_big.png',
    alt: 'T-Shirt 3D Viewer thumbnail',
  },
];

let selectedPreview = 0; // Tracks the currently selected preview index

function initialiseProduct() {
  const displayWrapper = document.getElementById('buttonsWrapper');
  responseApi.forEach((item, index) => {
    // Create a container for each preview button
    const elementContainer = document.createElement('div');
    elementContainer.className = 'buttonContainer';

    // Display the default selected media
    if (index === selectedPreview) {
      displayMedia(index, item.type);
    }

    // Append button container to the wrapper
    displayWrapper.appendChild(elementContainer);

    // Add click event listener to update the selected media
    elementContainer.addEventListener('click', function () {
      buttonClickHandler(this, index, item.type);
    });

    // Create and append thumbnail image
    const elementThumb = document.createElement('img');
    elementThumb.className = 'imgThumb';
    elementThumb.src = item.urlThumb;
    elementThumb.alt = item.alt;
    elementContainer.appendChild(elementThumb);

    // Add an icon overlay for video and 3D viewer types
    if (item.type === 'video') {
      const elementIcon = document.createElement('img');
      elementIcon.className = 'button-icon';
      elementIcon.src = './assets/icons/icon-play-video.svg';
      elementIcon.alt = 'Play video';
      elementContainer.appendChild(elementIcon);
    } else if (item.type === 'viewer3D') {
      const elementIcon = document.createElement('img');
      elementIcon.className = 'button-icon';
      elementIcon.src = './assets/icons/icon-3d.svg';
      elementIcon.alt = 'Open 3D Viewer';
      elementContainer.appendChild(elementIcon);
    }
  });
}

function buttonClickHandler(element, index, type) {
  if (selectedPreview === index) return; // Ignore clicks on already selected item

  selectedPreview = index; // Update selected preview index

  // Remove active class from all buttons
  document.querySelectorAll('#buttonsWrapper div').forEach((item) => {
    item.classList.remove('active');
  });

  element.classList.add('active'); // Highlight the selected button

  displayMedia(index, type); // Display the corresponding media
}

function adjustVideoSize(player, container) {
  function updateSize() {
    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const containerRatio = containerWidth / containerHeight;

    // Get native video dimensions
    const videoWidth = player.videoWidth();
    const videoHeight = player.videoHeight();
    const videoRatio = videoWidth / videoHeight;

    // Adjust video size to fit the container while maintaining aspect ratio
    if (videoRatio > containerRatio) {
      player.width(containerWidth);
      player.height(containerWidth / videoRatio);
    } else {
      player.height(containerHeight);
      player.width(containerHeight * videoRatio);
    }
  }

  // Adjust size when metadata is loaded (ensures we have correct dimensions)
  player.on('loadedmetadata', updateSize);

  // Adjust size when window resizes
  window.addEventListener('resize', updateSize);
}

function displayMedia(index, type) {
  const displayWrapper = document.getElementById('displayWrapper');
  if (displayWrapper) {
    const { type, urlContent, alt } = responseApi[index];

    if (type === 'img') {
      // Create and display an image element
      const img = Object.assign(document.createElement('img'), {
        src: urlContent,
        alt,
      });
      displayWrapper.replaceChildren(img);
    } else if (type === 'video') {
      // Create video element
      const video = Object.assign(document.createElement('video'), {
        id: 'my-video',
        className: 'video-js',
        loop: true,
        autoplay: true,
        muted: true,
        preload: 'auto',
      });
      video.setAttribute('data-setup', '{"asdf": true }');

      // Create and append video source
      const source = Object.assign(document.createElement('source'), {
        src: './assets/tshirt/black/video-360-loop-embeding.webm',
        type: 'video/webm',
      });

      // Create a fallback message for users with no JS support
      const noJsMessage = document.createElement('p');
      noJsMessage.className = 'vjs-no-js';
      noJsMessage.innerHTML = `
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">
          supports HTML5 video
        </a>
      `;

      // Append elements to the video tag
      video.appendChild(source, noJsMessage);

      // Replace previous content with the new video
      displayWrapper.replaceChildren(video);

      // Initialize Video.js and adjust video size
      if (window.videojs) {
        const player = videojs(video);
        adjustVideoSize(player, displayWrapper);
      } else {
        console.warn('Video.js is not loaded yet!');
      }
    } else if (type === 'viewer3D') {
      // Create and embed an iframe for 3D viewer
      const iframe = document.createElement('iframe');
      iframe.loading = 'lazy';
      iframe.title = 'Product Viewer';
      iframe.src = 'https://alterproduct.com/app/viewer/1';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      displayWrapper.replaceChildren(iframe);
    }
  }
}

initialiseProduct(); // Initialize product preview buttons
