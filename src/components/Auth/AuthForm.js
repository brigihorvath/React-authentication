import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    try {
      event.preventDefault();
      const enteredEmail = emailInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;
      setIsLoading(true);
      let url = '';
      if (isLogin) {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAc60eTvbeCxkrzRf99FcxGNrUiCA3gBys';
      } else {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAc60eTvbeCxkrzRf99FcxGNrUiCA3gBys';
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsLoading(false);
      const data = await response.json();
      if (response.ok) {
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/');
      } else if (data && data.error && data.error.message) {
        throw new Error(data.error.message);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      // let errorMessage = 'Authentication failed';
      alert(error);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
