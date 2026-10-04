<div align="center">

# 🎧 Mashaiup — Phòng Mix Tự Động

**Trỏ vào thư mục nhạc → AI phân tích từng bài, lên kế hoạch set nhạc, ghép nhịp & hòa trộn với EQ + hiệu ứng, render ra bản mix liền mạch, master sẵn — tất cả chạy local, giao diện liquid-glass.**

librosa · Rubber Band · PyTorch · scipy · pyloudnorm · FastAPI

</div>

---

## Tính năng chính

- **Quét & phân tích tự động** — BPM, beat grid, tông nhạc (Camelot), năng lượng, danceability, vibe embedding
- **Phân tích BPM** — Tự động phát hiện BPM từng bài, gợi ý BPM mục tiêu, chỉnh tất cả về cùng tốc độ
- **Kéo thả sắp xếp** — Kéo ⠿ để thay đổi thứ tự mix trong phần BPM Analysis
- **Lên kế hoạch set nhạc** — Sắp xếp bài theo tempo, tông nhạc tương thích, vibe tương đồng, theo hành trình năng lượng (tăng dần / sóng / đỉnh / đều / hạ dần)
- **Beatmatch thông minh** — Chained constant-rate stretch (Rubber Band), giữ chất lượng, không có tempo jump giữa bài
- **EQ & hiệu ứng** — Bass-swap, filter sweep, echo throw, reverb, saturation, stereo glue
- **Master & render** — Loudness match → crossfade → normalize −14 LUFS → limiter → WAV 24-bit + MP3 320k
- **Giao diện song ngữ** — Tiếng Việt / English, tooltip giải thích từng setting
- **Nhớ thư mục** — Cache folder đã dùng, mở lại nhanh
- **Chạy local hoàn toàn** — Không upload gì lên internet

---

## Cài đặt & chạy

### Windows

```powershell
# 1. Cài Python 3.12+ và ffmpeg (nếu chưa có)
winget install Python.Python.3.12
winget install Gyan.FFmpeg

# 2. Tạo virtual environment
cd Mashaiup
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# 3. Kiểm tra (tùy chọn)
python validate.py

# 4. Chạy server
python run_server.py --open
# → Mở http://127.0.0.1:8000
```

### macOS / Linux

```bash
# 1. Cài ffmpeg + rubberband
# macOS:  brew install ffmpeg rubberband
# Ubuntu: sudo apt-get install ffmpeg rubberband-cli

# 2. Setup
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# 3. Chạy
python run_server.py --open
```

> Port mặc định là 8000. Đổi bằng `--port 8010` hoặc `PORT=8010`.

---

## Cách sử dụng

1. **Chọn thư mục nhạc** — Bấm "Duyệt thư mục" hoặc dán đường dẫn + Quét
2. **Chọn bài** — Bấm vào bài nhạc để chọn/bỏ chọn (cần ít nhất 2 bài)
3. **Sắp xếp & chọn BPM** — Kéo thả để đổi thứ tự, chọn BPM mục tiêu hoặc để Tự động
4. **Tùy chỉnh** *(tùy chọn)* — Hướng mix, cường độ hiệu ứng, ưu tiên hòa âm, định dạng xuất
5. **Tạo bản mix** — Theo dõi tiến trình real-time, xem phân tích từng bài và lý do chuyển tiếp
6. **Nghe & tải** — Player tích hợp với visualizer, tải WAV hoặc MP3

---

## Cách beatmatch hoạt động

- **Chained constant-rate**: Mỗi bài có 1 tỷ lệ playback cố định, bài liền kề chia sẻ tempo
- **Giới hạn stretch**: ±6% (bình thường) hoặc ±12% (aggressive) — không bao giờ kéo giãn quá mức
- **Khi tempo quá khác**: Không ép stretch xấu — chuyển sang filter-sweep + echo hoặc clean cut
- **Phrase-aligned**: Exit/entry snap vào ranh giới 8-bar phrase

---

## Cấu trúc dự án

```
Mashaiup/
├── app/                     # backend package
│   ├── config.py            # paths, audio constants, MixSettings
│   ├── audio_io.py          # float32 load/save, soxr resample, mp3 export
│   ├── scanner.py           # recursive discovery + validity probe
│   ├── beatgrid.py          # tempo / beats / downbeats / phrases
│   ├── key_detection.py     # Krumhansl key + Camelot compatibility
│   ├── features.py          # LUFS, energy, structure, danceability
│   ├── vibe_model.py        # GenreCNN wrapper + DSP-embedding fallback
│   ├── planner.py           # set ordering (cost matrix + 2-opt + energy curve)
│   ├── transition_engine.py # per-pair timing, beatmatch, technique, deck rates
│   ├── eq_engine.py         # bass-swap + adaptive transition EQ
│   ├── effects.py           # filters, echo, reverb, saturation, limiter
│   ├── render.py            # assemble, master, integrity-check the mix
│   ├── pipeline.py          # end-to-end job runner
│   └── api.py               # FastAPI app + WebSocket + static serving
├── models_weights/          # trained checkpoints (optional)
├── outputs/                 # rendered mixes + JSON reports
├── cache/                   # per-track analysis cache
├── index.html · style.css · app.js   # liquid-glass frontend
├── run_server.py · validate.py       # launchers
└── requirements.txt
```

---

## Models (tùy chọn)

| Model | Vai trò | Mặc định (không cần weights) | Nâng cấp |
|-------|---------|------------------------------|----------|
| **Vibe/Genre** | Genre tag + vibe embedding để sắp xếp set | DSP embedding (MFCC/chroma) | Train `model_1_genre_cnn.ipynb` |
| **Mood tagger** | Mood/instrument tags | Không có mood tags | Train `model_2_mood_tagger.ipynb` |
| **Danceability** | Danceability score + rhythm style | DSP pulse-clarity proxy | Train `model_3_danceability.ipynb` |

App chạy đầy đủ **không cần train model**. Xem `train_models/` để biết thêm.

---

## Đảm bảo chất lượng âm thanh

- Xử lý float32, render WAV lossless, chỉ 1 lần encode MP3
- Resample chất lượng cao (soxr VHQ), stretch giữ pitch (Rubber Band)
- Loudness match từng bài, equal-power crossfade, bass-swap EQ
- Look-ahead soft limiter (ceiling −0.3 dBFS), safety margin −1 dBFS
- Kiểm tra tự động: file tồn tại · không rỗng · không NaN · không clip · SR hợp lệ

---

## Xử lý sự cố

| Triệu chứng | Cách sửa |
|-------------|----------|
| MP3/m4a không decode | Cài **ffmpeg** vào PATH |
| Beatmatch hơi lệch | Bài quá khác tempo — bật **Remix mạnh** hoặc chọn bài cùng tempo hơn |
| "Cần 2+ bài" | Thư mục có <2 file nhạc ≥20s decode được |
| Folder picker không mở | Windows dùng PowerShell, macOS dùng AppleScript, Linux dùng zenity/kdialog. Dán path thay thế |
| Port 8000 bận | `python run_server.py --port 8010` |

Log: `logs/aidj.log` · Report: `outputs/<mix>_report.json`

---

## Tech Stack

- **Backend**: Python 3.12, FastAPI, librosa, pyrubberband, PyTorch, scipy, pyloudnorm
- **Frontend**: Vanilla HTML/CSS/JS, liquid-glass design, WebSocket progress streaming
- **Audio**: Rubber Band (time-stretch), soxr (resample), ffmpeg (decode/encode)

---

## License

Copyright © 2026. All Rights Reserved.

This repository is made available for portfolio, demonstration, and evaluation purposes only.
