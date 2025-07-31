# NestJS Image Converter App

A full-stack monorepo project for **converting images** between formats (JPEG, PNG, WEBP, SVG) with quality retention, instant previews, and async job processing using Bull + Redis.Built with NestJS (backend), React (frontend), MongoDB Atlas, Cloudinary, Bull (not BullMQ), and Sharp.

<img width="1902" height="856" alt="image" src="https://github.com/user-attachments/assets/35291091-650a-47ed-bf95-0cad0dcc77b7" />

---

## 🌀 How It Works
- User uploads image(s) from the React frontend.
- Frontend uploads images directly to Cloudinary (browser → Cloudinary, unsigned preset).
- Frontend sends the Cloudinary URL and metadata (name, format, session, etc.) to the NestJS backend.
- NestJS queues two parallel Bull jobs:
  - Save original image metadata to MongoDB.
  - Download original from Cloudinary, convert to target format with Sharp, and emit the result as a data URL via WebSocket (real-time to user).
- Frontend receives each converted image instantly via WebSocket and shows it with a download button.
- No converted images are saved to Cloudinary—only originals. Converted results are ephemeral and streamed to the user.

---
## 🚀 Features

- **Modern UI:** Playful, techy React design with drag-and-drop, real-time progress, and instant download.
- **Multi-image Upload:** Upload and queue multiple images at once.
- **Conversion:** Supports JPEG, PNG, WEBP, SVG (with quality options where supported).
- **Live Previews:** See converted images as soon as each finishes—no polling!
- **Download:** Download one or all converted images at once.
- **File Size Info:** Displays both original and converted image size.
- **Session-based Tracking:** Every upload is grouped by session for job management.
- **Robust Queue:** Bull-powered job queue for scalable conversion.
- ~~Quality settings for conversion (coming soon)~~
- ~~User authentication (coming soon)~~
- ~~Hosted demo (coming soon)~~

---

## 🗂️ Folder Structure
```
nestjs-image-converter/
│
├── backend/ # NestJS API (image processing, job queue)
│ ├── src/
│ │ ├── app.module.ts
│ │ ├── main.ts
│ │ ├── config/
│ │ │ ├── cloudinary.config.ts          # cloudinary configuration
│ │ ├── images/                         # Image upload, conversion, and routes
│ │ │ ├── images.controller.ts          # Accepts image meta, queues jobs
│ │ │ ├── images.service.ts             # Enqueues Bull jobs, DB logic
│ │ │ ├── images.module.ts              # Registers
│ │ ├── jobs/ # BullMQ job queue logic
│ │ │ ├── jobs.module.ts             # Registers Bull queues, exports
│ │ │ ├── convert.processor.ts       # Bull decorator for conversion
│ │ │ ├── write.processor.ts         # Bull decorator for DB write job
│ │ ├── events/
│ │ │ ├── events.gateway.ts     # WebSocket gateway for real-time emit
│ │ │ ├── events.module.ts      # registering
│ │ ├── prisma/
│ │ │ ├── prisma.service.ts     # Prisma (MongoDB) config
│ ├── .env
│ ├── package.json
│ └── ...
│
├── frontend/ # React app (user interface)
│ ├── src/
│ │ ├── components/
│ │ │ ├── sections/ # Page sections
│ │ │ | ├── ImageDropzoneSection.tsx     
│ │ │ | ├── Sidebar.tsx
│ │ │ ├── ui/ # reusable components
│ │ │ | ├── ControlPanel.tsx    # for uploading images
│ │ │ | ├── Icon.tsx            # Lucide Icon
│ │ │ | ├── ImageGrid.tsx       # for original images and converted
│ │ │ | ├── Icon.tsx            # Lucide Icon    
│ │ ├── hooks/ # Custom hooks (useMultiUpload, etc.)
│ │ ├── utils/ # API, socket, and Cloudinary helpers etc
│ │ ├── pages/ # HomePage for now only
│ ├── public/
│ ├── package.json
│ └── ...
│
├── .gitignore
├── README.md
└── ...
```
---

## 🛠️ Libraries & Stack

- **Backend:** [NestJS](https://nestjs.com/), [Bull (not BullMQ!)](https://docs.nestjs.com/techniques/queues), [Sharp](https://sharp.pixelplumbing.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas/database), [Prisma](https://www.prisma.io/)
- **Queue/Cache:** [Redis](https://redis.com/) (Upstash, RedisCloud, etc)
- **File Storage:** [Cloudinary](https://cloudinary.com/)
- **Frontend:** [React](https://react.dev/) (TypeScript, Vite, Tailwind)
- **WebSocket:** [Socket.IO](https://socket.io/) (real-time converted images)
- **Image Preview:** Data URL streaming (no persistent storage of converted files)
- **Deployment:**  Vercel (soon)

---

## 🌐 Project Flow
1. **Upload:**  
   - User uploads images (React Dropzone UI)
   - Images go directly to Cloudinary (unsigned preset)
2. **Notify backend and  handle job creation:**  
   - Frontend POSTs each Cloudinary URL + meta to `/api/images`
   - Backend queues DB write and conversion jobs via Bull
3. **Convert:**  
   - ConvertProcessor downloads image, converts with Sharp, emits data URL via WebSocket to user
4. **Download:**  
   - User sees results appear instantly and can download one or all converted images
5. **Session:**  
   - Each session is tracked so users only see their own conversions

---

## ✨ Planned/Current Features

- [x] Image upload and conversion endpoint
- [x] Asynchronous processing with BullMQ (switched to Bull)
- [x] File size prediction before conversion
- [ ] ~~Quality/compression options for conversion~~
- [x] Drag-and-drop upload UI
- [x] Multi-file image upload with drag-and-drop
- [x] Format conversion (JPG, PNG, WEBP, SVG)
- [x] File size prediction and display
- [x] Job queuing with Bull and Redis
- [x] Realtime preview via Socket.IO
- [x] Session-based grouping
- [x] Download all / Download single buttons
- [ ] ~~Quality settings~~
- [ ] ~~User auth~~
- [ ] ~~Hosted demo~~

---

## ⚡ Quick Start

```bash
# Backend
cd backend
yarn install
# Add .env file with MongoDB, Redis, and Cloudinary credentials (DATABASE_URL='' CLOUDINARY_CLOUD_NAME= CLOUDINARY_API_KEY= CLOUDINARY_API_SECRET= REDIS_HOST= REDIS_PORT= REDIS_PASSWORD= PORT=3000)
yarn start

# Frontend
cd ../frontend
yarn install
yarn dev
# Make sure VITE_CLOUDINARY_UPLOAD_PRESET and VITE_CLOUDINARY_CLOUD_NAME are set in .env
