import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from Gooey.ai!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Gooey.ai payload
    const payload = {
      text_prompt: prompt,
      selected_models: ['dall_e_3'],
    };

    // Gooey.ai API call
    const response = await fetch("https://api.gooey.ai/v2/CompareText2Img/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.GOOEY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    const result = await response.json();
    const image = result.output.output_images.dall_e_3[0];
    console.log(image);
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Something went wrong');
  }
});

export default router;