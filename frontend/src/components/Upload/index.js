import axios from "axios";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const SubmitButton = styled.button`
  width: fit-content;

  border: none;
  outline: none;
  background: none;

  border-radius: 4px;

  background-color: #16c79a;
  color: white;

  padding: 12px;

  font-size: 18px;
  font-weight: 500;

  margin-bottom: 8px;

  cursor: pointer;

  transition: all 0.4s ease;

  &:hover {
    background-color: #00af91;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const Upload = ({ setVideo, video, setData, setMessage }) => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const onSubmit = (e) => {
    const URL = "https://summarize-tzgcxgxl4a-wl.a.run.app/videos/create";

    if (video.name) {
      const formData = new FormData();
      formData.append("video", video);
      axios
        .post(URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadStatus(percentage);
          },
        })
        .then((res) => {
          setUploadStatus(null);
          setMessage(null);
          setData(res.data);
        })
        .catch(() => setMessage("seems like we encountered an error🤦‍♂"));

      setMessage("Please wait, while we process your data🥳");
    } else {
      setMessage("uh huh, please select a video😅");
    }
  };

  return (
    <Container>
      <div className="field">
        <div className="file is-boxed has-name is-black">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              name="resume"
              accept="video/mp4"
              onChange={(e) => setVideo(e.target.files[0])}
            />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">Upload!</span>
            </span>
            <span className="file-name">
              {video.name ? video.name : "example-video.mp4"}
            </span>
            {uploadStatus && (
              <progress className="progress" value={uploadStatus} max="100" />
            )}
          </label>
        </div>
      </div>
      <SubmitButton
        className={uploadStatus && "button is-loading"}
        onClick={onSubmit}
      >
        Upload!
      </SubmitButton>
    </Container>
  );
};

export default Upload;
