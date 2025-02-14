import React, { useState } from "react";
import axios from "axios";

const ManualTest = () => {
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ 
    question: "", 
    options: ["", "", "", ""], 
    correctAnswer: "" 
  });


  const handleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, question: e.target.value });
  };

  
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

 
  const handleCorrectAnswerChange = (e) => {
    setNewQuestion({ ...newQuestion, correctAnswer: e.target.value });
  };


  const addQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.correctAnswer.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    } else {
      alert("Please complete the question and correct answer!");
    }
  };

 
  const submitTest = async () => {
    if (!testTitle.trim() || questions.length === 0) {
      alert("Please enter a test title and add at least one question.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/create-test",
        { title: testTitle, questions },
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      alert(response.data.message);
      setTestTitle("");
      setQuestions([]);
    } catch (error) {
      console.error("Error submitting test:", error.response ? error.response.data : error);
      alert(error.response?.data?.error || "Error submitting test!");
    }
  };

  return (
    <div>
      <h2>Create Test Manually</h2>
      <input 
        type="text" 
        placeholder="Enter Test Title" 
        value={testTitle} 
        onChange={(e) => setTestTitle(e.target.value)} 
      />

      <div>
        <h3>Add Question</h3>
        <input 
          type="text" 
          placeholder="Enter question" 
          value={newQuestion.question} 
          onChange={handleQuestionChange} 
        />
        {newQuestion.options.map((option, index) => (
          <input 
            key={index} 
            type="text" 
            placeholder={`Option ${index + 1}`} 
            value={option} 
            onChange={(e) => handleOptionChange(index, e.target.value)} 
          />
        ))}
        <input 
          type="text" 
          placeholder="Correct Answer" 
          value={newQuestion.correctAnswer} 
          onChange={handleCorrectAnswerChange} 
        />
        <button onClick={addQuestion}>Add Question</button>
      </div>

      <h3>Questions:</h3>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>
            {q.question} (Correct Answer: {q.correctAnswer})
          </li>
        ))}
      </ul>

      <button onClick={submitTest}>Submit Test</button>
    </div>
  );
};

export default ManualTest;
