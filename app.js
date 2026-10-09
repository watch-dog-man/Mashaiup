/* ============================================================
   Mashaiup — frontend controller
   ============================================================ */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ---------- i18n ---------- */
const i18n = {
  vi: {
    subtitle: "Phòng mix tự động · phân tích · ghép nhịp · master",
    selectMusic: "Chọn nhạc của bạn",
    selectMusicDesc: "Trỏ AI tới một thư mục. Nó sẽ quét đệ quy tìm file nhạc.",
    chooseFolder: "Chọn thư mục chứa nhạc",
    browseFolder: "Duyệt thư mục…",
    uploadFolder: "Tải lên thư mục",
    pathPlaceholder: "…hoặc dán đường dẫn thư mục",
    scan: "Quét",
    mixDirection: "Hướng mix",
    mixDirectionDesc: "Tùy chọn — các giá trị mặc định đã được thiết lập sẵn.",
    energyJourney: "Hành trình năng lượng",
    rising: "Tăng dần", wave: "Sóng", peak: "Đỉnh", steady: "Đều", windDown: "Hạ dần",
    transLength: "Độ dài chuyển tiếp / hòa trộn",
    fxIntensity: "Cường độ hiệu ứng",
    harmPriority: "Ưu tiên hòa âm",
    mixLengthLabel: "Thời lượng mix mục tiêu",
    auto: "Tự động",
    useEveryTrack: "0 = dùng tất cả bài",
    preserveQuality: "Giữ chất lượng",
    aggressiveRemix: "Remix mạnh",
    halfTrack: "Cắt nửa bài lặp",
    tipHalfTrack: "Tự động phát hiện bài có cấu trúc lặp (A-B-A-B) và chỉ chơi nửa đầu, mix sớm sang bài tiếp theo",
    halfTrackBadge: "½",
    presetAuto: "AI tự chọn",
    presetParty: "Tiệc tùng",
    presetChill: "Thư giãn",
    presetWorkout: "Tập gym",
    presetRoadtrip: "Đường dài",
    presetHint: "Chọn phong cách — AI tự điều chỉnh tất cả. Hoặc chỉnh tay bên dưới.",
    vocalBadgeTip: "Phát hiện đoạn có vocal — AI tự tránh mix chồng lời",
    reorderHint: "Kéo ⠿ để đổi thứ tự bài. AI sẽ tự lên kế hoạch lại.",
    reordering: "Đang sắp xếp lại…",
    reorderFailed: "Sắp xếp lại thất bại:",
    exportTracklist: "Xuất tracklist",
    copyTracklist: "Sao chép",
    downloadImage: "Tải ảnh",
    copiedTracklist: "Đã sao chép tracklist!",
    previewingTransitions: "Nghe thử chuyển tiếp",
    previewBtn: "Nghe thử",
    previewTip: "Nghe thử đoạn chuyển tiếp này (~12 giây)",
    previewLoading: "Đang render…",
    previewFailed: "Không render được preview:",
    previewHint: "Bấm ▶ để nghe thử từng đoạn chuyển tiếp. Hài lòng thì bấm nút bên dưới.",
    confirmRender: "Xác nhận & Render bản mix",
    outputFormat: "Định dạng xuất",
    generateMix: "Tạo bản mix",
    working: "Đang xử lý…",
    startingEngine: "Đang khởi động.",
    stageScan: "Quét", stageMetadata: "Metadata", stageAnalysis: "Phân tích",
    stagePlan: "Lên kế hoạch", stageTransitions: "Chuyển tiếp",
    stagePreview: "Nghe thử", stageRender: "Dựng mix", stageFinalise: "Hoàn tất",
    elapsed: "đã trôi qua", remaining: "còn lại",
    detectedTracks: "Bài nhạc đã phát hiện",
    detectedTracksDesc: "BPM, tông, năng lượng và phong cách được trích xuất từng bài.",
    aiSet: "Set nhạc của Mashaiup",
    mixReady: "Bản mix đã sẵn sàng",
    dlWav: "Tải WAV", dlMp3: "Tải MP3",
    footer: "Chạy cục bộ · riêng tư · không gì rời khỏi máy bạn. Xây dựng với librosa · Rubber Band · PyTorch · FastAPI.",
    ready: "Sẵn sàng",
    openingPicker: "Đang mở…",
    noFolderChosen: "Chưa chọn thư mục.",
    pickerUnavailable: "Không mở được — hãy dán đường dẫn thay thế.",
    enterPathFirst: "Nhập đường dẫn thư mục trước.",
    tracks: "bài",
    readyToMix: "sẵn sàng mix",
    needTwoPlus: "Cần 2+ bài",
    uploading: "Đang tải lên {0} file…",
    uploadedLocal: "đã tải lên workspace",
    uploadFailed: "Tải lên thất bại: ",
    selectFolderFirst: "Chọn thư mục nhạc trước.",
    mixing: "Đang mix…",
    couldNotStart: "Không thể bắt đầu: ",
    scanningFolder: "Đang quét thư mục",
    readingMetadata: "Đang đọc metadata",
    analysingTracks: "Đang phân tích bài nhạc",
    planningSet: "Đang lên kế hoạch set nhạc",
    designingTransitions: "Đang thiết kế chuyển tiếp",
    renderingMix: "Đang dựng bản mix",
    finalising: "Đang hoàn tất",
    complete: "Hoàn thành",
    error: "Lỗi",
    mixFailed: "Mix thất bại. Kiểm tra logs.",
    done: "Xong",
    backendUnreachable: "Không kết nối được backend — hãy chạy server (xem README).",
    dragDropHint: "Kéo thả không đọc được đường dẫn — dùng Duyệt hoặc Tải lên.",
    untitled: "Không tên",
    unknown: "Không rõ",
    noClip: "không clip", noNaN: "không NaN", validSR: "SR hợp lệ",
    reloadable: "tải lại được", lengthOk: "độ dài OK",
    scanning: "Đang quét…",
    selectAll: "Chọn tất cả",
    deselectAll: "Bỏ chọn tất cả",
    selected: "đã chọn",
    pickTracksTitle: "Chọn bài nhạc để mix",
    pickTracksDesc: "Bấm vào bài nhạc để chọn hoặc bỏ chọn. Cần ít nhất 2 bài.",
    duration: "Thời lượng",
    bpmTitle: "Phân tích BPM",
    bpmDesc: "Kéo ⠿ để sắp xếp thứ tự mix. Chọn BPM mục tiêu — tất cả bài sẽ được chỉnh về cùng tốc độ.",
    analyzingBpm: "Đang phân tích BPM...",
    targetBpm: "BPM mục tiêu",
    bpmAuto: "Tự động",
    bpmAutoHint: "Tự động = AI tự chọn BPM tối ưu cho từng chuyển tiếp.",
    analyzeBpm: "Phân tích BPM",
    bpmMedian: "Trung vị",
    bpmSlowest: "Chậm nhất",
    bpmFastest: "Nhanh nhất",
    bpmRange: "Dải BPM",
    confidence: "độ tin cậy",
    tipEnergy: "Quyết định cảm giác tổng thể của bản mix — bắt đầu nhẹ rồi tăng dần, hay giữ đều từ đầu đến cuối.",
    tipRising: "Bắt đầu nhẹ nhàng, năng lượng tăng dần đến cao trào cuối bài. Phù hợp cho tiệc đang lên.",
    tipWave: "Năng lượng lên xuống theo sóng — có lúc bùng nổ, có lúc thả lỏng. Giữ người nghe không bị mệt.",
    tipPeak: "Tăng nhanh lên đỉnh giữa bài rồi hạ dần. Như một bữa tiệc có cao trào rõ ràng.",
    tipSteady: "Giữ năng lượng đều suốt bản mix. Phù hợp làm nhạc nền hoặc khi tập thể dục.",
    tipWindDown: "Bắt đầu mạnh rồi giảm dần. Phù hợp cho cuối buổi tiệc hoặc thư giãn.",
    tipTransLength: "Kéo sang trái = chuyển bài nhanh, rõ ràng. Kéo sang phải = hai bài hòa trộn vào nhau lâu hơn, mượt hơn.",
    tipFxIntensity: "Mức độ thêm hiệu ứng âm thanh (echo, filter, reverb) khi chuyển bài. Thấp = tự nhiên, cao = sáng tạo hơn.",
    tipHarmPriority: "Cao = ưu tiên sắp xếp bài theo tông nhạc hợp nhau (nghe hài hòa). Thấp = ưu tiên năng lượng và BPM hơn.",
    tipMixLength: "Giới hạn thời lượng bản mix. Để 0 = dùng tất cả bài nhạc, không giới hạn.",
    tipPreserveQuality: "Bật = giữ nguyên chất lượng âm thanh, hạn chế thay đổi tốc độ bài. Tắt = cho phép kéo giãn nhiều hơn.",
    tipAggressive: "Bật = cho phép cắt ghép mạnh tay hơn, thay đổi tốc độ lớn hơn. Bản mix sẽ sáng tạo hơn nhưng có thể kém tự nhiên.",
    tipOutputFormat: "WAV = chất lượng cao nhất, file lớn. MP3 = file nhỏ, dễ chia sẻ. Cả hai = xuất cả 2 định dạng.",
  },
  en: {
    subtitle: "Autonomous mix studio · analyse · beatmatch · master",
    selectMusic: "Select your music",
    selectMusicDesc: "Point the AI at a local folder. It scans recursively for audio.",
    chooseFolder: "Choose a folder of tracks",
    browseFolder: "Browse folder…",
    uploadFolder: "Upload folder",
    pathPlaceholder: "…or paste an absolute folder path",
    scan: "Scan",
    mixDirection: "Mix direction",
    mixDirectionDesc: "Optional — sensible defaults are already dialled in.",
    energyJourney: "Energy journey",
    rising: "Rising", wave: "Wave", peak: "Peak", steady: "Steady", windDown: "Wind down",
    transLength: "Transition length / blend",
    fxIntensity: "Effect intensity",
    harmPriority: "Harmonic priority",
    mixLengthLabel: "Target mix length",
    auto: "Auto",
    useEveryTrack: "0 = use every track",
    preserveQuality: "Preserve quality",
    aggressiveRemix: "Aggressive remix",
    halfTrack: "Half-track repeats",
    tipHalfTrack: "Auto-detect songs with repeating structure (A-B-A-B) and play only the first half, mixing out early into the next track",
    halfTrackBadge: "½",
    presetAuto: "AI picks",
    presetParty: "Party",
    presetChill: "Chill",
    presetWorkout: "Workout",
    presetRoadtrip: "Road trip",
    presetHint: "Pick a vibe — AI handles the rest. Or fine-tune below.",
    vocalBadgeTip: "Vocal sections detected — AI avoids overlapping vocals during transitions",
    reorderHint: "Drag ⠿ to reorder tracks. AI will re-plan transitions.",
    reordering: "Reordering…",
    reorderFailed: "Reorder failed:",
    exportTracklist: "Export tracklist",
    copyTracklist: "Copy",
    downloadImage: "Download image",
    copiedTracklist: "Tracklist copied!",
    previewingTransitions: "Preview transitions",
    previewBtn: "Preview",
    previewTip: "Listen to this transition (~12 seconds)",
    previewLoading: "Rendering…",
    previewFailed: "Preview render failed:",
    previewHint: "Press ▶ to preview each transition. When satisfied, confirm below.",
    confirmRender: "Confirm & Render full mix",
    outputFormat: "Output format",
    generateMix: "Generate the mix",
    working: "Working…",
    startingEngine: "Starting the engine.",
    stageScan: "Scan", stageMetadata: "Metadata", stageAnalysis: "Analyse",
    stagePlan: "Plan", stageTransitions: "Transitions",
    stagePreview: "Preview", stageRender: "Render", stageFinalise: "Finalise",
    elapsed: "elapsed", remaining: "remaining",
    detectedTracks: "Detected tracks",
    detectedTracksDesc: "BPM, key, energy and vibe extracted per track.",
    aiSet: "Mashaiup's set",
    mixReady: "Your mix is ready",
    dlWav: "Download WAV", dlMp3: "Download MP3",
    footer: "Local · private · nothing leaves your machine. Built with librosa · Rubber Band · PyTorch · FastAPI.",
    ready: "Ready",
    openingPicker: "Opening picker…",
    noFolderChosen: "No folder chosen.",
    pickerUnavailable: "Native picker unavailable — paste a path instead.",
    enterPathFirst: "Enter a folder path first.",
    tracks: "tracks",
    readyToMix: "ready to mix",
    needTwoPlus: "Need 2+ tracks",
    uploading: "Uploading {0} files…",
    uploadedLocal: "uploaded to local workspace",
    uploadFailed: "Upload failed: ",
    selectFolderFirst: "Select a music folder first.",
    mixing: "Mixing…",
    couldNotStart: "Could not start: ",
    scanningFolder: "Scanning folder",
    readingMetadata: "Reading metadata",
    analysingTracks: "Analysing tracks",
    planningSet: "Planning the set",
    designingTransitions: "Designing transitions",
    renderingMix: "Rendering the mix",
    finalising: "Finalising",
    complete: "Complete",
    error: "Error",
    mixFailed: "The mix failed. Check the logs.",
    done: "Done",
    backendUnreachable: "Backend not reachable — start the server (see README).",
    dragDropHint: "Drag-drop can't read folder paths — use Browse or Upload.",
    untitled: "Untitled",
    unknown: "Unknown",
    noClip: "no clip", noNaN: "no NaN", validSR: "valid SR",
    reloadable: "reloadable", lengthOk: "length ok",
    scanning: "Scanning…",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    selected: "selected",
    pickTracksTitle: "Pick tracks to mix",
    pickTracksDesc: "Click tracks to select or deselect. At least 2 required.",
    duration: "Duration",
    bpmTitle: "BPM Analysis",
    bpmDesc: "Drag ⠿ to reorder the mix. Choose a target BPM — all tracks will be time-stretched to match.",
    analyzingBpm: "Analysing BPM...",
    targetBpm: "Target BPM",
    bpmAuto: "Auto",
    bpmAutoHint: "Auto = AI picks optimal BPM for each transition.",
    analyzeBpm: "Analyse BPM",
    bpmMedian: "Median",
    bpmSlowest: "Slowest",
    bpmFastest: "Fastest",
    bpmRange: "BPM range",
    confidence: "confidence",
    tipEnergy: "Controls the overall feel of the mix — start chill and build up, or keep it steady throughout.",
    tipRising: "Starts soft, energy builds gradually to a high-energy finale. Great for a party that's heating up.",
    tipWave: "Energy rises and falls in waves — bursts of intensity with breathers in between. Keeps listeners engaged without fatigue.",
    tipPeak: "Ramps up quickly to a peak in the middle, then winds down. Like a party with a clear climax.",
    tipSteady: "Keeps energy consistent throughout the mix. Good for background music or workouts.",
    tipWindDown: "Starts strong and gradually eases off. Perfect for late-night sets or cooldowns.",
    tipTransLength: "Left = quick, sharp transitions between tracks. Right = longer, smoother blends where two tracks overlap.",
    tipFxIntensity: "How much sound effects (echo, filters, reverb) to add during transitions. Low = natural, high = more creative.",
    tipHarmPriority: "High = prioritise ordering tracks by compatible musical keys (sounds harmonious). Low = prioritise energy and BPM instead.",
    tipMixLength: "Cap the mix length. Set to 0 to use all tracks with no time limit.",
    tipPreserveQuality: "On = preserve audio quality, limit tempo changes. Off = allow more time-stretching for tighter beatmatching.",
    tipAggressive: "On = allow bolder cuts and bigger tempo pulls. More creative but may sound less natural.",
    tipOutputFormat: "WAV = highest quality, large file. MP3 = smaller file, easy to share. Both = export in both formats.",
  },
};

