import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import {logIn, resetPass, sendOtp, verifyUser} from '../api/index';

const ForgotPassword = () => {
  const [choice, setChoice] = useState('') // store the data and verify it
  const [code, setCode] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const navigate=useNavigate();
  
  const handleSend=(e)=>{
    e.preventDefault();
    if(choice){
      sendOtp({choice})
      alert(`Check the otp`);
    } else alert("Enter valid data.");
  };

  const handleVerify = async(e) => {
    e.preventDefault();
    await verifyUser({code})
    .then( e => {
      alert(e.data.message)
      setIsVerified(true);
    }) .catch( e => alert("Incorrect credentials"))
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(isVerified){
      await resetPass({mail,password})
      .then(f => {
        alert(f.data.message)
        console.log(f.data.message);
        navigate("/Auth");
      }) .catch(f => alert("Some error occurred\nTry again"));
    } else alert("Ensure all data is right")
  }

  return (
    <section className=' auth-section' style={{marginTop:'40px'}} >
      <div className=' auth-container-2' >
        <form onSubmit={handleSubmit}>
          <label htmlFor='choice'>
            <h4>Otp via:</h4>
            <input type='text' id='choice' value={choice} onChange={e => setChoice(e.target.value)}/>
          </label>      
          <button className='nav-item nav-links' style={{marginTop:'5px'}} onClick={handleSend}>Send</button>
          
          <label htmlFor='pass'>
            <h4>The code:</h4>
            <input type='number' id='pass' value={code} onChange={e => setCode(e.target.value)}/>
          </label>
          <button className='nav-item nav-links' style={{marginTop:'5px'}} onClick={handleVerify}>Verify</button>

          <label htmlFor='pass'>
            <h4 style={{marginBottom:4}}>Email id</h4>
            <input type='email' name='pass' id='pass' value={mail} onChange={e => setMail(e.target.value)}/>
          </label>
          <label htmlFor='pass'>
            <h4 style={{marginBottom:4}}>New password</h4>
            <input type='password' name='pass' id='pass' value={password} onChange={e => setPassword(e.target.value)}/>
          </label>
          <button type='submit' className=' auth-btn' style={{marginTop:'5px'}} onClick={handleSubmit}>Set password</button>
        </form>
      </div>
    </section>
  )
}

export default ForgotPassword