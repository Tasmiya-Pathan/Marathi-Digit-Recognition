import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { app } from '../firebaseConfig';
import { toast } from 'react-toastify';

function Home(props) {
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [apiResponse, setapiResponse] = useState(false);
  const [visibleButton, setvisibleButton] = useState(false);

  const fetchImageUrls = async () => {
    const storage = getStorage(app);
    const storageRefPath = 'MarathiCharacterRecognition/output';
    const imagesRef = storageRef(storage, storageRefPath);

    try {
      const result = await listAll(imagesRef);
      const urls = await Promise.all(result.items.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      }));
      setImageUrls(urls);
      setapiResponse(true);
    } catch (error) {
      console.error('Error while detecting image:', error);
    }
  };

  useEffect(() => {
    fetchImageUrls();
  }, []);

  const handleFileUpload = async (file) => {
    setvisibleButton(false);
    const storage = getStorage(app);
    const storageRefPath = `MarathiCharacterRecognition/inputCharacterImage`;
    const fileRef = storageRef(storage, storageRefPath);

    try {
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      setFileUrl(downloadUrl);
      setUploadedImage(URL.createObjectURL(file));
      setvisibleButton(true)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('image/jpeg')) {
      handleFileUpload(file);
    } else {
      alert('Please select a valid JPEG file.');
    }
  };

  const handleDetection = async (model) => {
    // Call your Flask API here with the selected model
    try {
      // Example fetch call to Flask API
      const response = await fetch(`your_flask_api_endpoint/${model}`, {
        method: 'POST', // or 'GET' depending on your API
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary headers here
        },
        // You may need to send some data along with the request
        // body: JSON.stringify(data),
      });
      if (response.ok) {
        // Handle successful response
        // You may want to update state or show a success message
      } else {
        // Handle error response
        // You may want to show an error message
        console.error('Error calling Flask API:', response.status);
      }
    } catch (error) {
      console.error('Error calling Flask API:', error);
    }
  };

  return (
    <div style={{ marginTop: "20px", marginBottom: "88px" }}>
      <Container className="shadow p-3 border" >
        <Row>

          <Col xs="12" md="6">
            <div className="input-group mb-3">
              <div className="input-group-prepend"></div>
              <div className="custom-file">
                <input type="file" accept=".jpg, .jpeg" className="custom-file-input" onChange={handleFileChange} id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
              </div>
            </div>
          </Col>
          <Col xs="12" md="6">
            {fileUrl && visibleButton && (
              <div>
                <Button color="primary" onClick={() => handleDetection('ResNet50')}>
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Detection Using ResNet50
                </Button>
                <Button color="primary" onClick={() => handleDetection('EfficientNet')}>
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Detection Using EfficientNet
                </Button>
                <Button color="primary" onClick={() => handleDetection('VGG16')}>
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Detection Using VGG16
                </Button>
              </div>
            )}
          </Col>
        </Row>
        {uploadedImage && (
          <Row className="mt-3">
            <Col>
              <div className="alert alert-primary" role="alert">
                Image Uploaded Successfully
              </div>
              <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '45%', height: 'auto' }} />
            </Col>
          </Row>
        )}

        {apiResponse && fileUrl && visibleButton && (
          <Row className="mt-5">
            <Col>
              <div className="alert alert-primary" role="alert">
                Handwritten Marathi Character Recognition using Transfer Learning Models
              </div>
              <div>
                {imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Image ${index}`} style={{ maxWidth: '50%', height: 'auto' }} />
                ))}
              </div>
            </Col>
          </Row>
        )}

      </Container>
    </div>
  );
}

export default Home;