let currentLang = localStorage.getItem("aidj_lang") || "vi";

function tr(key) { return (i18n[currentLang] || i18n.vi)[key] || key; }

function applyLang() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18n[currentLang][key] != null) el.textContent = i18n[currentLang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (i18n[currentLang][key] != null) el.placeholder = i18n[currentLang][key];
  });
  document.querySelectorAll("[data-tip-key]").forEach((el) => {
    const key = el.getAttribute("data-tip-key");
    if (i18n[currentLang][key] != null) el.setAttribute("data-tip", i18n[currentLang][key]);
  });
  $("#langBtn").textContent = currentLang === "vi" ? "EN" : "VI";
  document.title = currentLang === "vi" ? "Mashaiup · Phòng Mix Tự Động" : "Mashaiup · Autonomous Mix Studio";
}

const state = {
  folder: null,
  running: false,
  startedAt: 0,
  serverElapsed: 0,
  eta: null,
  lastSync: 0,
  trackCount: 0,
  planRendered: false,
  scannedTracks: [],
  selectedPaths: new Set(),
  targetBpm: 0,
  bpmData: null,
  bpmOrder: [],
};

/* ---------- helpers ---------- */
function fmtTime(sec) {
  if (sec == null || isNaN(sec) || sec < 0) return "—";
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
function toast(msg, kind = "err") {
  const t = $("#toast");
  $("#toastMsg").textContent = msg;
  t.hidden = false;
  t.classList.toggle("ok", kind === "ok");
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => (t.hidden = true), 400);
  }, 5000);
}
function setStatus(text, cls) {
  $("#statusText").textContent = text;
  const dot = $("#statusDot");
  dot.className = "dot" + (cls ? " " + cls : "");
}
async function api(path, opts) {
  const r = await fetch(path, opts);
  if (!r.ok) {
    let m = r.statusText;
    try { m = (await r.json()).detail || m; } catch (e) {}
    throw new Error(m);
  }
  return r.json();
}

