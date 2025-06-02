import { useRef, useEffect, useState } from 'react';
import { getEmbeddingFromImageData } from '../onnx/faceModel';

// Nhận token từ props
export default function EnrollFace({ token }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      } catch (error) {
        console.error('Error accessing camera:', error);
        setStatus('Failed to access camera');
      }
    }
    start();
  }, []);

  const capture = () => {
    const width = 160, height = 160;
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);
    const floatData = new Float32Array(width * height * 3);
    for (let i = 0; i < width * height; i++) {
      floatData[i] = data[i * 4] / 255;
      floatData[i + width * height] = data[i * 4 + 1] / 255;
      floatData[i + 2 * width * height] = data[i * 4 + 2] / 255;
    }
    return floatData;
  };

  const handleEnroll = async () => {
    if (!token) {
      setStatus('Please log in to enroll face');
      return;
    }

    setStatus('Processing...');
    const imgData = capture();
    try {
      const emb = await getEmbeddingFromImageData(imgData);
      const response = await fetch('/api/v1/user/me/face-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          embedding: Array.from(emb),
        }),
      });

      if (!response.ok) {
        throw new Error('Enrollment failed');
      }

      setStatus('Enrolled successfully!');
    } catch (error) {
      console.error('Error:', error);
      setStatus('Enrollment failed!');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video ref={videoRef} width={160} height={160} className="border" />
      <canvas ref={canvasRef} width={160} height={160} style={{ display: 'none' }} />
      <button onClick={handleEnroll} className="px-4 py-2 bg-green-500 text-white rounded">
        Enroll Face
      </button>
      <div>{status}</div>
    </div>
  );
}