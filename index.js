(() => {
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;
  const VIDEO_WIDTH = 640;
  const VIDEO_HEIGHT = 480;

  /**
   * @type {(HTMLCanvasElement | null)} canvas
   */
  let canvas = null;
  /**
   * @type {(HTMLCanvasElement | null)} canvas
   */
  let video = null;
  /**
   * @type {(HTMLButtonElement | null)} buttonSnap
   */
  let buttonSnap = null;
  let camerasSelect = null;
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

    video = document.getElementById("video");
    if (!video) {
      console.error("Video element not found");
      return;
    }
    video.width = VIDEO_WIDTH;
    video.height = VIDEO_HEIGHT;

    camerasSelect = document.getElementById("cameras");
    buttonSnap = document.getElementById("snap");

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
      console.log(deviceId);
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
    });
  }

  window.addEventListener("load", init, false);
})();