/* ---------- source selection ---------- */
$("#browseBtn").addEventListener("click", async () => {
  setStatus(tr("openingPicker"), "busy");
  try {
    const res = await api("/api/pick-folder", { method: "POST" });
    if (res.ok && res.folder) {
      setFolder(res.folder);
      quickScan(res.folder);
    } else {
      toast(res.error || tr("noFolderChosen"));
      setStatus(tr("ready"));
    }
  } catch (e) {
    toast(tr("pickerUnavailable"));
    setStatus(tr("ready"));
  }
});

$("#scanBtn").addEventListener("click", () => {
  const p = $("#folderPath").value.trim();
  if (!p) return toast(tr("enterPathFirst"));
  setFolder(p);
  quickScan(p);
});
$("#folderPath").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#scanBtn").click();
});
$("#folderPath").addEventListener("focus", () => {
  $("#folderPath").classList.remove("cached");
});

/* webkitdirectory upload fallback */
$("#folderUpload").addEventListener("change", async (e) => {
  const files = [...e.target.files].filter((f) =>
    /\.(mp3|wav|flac|m4a|aac|ogg|opus|aiff?|wma)$/i.test(f.name)
  );
  if (!files.length) return toast(tr("noFolderChosen"));
  setStatus(tr("uploading").replace("{0}", files.length), "busy");
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f, f.name));
  try {
    const res = await api("/api/upload", { method: "POST", body: fd });
    setFolder(res.folder);
    $("#scanCount").textContent = `${res.saved} ${tr("tracks")}`;
    $("#scanNote").textContent = tr("uploadedLocal");
    $("#scanSummary").hidden = false;
    setStatus(tr("ready"));
  } catch (err) {
    toast(tr("uploadFailed") + err.message);
    setStatus(tr("ready"), "err");
  }
});

function setFolder(path) {
  state.folder = path;
  $("#folderPath").value = path;
  $("#folderPath").classList.remove("cached");
  $("#generateBtn").disabled = false;
  $("#dropZone").classList.remove("drag");
  try { localStorage.setItem("aidj_lastFolder", path); } catch (e) {}
}

