# NestJS Image Converter App

A full-stack monorepo project for converting images between formats (JPEG, PNG, WEBP, SVG) with quality retention, size prediction, and asynchronous processing using BullMQ.  
Built with **NestJS** (backend), **React** (frontend), **MongoDB Atlas**, **Cloudinary**, **BullMQ**/**Redis**, and **Sharp**.

---

## 🚀 Features

- **Image Upload:** Upload JPEG, PNG, WEBP, or SVG images.
- **Format Conversion:** Convert to JPEG, PNG, WEBP, or SVG (where possible).
- **Quality Settings:** Set compression/quality level for lossy formats (JPEG, WEBP).
- **Size Prediction:** Predict expected file size before conversion.
- **Async Processing:** Offload conversion tasks to background workers via BullMQ (Redis).
- **Job Status:** Query conversion progress and get download links for results.
- **Original Image Storage:** Store original images in Cloudinary, along with metadata in MongoDB Atlas.
- **History & Tracking:** Track all conversion jobs per user/session.
- **Modern UI:** Simple React-based interface for uploads, conversion options, job history, and download links.

---

## 🗂️ Folder Structure
```
nestjs-image-converter/
│
├── backend/ # NestJS API (image processing, job queue)
│ ├── src/
│ │ ├── app.module.ts
│ │ ├── main.ts
│ │ ├── images/ # Image upload, conversion, and routes
│ │ │ ├── images.controller.ts
│ │ │ ├── images.service.ts
│ │ │ ├── dto/
│ │ │ │ ├── convert-image.dto.ts
│ │ │ │ └── predict-size.dto.ts
│ │ │ ├── schemas/
│ │ │ │ └── image-job.schema.ts
│ │ │ └── interfaces/
│ │ │ └── image-job.interface.ts
│ │ ├── jobs/ # BullMQ job queue logic
│ │ │ ├── jobs.processor.ts
│ │ │ ├── jobs.module.ts
│ │ │ └── jobs.service.ts
│ │ ├── utils/ # Helper functions (size prediction, etc.)
│ │ └── config/ # Configuration (DB, Redis, Cloudinary)
│ ├── worker/ # BullMQ worker for background processing
│ │ └── worker.js
│ ├── .env
│ ├── package.json
│ └── ...
│
├── frontend/ # React app (user interface)
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── ...
│
├── .gitignore
├── README.md
└── ...
```
---

## 🛠️ Tech Stack

- **Backend:** [NestJS](https://nestjs.com/), [BullMQ](https://docs.bullmq.io/), [Sharp](https://sharp.pixelplumbing.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Cache/Queue:** [Redis](https://redis.com/) (free Redis Cloud instance)
- **File Storage:** [Cloudinary](https://cloudinary.com/)
- **Frontend:** [React](https://react.dev/) (TypeScript)
- **Other:** Docker (optional), Passport (optional for auth), Vercel/Render/Fly.io for deployment

---

## 🌐 Project Flow

1. **User uploads image** via frontend UI.
2. **Backend (NestJS)**:
    - Saves original image to Cloudinary.
    - Stores metadata in MongoDB.
    - Predicts possible output size based on requested format/quality.
    - Enqueues conversion job to BullMQ (Redis).
3. **Worker process** (Node.js):
    - Picks up job from queue.
    - Downloads original image, converts using Sharp (respects format/quality).
    - Uploads converted image to Cloudinary.
    - Updates job status/result/links in MongoDB.
4. **User checks job status** via frontend UI (polls backend).
5. **User downloads converted image** and sees size comparison/history.

---

## ✨ Planned Features

- [x] Image upload and conversion endpoint
- [x] Asynchronous processing with BullMQ
- [x] File size prediction before conversion
- [x] Quality/compression options for conversion
- [x] User authentication 
- [x] Drag-and-drop upload UI

---

## ⚡️ Quick Start

```bash
# In project root:
cd backend
npm install
# Add .env file with MongoDB, Redis, Cloudinary credentials

cd ../frontend
npm install
# Start React dev server as needed
