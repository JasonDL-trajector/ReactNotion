import './App.css';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import ReCAPTCHA from "react-google-recaptcha";
import Spotlight from './Spotlight.js';
import RecaptchaVerifier from './RecaptchaVerifier';


const rateLimiter = {
  isEnabled: false,
  limit: 5,
  counter: 0, 
};

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [comment, setComment] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const successfulSubmit = () => {
    toast.success("Successful submission.", {
      onClose: () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setProjectType("");
        setComment("");
        setIsCaptchaValid(false);
        const submitButton = document.getElementById("submit-button");
        submitButton.style.opacity = "1";
        submitButton.style.textDecoration = "none";
      },
    });
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
      lastName.trim() &&
      email.trim() && 
      projectType.trim() && 
      comment.trim() &&
      (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    );
  };

  async function submitFormToNotion() {

    if (rateLimiter.isEnabled) {
      toast.error("Rate limit exceeded. Please try again later.");
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim() || 
        !projectType.trim() || !comment.trim()) {
      toast.error("All fields are required");
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

      rateLimiter.counter++;

      if (rateLimiter.counter > rateLimiter.limit) {
        rateLimiter.isEnabled = true;
        const submitButton = document.getElementById("submit-button");
        if (submitButton) {
          submitButton.style.opacity = "0.5";
          submitButton.style.textDecoration = "line-through";
        }
      }

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
        })
      }, successfulSubmit());
      
      if (response.status === 429) {
        toast.error("API rate limit exceeded. Please try again later.");
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
                      placeholder='johndoe@gmail.com'
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
                      onChange={(e) => setComment(e.target.value)}
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
