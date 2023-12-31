import './App.css';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import ReCAPTCHA from "react-google-recaptcha";
import Spotlight from './Spotlight.js';

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [comment, setComment] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const successfulSubmit = () => {
    toast.success("Form submitted successfully."); 
    {
        setFirstName("");
        setLastName("");
        setEmail("");
        setProjectType("");
        setComment("");
        setIsCaptchaValid(false);
        const submitButton = document.getElementById("submit-button");
        submitButton.style.opacity = "1";
        submitButton.style.textDecoration = "none"; 
    };
  }

  const handleCaptchaChange = (value) => {
    setIsCaptchaValid(!!value);
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const isFormComplete = () => {
  
    return (
      firstName.trim() && 
      /^[A-Za-z]+$/.test(firstName) &&
      lastName.trim() &&
      /^[A-Za-z]+$/.test(lastName) &&
      email.trim() && 
      projectType.trim() && 
      comment.trim() &&
      (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    );
  };

  const MAX_COMMENT_LENGTH = 250;

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    if (newComment.length <= MAX_COMMENT_LENGTH) {
      setComment(newComment);
      const submitButton = document.getElementById("submit-button");
      submitButton.disabled = false;
      submitButton.style.opacity = "1";
      submitButton.style.textDecoration = "none";
      submitButton.innerText = "Submit"
      submitButton.style.fontSize = "1.2rem"
    } else {
      toast.error(`Comments should not exceed ${MAX_COMMENT_LENGTH} characters.`);
      const submitButton = document.getElementById("submit-button");
      submitButton.disabled = true;
      submitButton.style.opacity = "0.7";
      submitButton.style.textDecoration = "line-through";
      submitButton.innerText = "Disabled"
    }
  };
  

  async function submitFormToNotion() {

    if (!firstName.trim() || !lastName.trim() || !email.trim() || 
        !projectType.trim() || !comment.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (!/^[A-Za-z]+$/.test(firstName) || !/^[A-Za-z]+$/.test(lastName)) {
      toast.error("First Name and Last Name should contain only alphabetic characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email is invalid. Try again");
      return;
    }

    if (!isCaptchaValid) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }
  
    try {

      const response = await fetch("http://localhost:4000/submitFormToNotion", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: firstName + ' ' + lastName,
          email: email,
          projectType: projectType,
          comment: comment
        }),
      });
     
      if (response.status === 200) {
        successfulSubmit();
      } else if (response.status === 429) {
        toast.error("API rate limit exceeded. Please try again after a few minutes.");
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred while submitting the form.");
    }
  }

  return (
    <div className="App">
       <div className="spotlight-container">
          <Spotlight />
        </div>
    
      <div className='container'>
        <div className='contact'>
          <p>Contact Us</p>
        </div>

        <div className='title'> 
          <h1>FormEase</h1>
        </div>

        <div className="star">
          <div className="centered-content">-</div>
        </div>
        
        <div className='form-container'>
          <div className='form'>
            <div className='form-up'>
              <div className='form-left'>
                <label htmlFor='firstName' className='lblfirstName'>First name</label>
                  <input
                    type='text'
                    id='firstName'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='John'
                    required
                  />

                  <label htmlFor='email' className='lblemail'>Email address</label>
                    <input
                      type='email'
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='john.doe@gmail.com'
                      required
                    />
              </div>

              <div className='form-right'>
                <label htmlFor='lastName' className='lbllastName'>Last name</label>
                <input
                  type='text'
                  id='lastName'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder='Doe'
                  required
                />

                <label htmlFor='projectType' className='lblprojectType'>Project Type</label>
                <select 
                  id='projectType'
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                > 
                  <option value="" disabled defaultValue={""} className='default'>Select one</option>
                  <option value="Application Engineering">Application Engineering</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="End-to-End Automation">End-to-End Automation</option>
                </select>
                
              </div>
            </div>

            <div className='form-down'>
              <label htmlFor='comment' className='lblcomments'>Comments / Feedback</label>
                    <textarea
                      id='comment'
                      value={comment}
                      onChange={handleCommentChange}
                      rows={1}
                      cols={25}
                      placeholder='Type your message here'
                      required
                    />

              {isFormComplete() && (
                  <div className={`rc-anchor ${isFormComplete() ? 'appear' : 'hidden'}`}>
                  <ReCAPTCHA
                    sitekey="6LdQZP8nAAAAAEKRJt6hCbEgK2Ht2k3ETz84l5ZX"
                    onChange={handleCaptchaChange}
                  />
                </div>
              )}

            </div>
            
           <div className='submit-btn'>
              <button
                id="submit-button"
                onClick={submitFormToNotion} 
              >
                <p>Submit</p> 
              </button>
           </div>
           
          </div>
        </div>
        
        <p className='privacy'>Privacy Policy</p>
        <p className='backtotop'> <span className='line'>-------------</span> BACK TO TOP</p>

      </div>
      <ToastContainer />

      <div
        className="spotlight"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >

      </div>
    </div>
  );
}

export default App;
