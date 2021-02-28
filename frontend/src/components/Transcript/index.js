import { useEffect, useState } from "react";
import styled from "styled-components";

const TranscriptContainer = styled.div`
  position: relative;

  width: 40%;
  height: ${(props) => props.height}px;

  font-family: var(--primary-font);
  font-size: 16px;
  font-weight: 400;
  text-align: justify;
  color: black;

  padding: 0 24px;
  overflow-y: auto;

  @media (max-width: 1200px) {
    padding: 6px 0;
    padding-bottom: 16px;
    height: initial;
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }

  z-index: 0;
`;

const DownloadDiv = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  align-items: center;
  justify-content: end;

  position: sticky;
  top: 0;

  background-color: white;

  padding-bottom: 8px;
`;

const OptionContainer = styled.div`
  width: 100%;
  display: flex;
`;

const OptionButton = styled.button`
  border: none;
  outline: none;
  background: none;

  font-family: "Montserrat";
  font-size: 16px;

  border-bottom: 2px solid
    ${(props) => (props.isSelected ? "#2d0fb4" : "#979797")};

  flex: 50%;

  padding: 6px;
  margin: 6px;
  margin-bottom: 16px;

  box-sizing: border-box;
`;

const Transcript = ({ videoContainer, transcript, summary, setMessage }) => {
  const [height, setHeight] = useState();
  const [isTranscriptSelected, setIsTranscriptSelected] = useState(true);

  const onDownload = () => {
    isTranscriptSelected
      ? window.download("Transcript.txt", transcript)
      : window.download("Summary.txt", summary);

    setMessage("Starting download!🎉");
    setTimeout(() => setMessage(null), 5000);
  };

  const onCopy = () => {
    const textToBeCopied = isTranscriptSelected ? transcript : summary;

    navigator.clipboard
      .writeText(textToBeCopied)
      .then(() => {
        setMessage("Copied!🎉");
        setTimeout(() => setMessage(null), 5000);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let { current } = videoContainer;
    window.addEventListener("resize", () => setHeight(current.clientHeight));

    setTimeout(() => setHeight(current.clientHeight), 300);

    return () =>
      window.removeEventListener("resize", () =>
        setHeight(current.clientHeight)
      );
  }, [videoContainer]);

  return (
    <TranscriptContainer height={height}>
      <DownloadDiv>
        <OptionContainer>
          <OptionButton
            isSelected={isTranscriptSelected}
            onClick={() => setIsTranscriptSelected(true)}
          >
            Transcript
          </OptionButton>
          <OptionButton
            isSelected={!isTranscriptSelected}
            onClick={() => setIsTranscriptSelected(false)}
          >
            Summary
          </OptionButton>
        </OptionContainer>
        <div className="container is-flex is-justify-content-end is-fluid px-0">
          <button onClick={onCopy} className="button is-black">
            <i className="fas fa-clipboard"></i>
          </button>
          <button onClick={onDownload} className="button is-black ml-2">
            <i className="fas fa-download"></i>
          </button>
        </div>
      </DownloadDiv>
      {isTranscriptSelected ? (
        <>
          <p>{transcript}</p>
        </>
      ) : (
        <>
          <p>{summary}</p>
        </>
      )}
    </TranscriptContainer>
  );
};

export default Transcript;
