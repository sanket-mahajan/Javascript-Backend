# Fusion Stream - Backend

Fusion Stream is a MERN stack application that combines video streaming and microblogging features. This repository contains the backend of the project, built with Node.js, Express, MongoDB, and integrated with Cloudinary for media storage.

## Features

- User authentication (JWT-based login/signup)
- Video upload, retrieval, and management
- Tweet posting, replying, and engagement
- User subscriptions and profile management
- Cloudinary integration for video and image storage
- Search functionality for videos and tweets

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT)
- **Storage:** Cloudinary (for images & videos)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB (local or cloud instance)
- Cloudinary account (for media storage)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/fusion-stream-backend.git
   ```
2. Navigate to the project directory:
   ```sh
   cd fusion-stream-backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Server

Start the backend server using:

```sh
npm start
```

Or use Nodemon for development:

```sh
npm run dev
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Auth Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Video Routes

- `POST /api/videos/upload` - Upload a new video
- `GET /api/videos` - Fetch all videos
- `GET /api/videos/:id` - Fetch a specific video

### Tweet Routes

- `POST /api/tweets` - Create a new tweet
- `GET /api/tweets` - Get all tweets

### User Routes

- `GET /api/users/:id` - Get user profile
- `POST /api/users/subscribe/:id` - Subscribe to a user

## Deployment

To deploy the backend, you can use services like:

- **Render** (Free hosting for Node.js apps)
- **Heroku**
- **Vercel** (For serverless functions)
- **DigitalOcean**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

## License

This project is licensed under the MIT License.
