import { useState } from 'react';

import { dataURItoBlob } from './helpers/dataUriToBlob';

function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();

    const formData  = new FormData();
    formData.append('image', image);

    await fetch('http://localhost:3006/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('file submitted')
  }
  
  function onChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', function() {
      const base64 = reader.result;
      setImagePreview(base64);

      const [blob, mimeType] = dataURItoBlob(base64);
      const imageFile = new File([blob], file.name, {
        type: mimeType,
      });
      setImage(imageFile);
    });

    if (file.type.includes('image/')) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="file" name="image" id="image" onChange={onChange} />
        <br />
        <button type="submit">Submit</button>
      </form>
      {imagePreview !== null && <img src={imagePreview} width={200} alt="" />}
    </>
  )
}

export default App
