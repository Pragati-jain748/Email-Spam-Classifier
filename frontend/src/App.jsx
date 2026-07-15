import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [email, setEmail] = useState("");
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);


  const handlePredict = async () => {
    if (email.trim() === "") {
      alert("⚠️ Please enter an email first.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("https://email-spam-classifier-pft3.onrender.com/predict", { email });

      await new Promise(resolve => setTimeout(resolve, 1000));


      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
    }

    catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }

    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container">
        <div className="card">
          <h1>🛡️ Email Spam Classifier</h1>
          <p>🔍 Analyze emails instantly using Machine Learning</p>


          <textarea type='text'
            placeholder="📧 Enter your email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.trim() === "") {
                setPrediction("");
                setConfidence("");
              }
            }} />
          <p>{email.length} Characters</p>

          <button
            onClick={handlePredict}
            disabled={loading}
            className={loading ? "loading-btn" : ""}
          >
            {loading ? "⏳ Analyzing..." : "🚀 Analyze Email"}
          </button>

          {prediction && (
            <div className="result">

              <span className={prediction === "Spam" ? "spam" : "ham"}>
                {prediction}
              </span>

              {prediction === "Spam" ? (
                <>
                  <h3>🚨 Spam Detected</h3>
                  <p>This email looks suspicious.</p>
                  <p>Avoid clicking unknown links.</p>
                </>
              ) : (
                <>
                  <h3>✅ Safe Email</h3>
                  <p>This email appears to be legitimate.</p>
                  <p>No suspicious content was detected.</p>
                </>
              )}
              <p>Confidence: {confidence}%</p>
            </div>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>Made with ❤️ by Pragati Jain</p>
        <div className="tech-stack">
          <span>⚛ React</span>
          <span>🚀 Express</span>
          <span>⚡ FastAPI</span>
          <span>🤖 Machine Learning</span>
        </div>
      </footer>
    </>
  )
}

export default App;