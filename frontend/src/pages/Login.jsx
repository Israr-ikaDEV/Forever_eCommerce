import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { setToken, navigate,token } = useContext(ShopContext);

  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle input changes
  const onNameChange = (e) => setName(e.target.value);
  const onEmailChange = (e) => setEmail(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Handle form submission
    try {
      const userData = { name, email, password };

      let res;

      // Logic for Sign Up
      if (current === 'Sign Up') {
        res = await axios.post('http://localhost:4000/api/user/register', userData);
        toast.success('User signed up:');
        if (res.data.success){
          setToken(res.data.token)
          localStorage.setItem('token',res.data.token)
        }else{
          toast.error(res.data.message)
        }

        // Optionally navigate or display success message after successful sign-up
        navigate('/login'); // Redirect to login page after successful sign-up
      } else {
        // Logic for Login
        res = await axios.post('http://localhost:4000/api/user/login', userData);
        console.log('User logged in:', res.data);

        if (res.data.success){
          setToken(res.data.token)
          localStorage.setItem('token',res.data.token)
          toast.success('Login successful:');

        }else{
          toast.error(res.data.message)
        }
        
      }
    } catch (error) {
      console.error('Error:', error);
toast.error(error.message)    }
  };

  useEffect(()=>{
if(token){
  navigate('/')
}
  },[token])
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text 3x1"> {currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800 " />
      </div>

      <div className="w-full px-3 py-2 flex flex-col gap-4">
        {currentState === 'Sign Up' ? (
          <input
            type="text"
            value={name} // Controlled input
            onChange={onNameChange} // Handle change
            className="w-Full px-3 py-2 border border-gray-880"
            placeholder="Name"
            required
          />
        ) : null}

        <input
          type="email"
          value={email} // Controlled input
          onChange={onEmailChange} // Handle change
          className="w-Full px-3 py-2 border border-gray-880"
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password} // Controlled input
          onChange={onPasswordChange} // Handle change
          className="w-Full px-3 py-2 border border-gray-880"
          placeholder="Password"
          required
        />

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>
          {currentState === 'Login' ? (
            <p
              onClick={() => setCurrentState('Sign Up')}
              className="cursor-pointer"
            >
              Create Account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState('Login')}
              className="cursor-pointer"
            >
              Login Here
            </p>
          )}
        </div>
        <button className="w-1/2 m-auto bg-black text-white px-8 py-2 mt-4 ">
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default Login;