async function quickScan(folder) {
  setStatus(tr("scanning"), "busy");
  try {
    const res = await api("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    $("#scanCount").textContent = `${res.count} ${tr("tracks")}`;
    $("#scanNote").textContent = res.warnings.length
      ? res.warnings[0]
      : tr("readyToMix");
    $("#scanSummary").hidden = false;

    state.scannedTracks = res.tracks || [];
    state.selectedPaths = new Set();
    renderPicker();

    updateGenerateBtn();
    setStatus(res.count >= 2 ? tr("ready") : tr("needTwoPlus"), res.count >= 2 ? "" : "err");
  } catch (e) {
    toast(tr("scanning") + " " + e.message);
    setStatus(tr("ready"), "err");
  }
}

function renderPicker() {
  const list = $("#pickerList");
  list.innerHTML = "";
  const card = $("#pickerCard");
  if (!state.scannedTracks.length) { card.hidden = true; return; }
  card.hidden = false;
  state.scannedTracks.forEach((tk, i) => {
    const row = document.createElement("div");
    row.className = "pick-row" + (state.selectedPaths.has(tk.path) ? " picked" : "");
    row.dataset.path = tk.path;
    const dur = tk.duration ? fmtTime(tk.duration) : "?";
    row.innerHTML = `
      <span class="pick-check">${state.selectedPaths.has(tk.path) ? "✓" : ""}</span>
      <span class="pick-idx">${i + 1}</span>
      <span class="pick-name">${escapeHtml(tk.filename)}</span>
      <span class="pick-dur">${dur}</span>`;
    row.addEventListener("click", () => toggleTrack(tk.path, row));
    list.appendChild(row);
  });
  updateSelectedCount();
}

function toggleTrack(path, row) {
  if (state.selectedPaths.has(path)) {
    state.selectedPaths.delete(path);
    row.classList.remove("picked");
    row.querySelector(".pick-check").textContent = "";
  } else {
    state.selectedPaths.add(path);
    row.classList.add("picked");
    row.querySelector(".pick-check").textContent = "✓";
  }
  updateSelectedCount();
  updateGenerateBtn();
}

function updateSelectedCount() {
  const n = state.selectedPaths.size;
  const total = state.scannedTracks.length;
  $("#selectedCount").textContent = `${n}/${total} ${tr("selected")}`;
}

function updateGenerateBtn() {
  $("#generateBtn").disabled = state.selectedPaths.size < 2;
  clearTimeout(updateGenerateBtn._bpmTimer);
  if (state.selectedPaths.size >= 2) {
    updateGenerateBtn._bpmTimer = setTimeout(() => analyzeBpm(), 600);
  } else {
    $("#bpmCard").hidden = true;
  }
}

/* ---------- BPM analysis ---------- */
async function analyzeBpm() {
  const selected = [...state.selectedPaths];
  if (selected.length < 2) { $("#bpmCard").hidden = true; return; }

  $("#bpmCard").hidden = false;
  $("#bpmLoading").hidden = false;
  $("#bpmResults").hidden = true;

  try {
    const res = await api("/api/analyze-bpm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: selected }),
    });
    state.bpmData = res;
    state.bpmOrder = res.tracks.map((t) => t.path);
    renderBpmResults(res);
  } catch (e) {
    $("#bpmLoading").hidden = true;
    toast(tr("analyzingBpm") + " " + e.message);
  }
}

function renderBpmResults(data) {
  $("#bpmLoading").hidden = true;
  $("#bpmResults").hidden = false;

  const list = $("#bpmTrackList");
  list.innerHTML = "";
  data.tracks.forEach((tk, i) => {
    const row = document.createElement("div");
    row.className = "bpm-track-row";
    row.draggable = true;
    row.dataset.path = tk.path;
    const bpmVal = tk.bpm ? `${tk.bpm} BPM` : "?";
    const conf = tk.confidence ? `${Math.round(tk.confidence * 100)}% ${tr("confidence")}` : "";
    row.innerHTML = `
      <span class="bpm-drag">⠿</span>
      <span class="bpm-tk-idx">${i + 1}</span>
      <span class="bpm-tk-name">${escapeHtml(tk.filename)}</span>
      <span class="chip bpm">${bpmVal}</span>
      <span class="muted small">${conf}</span>`;
    row.addEventListener("dragstart", (e) => {
      row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", i.toString());
    });
    row.addEventListener("dragend", () => { row.classList.remove("dragging"); reorderBpmFromDOM(); });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const dragging = list.querySelector(".dragging");
      if (!dragging || dragging === row) return;
      const rect = row.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (e.clientY < mid) list.insertBefore(dragging, row);
      else list.insertBefore(dragging, row.nextSibling);
    });
    list.appendChild(row);
  });
  if (!list._dropBound) {
    list.addEventListener("dragover", (e) => e.preventDefault());
    list.addEventListener("drop", (e) => e.preventDefault());
    list._dropBound = true;
  }

  const presets = $("#bpmPresets");
  presets.innerHTML = "";

  const labelMap = { median: tr("bpmMedian"), slowest: tr("bpmSlowest"), fastest: tr("bpmFastest") };
  data.suggestions.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "btn subtle bpm-preset";
    btn.textContent = `${labelMap[s.label] || s.label} · ${s.bpm}`;
    btn.dataset.bpm = s.bpm;
    btn.addEventListener("click", () => selectBpm(s.bpm));
    presets.appendChild(btn);
  });

  selectBpm(0);
}

function selectBpm(bpm) {
  state.targetBpm = bpm;
  const input = $("#bpmCustom");
  if (bpm > 0) {
    input.value = bpm;
  } else {
    input.value = "";
  }
  $$(".bpm-preset").forEach((b) => {
    b.classList.toggle("active", +b.dataset.bpm === bpm && bpm > 0);
  });
  $("#bpmAutoBtn").classList.toggle("active", bpm === 0);
}

function reorderBpmFromDOM() {
  const rows = [...$$("#bpmTrackList .bpm-track-row")];
  rows.forEach((r, i) => { r.querySelector(".bpm-tk-idx").textContent = i + 1; });
  // store ordered paths for generate
  state.bpmOrder = rows.map((r) => r.dataset.path);
}

$("#bpmAutoBtn").addEventListener("click", () => selectBpm(0));
$("#bpmCustom").addEventListener("input", (e) => {
  const v = +e.target.value;
  state.targetBpm = v > 0 ? v : 0;
  $$(".bpm-preset").forEach((b) => b.classList.remove("active"));
  $("#bpmAutoBtn").classList.toggle("active", v <= 0);
});

/* drag & drop just captures a hint (browsers can't give real paths) */
const dz = $("#dropZone");
["dragover", "dragenter"].forEach((ev) =>
  dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("drag"); })
);
["dragleave", "drop"].forEach((ev) =>
  dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("drag"); })
);
dz.addEventListener("drop", () => toast(tr("dragDropHint"), "ok"));

/* button glow follows cursor */
$$(".btn").forEach((b) =>
  b.addEventListener("mousemove", (e) => {
    const r = b.getBoundingClientRect();
    b.style.setProperty("--mx", e.clientX - r.left + "px");
    b.style.setProperty("--my", e.clientY - r.top + "px");
  })
);

