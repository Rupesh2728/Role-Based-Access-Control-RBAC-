import React, { useState } from 'react'
import { Form, Link } from 'react-router-dom';

const SignUp = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [nameError, setnameError] = useState(false);
    const [nameErrorMessage, setnameErrorMessage] = useState('');

    const [data,setData] = useState({
        name : "",
        email : "",
        password : "",
     });
  
     const ChangeHandler = (e)=>{
        const {name,value} = e.target;
        setData((prev)=>{
          return {
              ...prev,
              [name] : value,
          }
        })
      
        validateInputs();
      }
       
    const handleSubmit = async () => {
          if (emailError || passwordError) {
            console.log("Error");
            return;
          }
          const url = "http://localhost:5000/register"
          const response = await fetch(url, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(data),
        });
      
        const result = await response.json();
        console.log(result);
        
          setData({
            name : "",
            email : "",
            password : "",
         });
        };

        const isValidEmail = (email) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(email);
      }
      
        const validateInputs = () => {
            let isValid = true;
          
            if (!data.email || !isValidEmail(data.email)) {
              setEmailError(true);
              setEmailErrorMessage('Please enter a valid email address.');
              isValid = false;
            } else {
              setEmailError(false);
              setEmailErrorMessage('');
            }
          
            if (!data.password || data.password.length < 6) {
              setPasswordError(true);
              setPasswordErrorMessage('Password must be at least 6 characters long.');
              isValid = false;
            } else {
              setPasswordError(false);
              setPasswordErrorMessage('');
            }

            if (!data.name) {
              setnameError(true);
              setnameErrorMessage('Enter correct name!');
              isValid = false;
            } else {
              setnameError(false);
              setnameErrorMessage('');
            }
          
            return isValid;
          };
  
    return (
      <>
        <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
            RBAC Dashboard    
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl flex justify-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                   <div>
                     Sign Up 
                  </div>
                </h1>
                <Form className="space-y-4 md:space-y-6">
                    <div>
                        <label name="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                        <input value={data.name} onChange={ChangeHandler} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Sai Pavan" required=""/>
                        {nameError && <p className='text-[0.8rem] text-[red]'>{nameErrorMessage}</p>}
                    </div>
                    
                    <div>
                        <label name="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input value={data.email} onChange={ChangeHandler} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""/>
                        {emailError && <p className='text-[0.8rem] text-[red]'>{emailErrorMessage}</p>}
                    </div>
                    <div>
                        <label name="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Set Password</label>
                        <input value={data.password} onChange={ChangeHandler} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                        {passwordError && <p className='text-[0.8rem] text-[red]'>{passwordErrorMessage}</p>}
                    </div>
                    
                    {
                        !nameError && !emailError && !passwordError && data.name!=="" && data.email!=="" && data.password!=="" && <button onClick={handleSubmit} className="w-full text-white bg-[blue] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Up</button>
                    }

                    {
                       (nameError || emailError || passwordError || data.name==="" || data.email==="" || data.password==="") && <button disabled className="w-full text-white bg-[indianred] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Up</button>
                    }
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Do have an account ? <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</Link>
                    </p>
                </Form>
            </div>
        </div>
    </div>
  </section>
      </>
    );
}

export default SignUp