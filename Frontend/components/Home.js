import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'reactstrap';
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
  const [isCharacter, setIsCharacter] = useState(false); // Default to number
  const [apiResult, setApiResult] = useState("");

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
    const storageRefPath = isCharacter ? 'MarathiCharacterRecognition/inputCharacterImage' : 'MarathiCharacterRecognition/inputNumberImage'; // Adjust storage reference based on isCharacter
    const fileRef = storageRef(storage, storageRefPath);

    try {
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      setFileUrl(downloadUrl);
      setUploadedImage(URL.createObjectURL(file));
      setvisibleButton(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setApiResult("")
    if (file && file.type.includes('image/jpeg')) {
      handleFileUpload(file);
    } else {
      alert('Please select a valid JPEG file.');
    }
  };

  const handleDetection = async (model) => {
    // Call your Flask API here with the selected model and isCharacter
    try {
      const response = await fetch(`http://127.0.0.1:5000/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, isCharacter }), // Pass both model and isCharacter to the API
      });
      if (response.ok) {
        const textResponse = await response.text(); 
        console.log('Response from Flask API:', textResponse);
        setApiResult(textResponse); // Update the state with the result
      } else {
        // Handle error response
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
          <Col xs="12">
            {/*<ButtonGroup className="mb-3">
              <Button color="primary" onClick={() => setIsCharacter(true)} active={isCharacter}>Character</Button>
              <Button color="primary" onClick={() => setIsCharacter(false)} active={!isCharacter}>Number</Button>
  </ButtonGroup>*/}
          </Col>
        </Row>
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
                {/* <Button color="primary" onClick={() => handleDetection('EfficientNet')}>
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Detection Using EfficientNet
                </Button>
                <Button color="primary" onClick={() => handleDetection('VGG16')}>
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Detection Using VGG16
            </Button>  */}
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
              {apiResponse && fileUrl && visibleButton && (
              <Col>
                <div className="alert alert-primary" role="alert">
                  Handwritten Marathi Digit Recognition
                </div>
                <div>
                  {imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Image ${index}`} style={{ maxWidth: '50%', height: 'auto' }} />
                  ))}
                </div>
                <div className="alert alert-primary" role="alert">
                Result from Flask API: {apiResult}
                </div>
              </Col>
             )}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Home;
