import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function Showrating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStars = Math.ceil(rating - fullStars);

  const stars = [];

  // Thêm sao đầy
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-star-${i}`} />);
  }

  // Thêm sao nửa
  for (let i = 0; i < halfStars; i++) {
    stars.push(<FaStarHalfAlt key={`half-star-${i}`} />);
  }

  // Thêm sao rỗng
  while (stars.length < 5) {
    stars.push(<FaRegStar key={`empty-star-${stars.length}`} />);
  }

  return <div>{stars}</div>;
}

export default Showrating
