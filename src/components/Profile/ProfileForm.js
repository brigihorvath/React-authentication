import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import classes from './ProfileForm.module.css';
import AuthContext from '../../store/auth-context';

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const newPswdRef = useRef();
  const history = useHistory();

  const submitHandler = async (event) => {
    try {
      event.preventDefault();

      const newPswd = newPswdRef.current.value;

      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAc60eTvbeCxkrzRf99FcxGNrUiCA3gBys',
        {
          method: 'POST',
          body: JSON.stringify({
            idToken: authCtx.token,
            password: newPswd,
            returnSecureToken: true,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await response.json();
      if (response.ok) {
        history.replace('/');
      } else {
        let errorMessage = 'Password Change failed!';
        if (data?.error?.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPswdRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
