import React from "react";
import { useNavigate } from "react-router-dom";


const CreateTest = () => {
  const navigate = useNavigate();

  return (
    <div className="create-test">
      <h1>Create Test</h1>
      <button onClick={() => navigate("/upload-pdf")}>Create from PDF</button>
      <button onClick={() => navigate("/manual-test")}>Manually Add Questions</button>
    </div>
  );
};

export default CreateTest;