/* ---------- settings ---------- */
$("#settingsToggle").addEventListener("click", () => {
  $("#settingsBody").classList.toggle("collapsed");
  $("#settingsChev").classList.toggle("up");
});
function bindRange(id, out, fmt) {
  const el = $(id), o = $(out);
  const upd = () => {
    el.style.setProperty("--fill", el.value + "%");
    o.textContent = fmt(el.value);
  };
  el.addEventListener("input", upd);
  upd();
}
bindRange("#transIntensity", "#transOut", (v) => v + "%");
bindRange("#fxIntensity", "#fxOut", (v) => v + "%");
bindRange("#harmPriority", "#harmOut", (v) => v + "%");
bindRange("#mixLength", "#lenOut", (v) => (v === "0" ? tr("auto") : v + " min"));
$("#volume").style.setProperty("--fill", "90%");

$$(".segmented").forEach((seg) =>
  seg.querySelectorAll("button").forEach((btn) =>
    btn.addEventListener("click", () => {
      seg.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      seg.dataset.value = btn.dataset.v;
    })
  )
);

/* ---------- presets ---------- */
const PRESETS = {
  auto:     { energy: "rising",  trans: 55, fx: 45, harm: 60, len: 0, quality: true,  aggro: false, half: false },
  party:    { energy: "rising",  trans: 65, fx: 55, harm: 50, len: 0, quality: true,  aggro: false, half: true  },
  chill:    { energy: "wave",    trans: 70, fx: 25, harm: 80, len: 0, quality: true,  aggro: false, half: false },
  workout:  { energy: "flat",    trans: 35, fx: 60, harm: 35, len: 0, quality: false, aggro: true,  half: true  },
  roadtrip: { energy: "wave",    trans: 55, fx: 35, harm: 65, len: 0, quality: true,  aggro: false, half: false },
};

function applyPreset(name) {
  const p = PRESETS[name];
  if (!p) return;
  // energy curve
  const seg = $("#energyCurve");
  seg.dataset.value = p.energy;
  seg.querySelectorAll("button").forEach(b => {
    b.classList.toggle("on", b.dataset.v === p.energy);
  });
  // sliders
  const setSlider = (id, val) => {
    const el = $(id);
    el.value = val;
    el.dispatchEvent(new Event("input"));
  };
  setSlider("#transIntensity", p.trans);
  setSlider("#fxIntensity", p.fx);
  setSlider("#harmPriority", p.harm);
  setSlider("#mixLength", p.len);
  // toggles
  $("#preserveQuality").checked = p.quality;
  $("#aggressive").checked = p.aggro;
  $("#halfTrack").checked = p.half;
  // highlight active preset button
  $$(".preset-btn").forEach(b => b.classList.toggle("on", b.dataset.preset === name));
}

$$(".preset-btn").forEach(btn =>
  btn.addEventListener("click", () => applyPreset(btn.dataset.preset))
);

function collectSettings() {
  return {
    energy_curve: $("#energyCurve").dataset.value,
    transition_intensity: +$("#transIntensity").value / 100,
    effect_intensity: +$("#fxIntensity").value / 100,
    harmonic_priority: +$("#harmPriority").value / 100,
    target_minutes: +$("#mixLength").value,
    preserve_quality: $("#preserveQuality").checked,
    aggressive: $("#aggressive").checked,
    allow_half_tracks: $("#halfTrack").checked,
    output_format: $("#outFormat").dataset.value,
    target_bpm: state.targetBpm || 0,
  };
}

/* ---------- generate ---------- */
$("#generateBtn").addEventListener("click", async () => {
  if (!state.folder) return toast(tr("selectFolderFirst"));
  if (state.running) return;
  $("#generateBtn").disabled = true;
  resetUI();
  try {
    await api("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: state.folder,
        settings: collectSettings(),
        files: state.bpmOrder.length
          ? [...state.bpmOrder]
          : [...state.selectedPaths],
      }),
    });
    state.running = true;
    state.startedAt = performance.now();
    $("#progressCard").hidden = false;
    $("#progressCard").scrollIntoView({ behavior: "smooth", block: "start" });
    setStatus(tr("mixing"), "busy");
    startTimers();
    listenProgress();
  } catch (e) {
    toast(tr("couldNotStart") + e.message);
    $("#generateBtn").disabled = false;
    setStatus(tr("ready"), "err");
  }
});

function resetUI() {
  ["#tracksCard", "#planCard", "#resultCard"].forEach((s) => ($(s).hidden = true));
  $("#trackList").innerHTML = "";
  $("#journey").innerHTML = "";
  $("#warnings").innerHTML = "";
  $("#tracklistExport").hidden = true;
  state.trackCount = 0;
  state.planRendered = false;
  state.previewShown = false;
  state.lastTracklist = null;
  state.currentPlan = null;
  finishSuccess._done = false;
  if (poll._t) { clearInterval(poll._t); poll._t = null; }
  const a = $("#audio");
  if (a) { a.pause(); a.removeAttribute("src"); }
  if (typeof vizRAF !== "undefined") cancelAnimationFrame(vizRAF);
}

/* ---------- progress stream ---------- */
function listenProgress() {
  let ws;
  try {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${proto}://${location.host}/ws/progress`);
    ws.onmessage = (ev) => handleSnapshot(JSON.parse(ev.data));
    ws.onerror = () => { try { ws.close(); } catch (e) {} poll(); };
  } catch (e) {
    poll();
  }
}
function poll() {
  if (poll._t) return;
  poll._t = setInterval(async () => {
    try {
      const snap = await api("/api/progress");
      handleSnapshot(snap);
      if (snap.done) { clearInterval(poll._t); poll._t = null; }
    } catch (e) {}
  }, 500);
}

const STAGE_ORDER = ["scanning", "metadata", "analysis", "planning", "transitions", "previewing", "rendering", "finalizing"];

function handleSnapshot(snap) {
  // progress bar
  const pct = Math.round((snap.overall || 0) * 100);
  $("#progressFill").style.width = pct + "%";
  $("#progressPct").textContent = pct + "%";
  $("#progressMessage").textContent = snap.message || "";
  $("#progressStageTitle").textContent = titleForStage(snap.stage);

  // sync timers
  if (snap.elapsed != null) { state.serverElapsed = snap.elapsed; state.lastSync = performance.now(); }
  state.eta = snap.eta_seconds;

  // stage stepper
  const curIdx = STAGE_ORDER.indexOf(snap.stage);
  $$(".stage-chip").forEach((chip) => {
    const i = STAGE_ORDER.indexOf(chip.dataset.s);
    chip.classList.toggle("active", chip.dataset.s === snap.stage);
    chip.classList.toggle("past", curIdx > -1 && i < curIdx);
  });

  // warnings
  if (snap.warnings && snap.warnings.length) {
    $("#warnings").innerHTML = snap.warnings
      .map((w) => `<div class="warn-line">⚠ ${escapeHtml(w)}</div>`)
      .join("");
  }

  // tracks
  if (snap.tracks && snap.tracks.length > state.trackCount) {
    renderTracks(snap.tracks);
    state.trackCount = snap.tracks.length;
  }

  // plan
  if (snap.plan && snap.plan.transition_details && !state.planRendered) {
    renderPlan(snap.plan);
    state.planRendered = true;
  }

  // preview stage — show confirm button
  if (snap.stage === "previewing" && !state.previewShown) {
    state.previewShown = true;
    showPreviewControls();
  }

  if (snap.stage === "error" || snap.error) {
    finishError(snap.error || snap.message);
  } else if (snap.done && snap.result) {
    finishSuccess(snap.result);
  }
}

