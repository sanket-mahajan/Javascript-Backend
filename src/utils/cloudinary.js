import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      eager: [
        {
          width: 300,
          height: 300,
          crop: "fill",
          gravity: "auto",
          format: "jpg", // Ensures a still image thumbnail is generated
        },
      ],
    });
    // console.log("File is uploaded on cloudinary", response.url);
    // console.log(response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
