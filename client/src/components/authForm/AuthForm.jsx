import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import './style.scss';
import PostgresApi from '../../services/PostgresApi';
import Modal from '../modal/Modal';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getCandidateLogin } from '../../redux/slices/authDataSlice';

const ModalContext = styled.div`
  max-width: 420px;
  width: 100%;
  max-height: 196px;
  height: 100%;
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  color: #6750a4;
  background: #fffbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    margin: 0;
    padding: 0.5rem 2rem;
    font-size: 1.5em;
    text-align: center;
  }
`;

const AuthForm = (props) => {
  const [candidate, setCandidate] = useState({ email: '', password: '' });
  const [isFirstClick, setIsFirstClick] = useState(true);
  const { user, token } = useSelector((state) => state.authData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageModal, setMessageModal] = useState('');
  const navigate = useNavigate();
  const { isLogInForm } = props;
  const postgresApi = new PostgresApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (messageModal) {
      setIsModalOpen(true);
    }
    if (isFirstClick && user) {
      navigate('/main');
      setIsFirstClick(false);
    }
  }, [messageModal, user]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setMessageModal('');
  };

  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    if (candidate.email !== '' && candidate.password !== '') {
      if (isLogInForm) {
        dispatch(getCandidateLogin(candidate));
      } else {
        postgresApi
          .sendRegisterUser(candidate)
          .then((result) => {
            setMessageModal(
              `Пользователь ${candidate.email} успешно зарегистрирован`
            );
          })
          .catch((e) => {
            setMessageModal(e);
          });
      }
      setCandidate({ email: '', password: '' });
    } else {
      setMessageModal('Заполните все поля формы');
    }
  };

  return (
    <form className="form_container">
      <h3>{isLogInForm ? 'Login form' : 'Register form'}</h3>
      <div className="input_group">
        <label
          htmlFor="email"
          className="custom-field"
          aria-label="Enter Email"
        >
          Email
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            value={candidate.email}
          />
        </label>
        <label
          htmlFor="password"
          className="custom-field"
          aria-label="Enter Pasword"
        >
          Password
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            value={candidate.password}
          />
        </label>
      </div>
      <div className="btn_container">
        <a className="form_btn" onClick={handleClick}>
          {isLogInForm ? 'Log In' : 'Sign Up'}
        </a>
      </div>
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <ModalContext>
            <p>{messageModal}</p>
          </ModalContext>
        </Modal>
      )}
      {/* {user?.email && <Navigate to="/main" />} */}
    </form>
  );
};

export default AuthForm;