function titleForStage(s) {
  return {
    scanning: tr("scanningFolder"), metadata: tr("readingMetadata"),
    analysis: tr("analysingTracks"), planning: tr("planningSet"),
    transitions: tr("designingTransitions"), previewing: tr("previewingTransitions"),
    rendering: tr("renderingMix"), finalizing: tr("finalising"),
    complete: tr("complete"), error: tr("error"),
  }[s] || tr("working");
}

/* ---------- timers ---------- */
function startTimers() {
  cancelAnimationFrame(startTimers._raf);
  const tick = () => {
    if (!state.running) return;
    const localElapsed = state.serverElapsed + (performance.now() - state.lastSync) / 1000;
    $("#elapsedTimer").textContent = fmtTime(localElapsed);
    let eta = state.eta;
    if (eta != null) eta = Math.max(0, eta - (performance.now() - state.lastSync) / 1000);
    $("#etaTimer").textContent = eta == null ? "—" : fmtTime(eta);
    startTimers._raf = requestAnimationFrame(tick);
  };
  tick();
}

/* ---------- track list ---------- */
function renderTracks(tracks) {
  $("#tracksCard").hidden = false;
  $("#trackCountPill").textContent = tracks.length;
  const list = $("#trackList");
  for (let i = state.trackCount; i < tracks.length; i++) {
    const t = tracks[i];
    const row = document.createElement("div");
    row.className = "track-row";
    row.style.animationDelay = (i - state.trackCount) * 0.04 + "s";
    row.innerHTML = `
      <span class="tr-idx">${i + 1}</span>
      <div class="tr-main">
        <div class="tr-title">${escapeHtml(t.title || i18n[currentLang].untitled)}</div>
        <div class="tr-artist">${escapeHtml(t.artist || i18n[currentLang].unknown)}${t.genre ? " · " + escapeHtml(t.genre) : ""}${(t.mood_tags && t.mood_tags.length) ? " · " + escapeHtml(t.mood_tags.slice(0, 2).join(", ")) : ""}</div>
      </div>
      <div class="tr-meta">
        <span class="chip bpm">${t.bpm ? t.bpm.toFixed(0) : "?"} BPM</span>
        <span class="chip key">${t.camelot || "?"}</span>
        <span class="chip">E ${Math.round((t.energy || 0) * 100)}</span>
        ${t.has_repeat ? `<span class="chip half" title="${tr("tipHalfTrack")} (${Math.round(t.repeat_score * 100)}%)">${tr("halfTrackBadge")} ${Math.round(t.half_point)}s</span>` : ""}
        ${t.vocal_regions && t.vocal_regions.length ? `<span class="chip vocal" title="${tr("vocalBadgeTip")}">🎤 ${t.vocal_regions.length}</span>` : ""}
        <div class="spark">${sparkline(t.energy_curve)}</div>
      </div>`;
    list.appendChild(row);
  }
}
function sparkline(curve) {
  if (!curve || !curve.length) return "";
  const step = Math.max(1, Math.floor(curve.length / 16));
  let bars = "";
  for (let i = 0; i < curve.length; i += step) {
    const h = Math.max(6, Math.min(100, curve[i] * 100));
    bars += `<i style="height:${h}%"></i>`;
  }
  return bars;
}

/* ---------- plan / journey ---------- */
function renderPlan(plan) {
  $("#planCard").hidden = false;
  $("#planSummary").textContent =
    `${plan.n_tracks} tracks · ${plan.energy_style} energy · ~${Math.round(plan.est_duration / 60)} min`;
  const jr = $("#journey");
  jr.innerHTML = "";
  state.currentPlan = plan;
  const tracks = plan.tracks || [];
  const trans = plan.transition_details || [];
  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.idx = i;
    const td = trans[i];
    li.innerHTML = `
      <span class="j-drag-handle" title="${tr("reorderHint")}">⠿</span>
      <div class="j-title">${i + 1}. ${escapeHtml(t.title)} <span class="chip bpm">${t.bpm} BPM</span> <span class="chip key">${t.camelot}</span></div>
      ${td ? `<div class="j-transition">
              <div class="j-reason">${escapeHtml(td.reason)}</div>
              <span class="j-tech">${td.technique} · ${td.overlap}s ${td.beatmatched ? "· beatmatched" : ""}</span>
              <button class="btn subtle j-preview-btn" data-idx="${i}" title="${tr("previewTip")}">▶ ${tr("previewBtn")}</button>
              <audio class="j-preview-audio" data-idx="${i}" preload="none"></audio>
            </div>` : ""}`;
    jr.appendChild(li);
  });
  // bind preview buttons
  jr.querySelectorAll(".j-preview-btn").forEach(btn => {
    btn.addEventListener("click", () => previewTransition(+btn.dataset.idx, btn));
  });
  bindJourneyDrag(jr);
}

async function previewTransition(idx, btn) {
  const audioEl = $(`.j-preview-audio[data-idx="${idx}"]`);
  if (!audioEl) return;
  // if already loaded and playing, toggle pause
  if (audioEl.src && !audioEl.paused) {
    audioEl.pause();
    btn.textContent = `▶ ${tr("previewBtn")}`;
    return;
  }
  if (audioEl.src && audioEl.paused && audioEl.currentTime > 0) {
    audioEl.play();
    btn.textContent = `⏸ ${tr("previewBtn")}`;
    return;
  }
  // fetch preview
  btn.disabled = true;
  btn.textContent = `⏳ ${tr("previewLoading")}`;
  try {
    const res = await api("/api/preview-transition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transition_index: idx }),
    });
    audioEl.src = res.url;
    audioEl.play();
    btn.textContent = `⏸ ${tr("previewBtn")}`;
    audioEl.onended = () => { btn.textContent = `▶ ${tr("previewBtn")}`; };
  } catch (e) {
    toast(tr("previewFailed") + " " + (e.message || ""));
    btn.textContent = `▶ ${tr("previewBtn")}`;
  }
  btn.disabled = false;
}

function showPreviewControls() {
  // add confirm button below the journey
  const plan = $("#planCard");
  if (plan.querySelector(".confirm-row")) return;
  const row = document.createElement("div");
  row.className = "confirm-row";
  row.innerHTML = `
    <p class="muted small">${tr("previewHint")}</p>
    <button class="btn generate confirm-render-btn" id="confirmRenderBtn">
      <span class="btn-glow"></span>
      <span>${tr("confirmRender")}</span>
    </button>`;
  plan.appendChild(row);
  plan.scrollIntoView({ behavior: "smooth", block: "end" });
  $("#confirmRenderBtn").addEventListener("click", confirmRender);
}

