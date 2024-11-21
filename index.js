(() => {
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;
  const VIDEO_WIDTH = 640;
  const VIDEO_HEIGHT = 480;

  /**
   * @type {(HTMLCanvasElement | null)}
   */
  let canvas = null;
  /**
   * @type {(HTMLVideoElement | null)}
   */
  let video = null;
  /**
   * @type {(HTMLButtonElement | null)}
   */
  let buttonSnap = null;
  /**
   * @type {(HTMLSelectElement | null)}
   */
  let camerasSelect = null;
  /**
   * @type {(HTMLImageElement | null)}
   */
  let picture = null;
  let cameras = [];

  function init() {
    canvas = /** @type {HTMLCanvasElement} */ (
      document.getElementById("canvas")
    );
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    video = /** @type {HTMLVideoElement} */ (document.getElementById("video"));
    if (!video) {
      console.error("Video element not found");
      return;
    }
    video.width = VIDEO_WIDTH;
    video.height = VIDEO_HEIGHT;

    camerasSelect = /** @type {HTMLSelectElement} */ (
      document.getElementById("cameras")
    );
    buttonSnap = /** @type {HTMLButtonElement} */ (
      document.getElementById("snap")
    );

    picture = /** @type {HTMLImageElement} */ (
      document.getElementById("photo")
    );

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      });

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      cameras = devices.filter((device) => device.kind === "videoinput");
      cameras.forEach((camera, index) => {
        const option = document.createElement("option");
        option.value = camera.deviceId;
        option.text = camera.label || `Camera ${index + 1}`;
        camerasSelect.appendChild(option);
      });
    });

    camerasSelect.addEventListener("change", (event) => {
      const deviceId = event.target.value;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: {
              exact: deviceId,
            },
          },
          audio: false,
        })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        });
    });

    buttonSnap.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      if (!context) {
        console.error("Canvas context not found");
        return;
      }
      context.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const data = canvas.toDataURL("image/png");
      picture.setAttribute("src", data);
    });
  }

  window.addEventListener("load", init, false);
})();
