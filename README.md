# 🔢 Marathi Digit Recognition Web App

A full-stack web application to recognize handwritten Marathi digits (0–9) using a **ResNet50** model as a feature extractor. The project includes a ReactJS-based frontend and a Python Flask backend with Firebase integration for real-time image prediction.

---

## 📌 Project Overview

This project classifies handwritten Marathi digits using a trained **ResNet50** model. The application is split into three main parts:

- 🧠 **Model Training**: A ResNet50-based model is trained on a Marathi digit dataset using a Kaggle notebook.
- 🖼️ **Frontend (ReactJS)**: A simple and interactive UI where users can upload an image and click a button to recognize the digit.
- 🔙 **Backend (Flask API)**: Handles the image received from Firebase, runs prediction using the trained model, and returns the recognized digit.

---

## 💡 Features

- ✅ Recognizes handwritten Marathi digits (0–9)
- 🧠 Uses **ResNet50** as a feature extractor for high accuracy
- 🔥 Integrated with **Firebase** for image storage & retrieval
- 🌐 Clean and minimal frontend UI with ReactJS
- 🔁 Real-time prediction through Python Flask API

---

## 🚀 Tech Stack

**Frontend:**
- ReactJS
- Firebase (for image upload and retrieval)

**Backend:**
- Python
- Flask
- TensorFlow / Keras (ResNet50 model)
- Firebase Admin SDK

**Model Training:**
- Jupyter Notebook on Kaggle
- Marathi digit dataset  (Own dataset uploaded on Kaggle)
- ResNet50 model with final classification layer

---

## 🖥️ How It Works

1. User uploads an image of a handwritten Marathi digit.
2. Image is stored on Firebase.
3. Flask API fetches the image from Firebase.
4. ResNet50-based model predicts the digit.
5. Result is displayed in the UI.

---
