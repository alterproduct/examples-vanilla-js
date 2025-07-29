document.addEventListener('DOMContentLoaded', function () {
  const player = videojs('my-video');

  player.ready(() => {
    const videoElement = document.getElementById('my-video');

    videoElement.addEventListener('mouseenter', () => {
      player.play();
    });

    videoElement.addEventListener('mouseleave', () => {
      player.pause();
    });
  });
});