async function confirmRender() {
  const btn = $("#confirmRenderBtn");
  if (!btn) return;
  btn.disabled = true;
  btn.querySelector("span:last-child").textContent = tr("renderingMix");
  try {
    await api("/api/confirm-render", { method: "POST" });
  } catch (e) {
    toast(e.message || "Confirm failed");
    btn.disabled = false;
    btn.querySelector("span:last-child").textContent = tr("confirmRender");
  }
}

/* ---------- journey drag reorder ---------- */
function bindJourneyDrag(jr) {
  jr.querySelectorAll("li").forEach(li => {
    li.addEventListener("dragstart", (e) => {
      li.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", li.dataset.idx);
    });
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      reorderJourneyFromDOM(jr);
    });
    li.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const dragging = jr.querySelector(".dragging");
      if (!dragging || dragging === li) return;
      const rect = li.getBoundingClientRect();
      const after = e.clientY > rect.top + rect.height / 2;
      if (after) li.after(dragging); else li.before(dragging);
    });
  });
  if (!jr._dropBound) {
    jr.addEventListener("dragover", (e) => e.preventDefault());
    jr.addEventListener("drop", (e) => e.preventDefault());
    jr._dropBound = true;
  }
}

async function reorderJourneyFromDOM(jr) {
  const items = [...jr.querySelectorAll("li")];
  const newOrder = items.map(li => +li.dataset.idx);
  const isIdentity = newOrder.every((v, i) => v === i);
  if (isIdentity) return;
  // update indices display
  items.forEach((li, i) => {
    const title = li.querySelector(".j-title");
    if (title) title.textContent = title.textContent.replace(/^\d+\./, `${i + 1}.`);
  });
  // call backend to re-plan
  const confirmBtn = $("#confirmRenderBtn");
  if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.querySelector("span:last-child").textContent = tr("reordering"); }
  try {
    const res = await api("/api/reorder-journey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    state.planRendered = false;
    renderPlan(res.plan);
    state.planRendered = true;
    if (state.previewShown) showPreviewControls();
  } catch (e) {
    toast(tr("reorderFailed") + " " + (e.message || ""));
  }
  if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.querySelector("span:last-child").textContent = tr("confirmRender"); }
}

/* ---------- tracklist export ---------- */
function fmtTimestamp(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function buildTracklistText(tracklist, duration) {
  const date = new Date().toLocaleDateString();
  let text = `Mashaiup Mix — ${date}\n`;
  text += "─".repeat(40) + "\n";
  tracklist.forEach(t => {
    const idx = String(t.index).padStart(2, "0");
    const time = fmtTimestamp(t.start);
    const artist = t.artist && t.artist !== "Unknown" ? ` — ${t.artist}` : "";
    text += `${idx}. ${time}  ${t.title}${artist}  (${t.bpm} BPM, ${t.camelot})\n`;
  });
  text += "─".repeat(40) + "\n";
  text += `Total: ${fmtTimestamp(duration)} · ${tracklist.length} tracks\n`;
  return text;
}

function copyTracklist() {
  const tl = state.lastTracklist;
  if (!tl) return;
  const text = buildTracklistText(tl.tracks, tl.duration);
  navigator.clipboard.writeText(text).then(() => toast(tr("copiedTracklist")));
}

function downloadTracklistImage() {
  const tl = state.lastTracklist;
  if (!tl) return;
  const tracks = tl.tracks;
  const lineH = 32, padX = 32, padY = 28;
  const headerH = 60, footerH = 44;
  const w = 640;
  const h = headerH + tracks.length * lineH + footerH + padY * 2;
  const canvas = document.createElement("canvas");
  const dpr = 2;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#0a0b1a"); bg.addColorStop(1, "#12132a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  // header
  ctx.fillStyle = "#fff"; ctx.font = "bold 20px Inter, system-ui, sans-serif";
  ctx.fillText("Mashaiup Mix", padX, padY + 24);
  ctx.fillStyle = "#888"; ctx.font = "13px Inter, system-ui, sans-serif";
  ctx.fillText(new Date().toLocaleDateString() + ` · ${tracks.length} tracks · ${fmtTimestamp(tl.duration)}`, padX, padY + 46);

  // divider
  const lineY = headerH + padY;
  const grd = ctx.createLinearGradient(padX, 0, w - padX, 0);
  grd.addColorStop(0, "#7c5cff"); grd.addColorStop(1, "#21d4fd");
  ctx.strokeStyle = grd; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(padX, lineY); ctx.lineTo(w - padX, lineY); ctx.stroke();

  // tracks
  tracks.forEach((t, i) => {
    const y = lineY + 10 + (i + 1) * lineH;
    const time = fmtTimestamp(t.start);
    ctx.fillStyle = "#7c5cff"; ctx.font = "bold 13px SF Mono, Consolas, monospace";
    ctx.fillText(time, padX, y);
    ctx.fillStyle = "#e0e0e0"; ctx.font = "600 13px Inter, system-ui, sans-serif";
    const title = t.title.length > 35 ? t.title.slice(0, 33) + "…" : t.title;
    ctx.fillText(title, padX + 62, y);
    const artist = t.artist && t.artist !== "Unknown" ? t.artist : "";
    if (artist) {
      ctx.fillStyle = "#888"; ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.fillText(artist.length > 20 ? artist.slice(0, 18) + "…" : artist, padX + 340, y);
    }
    ctx.fillStyle = "#21d4fd"; ctx.font = "11px SF Mono, Consolas, monospace";
    ctx.fillText(`${t.bpm} BPM`, w - padX - 110, y);
    ctx.fillStyle = "#ff5edb"; ctx.fillText(t.camelot, w - padX - 36, y);
  });

  // footer
  ctx.fillStyle = "#555"; ctx.font = "10px Inter, system-ui, sans-serif";
  ctx.fillText("Generated by Mashaiup", padX, h - 14);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "mashaiup_tracklist.png";
    a.click(); URL.revokeObjectURL(url);
  });
}

/* ---------- finish ---------- */
function finishError(msg) {
  state.running = false;
  setStatus(tr("error"), "err");
  $("#generateBtn").disabled = false;
  toast(msg || tr("mixFailed"));
}
function finishSuccess(result) {
  if (finishSuccess._done) return;
  finishSuccess._done = true;
  state.running = false;
  setStatus(tr("done"), "");
  $("#statusDot").className = "dot";
  $("#generateBtn").disabled = false;
  $("#progressFill").style.width = "100%";
  $("#progressPct").textContent = "100%";
  $$(".stage-chip").forEach((c) => c.classList.add("past"));
  showResult(result);
  setTimeout(() => setStatus(tr("ready")), 1500);
}

