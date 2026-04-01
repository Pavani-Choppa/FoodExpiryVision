import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const analyzeImage = async (imagePath) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(imagePath));

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw error;
  }
};