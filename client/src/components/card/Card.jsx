import { Link } from 'react-router';
import './style.scss';
const Card = ({ full_name, brevis, id, code, entity }) => {
  return (
    <li className="card_wrapper">
      <Link to={`/${entity}/${id}`}>{brevis}</Link>
      <p>{full_name}</p>
    </li>
  );
};

export default Card;