function showResult(result) {
  const card = $("#resultCard");
  card.hidden = false;
  const fname = (p) => p.split(/[/\\]/).pop();
  const wavUrl = "/outputs/" + fname(result.wav);
  const mp3Url = result.mp3 ? "/outputs/" + fname(result.mp3) : null;
  $("#resultMeta").textContent =
    `${fmtTime(result.duration)} · ${result.n_tracks} tracks · ${result.lufs} LUFS · peak ${result.peak_dbfs} dBFS · rendered in ${result.elapsed || "?"}s`;

  // store tracklist for export
  if (result.tracklist) {
    state.lastTracklist = { tracks: result.tracklist, duration: result.duration };
  }

  const audio = $("#audio");
  audio.src = mp3Url || wavUrl;
  $("#dlWav").href = wavUrl;
  const mp3 = $("#dlMp3");
  if (mp3Url) { mp3.href = mp3Url; mp3.style.display = ""; }
  else mp3.style.display = "none";

  // integrity check badges
  const cb = $("#checkBadges");
  cb.innerHTML = "";
  const checks = result.checks || {};
  [[tr("noClip"), checks.no_clip], [tr("noNaN"), checks.no_nan],
   [tr("validSR"), checks.sr_ok], [tr("reloadable"), checks.reloadable],
   [tr("lengthOk"), checks.duration_ok]].forEach(([label, ok]) => {
    const b = document.createElement("span");
    b.className = "cbadge" + (ok ? "" : " fail");
    b.textContent = (ok ? "✓ " : "✕ ") + label;
    cb.appendChild(b);
  });

  // tracklist export
  if (result.tracklist && result.tracklist.length) {
    const tlCard = $("#tracklistExport");
    tlCard.hidden = false;
    $("#tracklistText").textContent = buildTracklistText(result.tracklist, result.duration);
    $("#copyTracklistBtn").onclick = copyTracklist;
    $("#dlTracklistImg").onclick = downloadTracklistImage;
  }

  card.scrollIntoView({ behavior: "smooth", block: "center" });
  setupPlayer();
}

/* ---------- custom audio player + visualizer ---------- */
let audioCtx, analyser, sourceNode, vizRAF;
function setupPlayer() {
  const audio = $("#audio");
  const playBtn = $("#playBtn");
  const playIcon = $("#playIcon");
  const seekTrack = $("#seekTrack");
  const seekFill = $("#seekFill");

  playBtn.onclick = async () => {
    if (!audioCtx) initViz(audio);
    if (audioCtx.state === "suspended") await audioCtx.resume();
    if (audio.paused) audio.play(); else audio.pause();
  };
  audio.onplay = () => { playIcon.innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'; drawViz(); };
  audio.onpause = () => { playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; };
  audio.onloadedmetadata = () => { $("#durTime").textContent = fmtTime(audio.duration); };
  audio.ontimeupdate = () => {
    const p = audio.currentTime / (audio.duration || 1);
    seekFill.style.width = p * 100 + "%";
    $("#curTime").textContent = fmtTime(audio.currentTime);
  };
  seekTrack.onclick = (e) => {
    const r = seekTrack.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  };
  const vol = $("#volume");
  vol.oninput = () => { audio.volume = vol.value / 100; vol.style.setProperty("--fill", vol.value + "%"); };
  audio.volume = vol.value / 100;
}

function initViz(audio) {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    sourceNode = audioCtx.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  } catch (e) { console.warn("viz init failed", e); }
}
function drawViz() {
  const canvas = $("#viz");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const resize = () => { canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; };
  resize();
  const bins = analyser ? analyser.frequencyBinCount : 64;
  const data = new Uint8Array(bins);
  const render = () => {
    if ($("#audio").paused) { cancelAnimationFrame(vizRAF); return; }
    vizRAF = requestAnimationFrame(render);
    if (analyser) analyser.getByteFrequencyData(data);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const n = 64, w = canvas.width / n;
    for (let i = 0; i < n; i++) {
      const v = analyser ? data[Math.floor(i * bins / n)] / 255 : Math.random() * 0.5;
      const h = Math.max(2 * dpr, v * canvas.height * 0.92);
      const x = i * w, y = (canvas.height - h) / 2;
      const g = ctx.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, "#21d4fd"); g.addColorStop(1, "#7c5cff");
      ctx.fillStyle = g;
      const r = Math.min(w * 0.35, h / 2);
      roundRect(ctx, x + w * 0.18, y, w * 0.64, h, r);
      ctx.fill();
    }
  };
  render();
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------- util ---------- */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- track picker controls ---------- */
$("#selectAllBtn").addEventListener("click", () => {
  state.selectedPaths = new Set(state.scannedTracks.map((t) => t.path));
  $$(".pick-row").forEach((r) => { r.classList.add("picked"); r.querySelector(".pick-check").textContent = "✓"; });
  updateSelectedCount();
  updateGenerateBtn();
});
$("#deselectAllBtn").addEventListener("click", () => {
  state.selectedPaths.clear();
  $$(".pick-row").forEach((r) => { r.classList.remove("picked"); r.querySelector(".pick-check").textContent = ""; });
  updateSelectedCount();
  updateGenerateBtn();
});

/* ---------- language toggle ---------- */
$("#langBtn").addEventListener("click", () => {
  currentLang = currentLang === "vi" ? "en" : "vi";
  localStorage.setItem("aidj_lang", currentLang);
  applyLang();
  if (!state.running) setStatus(tr("ready"));
});

/* ---------- floating tooltip ---------- */
(function initTooltips() {
  const tip = document.createElement("div");
  tip.className = "tip-float";
  tip.style.display = "none";
  document.body.appendChild(tip);
  let hideTimer = null;

  function show(el) {
    const key = el.getAttribute("data-tip-key");
    const text = el.getAttribute("data-tip") || (i18n[currentLang] || {})[key];
    if (!text) return;
    clearTimeout(hideTimer);
    tip.textContent = text;
    tip.style.display = "block";
    const r = el.getBoundingClientRect();
    let top = r.bottom + 8;
    let left = r.left;
    if (left + 320 > window.innerWidth) left = window.innerWidth - 330;
    if (left < 10) left = 10;
    if (top + tip.offsetHeight > window.innerHeight) top = r.top - tip.offsetHeight - 8;
    tip.style.top = top + "px";
    tip.style.left = left + "px";
  }
  function hide() { hideTimer = setTimeout(() => { tip.style.display = "none"; }, 120); }

  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest("[data-tip-key]");
    if (el) show(el); else hide();
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("[data-tip-key]")) hide();
  });
})();

/* boot */
applyLang();
setStatus(tr("ready"));
api("/api/health").catch(() =>
  toast(tr("backendUnreachable"))
);

// restore last used folder
try {
  const lastFolder = localStorage.getItem("aidj_lastFolder");
  if (lastFolder) {
    $("#folderPath").value = lastFolder;
    $("#folderPath").classList.add("cached");
    state.folder = lastFolder;
  }
} catch (e) {}
