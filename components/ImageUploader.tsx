import { useState } from "react";
import { auth, storage } from "../lib/firebase";
import Loader from "./Loader";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast from "react-hot-toast";

// Uploads images to Firebase Storage
export default function ImageUploader({ onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file: any = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    // Makes reference to the storage bucket location
    const imageRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Starts the upload
    const uploadTask = uploadBytesResumable(imageRef, file);

    // Listen to updates to upload task
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = parseInt(
          ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
        );
        setProgress(pct);
      },
      (error) => {
        console.log(error);
        toast.error("Failed to upload image!");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url);
          setUploading(false);
          onImageUpload(`![alt](${url})`);
          toast.success("Image successfully uploaded and inserted!");
        });
      }
    );
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}
    </div>
  );
}
