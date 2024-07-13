from flask import Flask, request
from flask_cors import CORS
from keras.models import load_model
from keras.preprocessing import image
from keras.applications.resnet import preprocess_input
import numpy as np
import firebase_admin
from firebase_admin import credentials, storage
import cv2
import PIL
import requests
# Initialize Firebase Admin SDK
cred = credentials.Certificate("C:/Users/Admin/Downloads/Marathi Character Recognition/Marathi Character Recogntion/Backend/jarvis-systems-commons-firebase-adminsdk-7qghi-24244ca155.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'jarvis-systems-commons.appspot.com'})

best_model_char = load_model('MCCV_best_model_M1_V3_Loss.h5')
best_model_num_res = load_model('MNCR_best_model_M1_V1.h5')
best_model_num_vgg = load_model('MNCV__best_model_M1_V3_Loss.h5')

img_path = 'C49_2.jpg'
img_height, img_width = 224, 224

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def process_data():
    data = request.json  # Get JSON data from the request
    model = data.get('model')  # Get the 'model' value from the JSON data
    is_character = data.get('isCharacter')  # Get the 'isCharacter' value from the JSON data
    # Load and preprocess the image
    if is_character:
        # Get image URL from request
        image_url = 'https://firebasestorage.googleapis.com/v0/b/jarvis-systems-commons.appspot.com/o/MarathiCharacterRecognition%2FinputCharacterImage?alt=media&token=d990346a-034e-4a53-b545-74322555158c'
    else:
        image_url = 'https://firebasestorage.googleapis.com/v0/b/jarvis-systems-commons.appspot.com/o/MarathiCharacterRecognition%2FinputNumberImage?alt=media&token=4c57d4f3-e869-4c6d-bcba-e7a8058ec702'
    # Fetch image from Firebase Storage

    response = requests.get(image_url)
    img_path = "input_img.jpg"
    with open(img_path, 'wb') as f:
        f.write(response.content)

    img = image.load_img(img_path, target_size=(img_height, img_width))
    img_array = image.img_to_array(img)
    img_array = preprocess_input(img_array)
    img_tensor = np.expand_dims(img_array, axis=0)
    img_tensor = img_tensor / 255.0
    # Predict using the loaded model

    if is_character:
        prediction = best_model_char.predict(img_tensor, batch_size=32)
        predicted_class_index = np.argmax(prediction)
        return str(predicted_class_index)
    else:
        if model == 'ResNet50':
            prediction = best_model_num_res.predict(img_tensor, batch_size=32)
            predicted_class_index = np.argmax(prediction)

            return str(predicted_class_index)
        elif model == 'VGG16':
            prediction = best_model_num_vgg.predict(img_tensor, batch_size=32)
            predicted_class_index = np.argmax(prediction)
            return str(predicted_class_index)
        elif model == 'EfficientNet':
            prediction = best_model_num_res.predict(img_tensor, batch_size=32)
            predicted_class_index = np.argmax(prediction)
            return str(predicted_class_index)



if __name__ == '__main__':
    app.run(debug=True)
