import Showrating from "../Rating/showrating";
import Bookmark from "../Bookmark/bookmark";
import { useNavigate } from "react-router-dom";

function CoffeeShopCard({shop, canBookmark = false, bookmarked = false}) {
    const navigate = useNavigate();

    return (
        <div
            className="home-item"
            onClick={() => navigate(`/inforshop/${shop.id}`)}
        >
            <div className="image">
                <img src={(process.env.REACT_APP_SERVER_DOMAIN ? process.env.REACT_APP_SERVER_DOMAIN : 'http://localhost:3001/') + (shop.CoffeeImages.length ? shop.CoffeeImages[0].image : '')} alt="" />
            </div>
            <div className="content">
                <div className="name">{shop.name}</div>
                <div className="rating">
                <Showrating rating={shop.average_rating} />
                </div>
                <div className="description">
                <i className="fa-solid fa-location-dot"></i>
                {shop.address}
                </div>
                <div className="description">
                <i className="fa-solid fa-clock"></i>
                {shop.open_hour}-{shop.close_hour} 毎日
                </div>
            </div>
            {canBookmark &&
                <Bookmark
                    isBookmarked={false}
                    // handleBookmarkClick={handleBookmarkClick}
                    itemId={shop.id}
                />
            }
        </div>
    );
}

export default CoffeeShopCard