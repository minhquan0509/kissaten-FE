//import './bookmark.css'
function Bookmark({ isBookmarked, handleBookmarkClick, itemId, event }) {
    //const isBookmarked = bookmarkedItemIds.includes(itemId);
    const handleClick = (e) => {
      e.stopPropagation(); // Ngăn chặn lan truyền sự kiện onclick
      handleBookmarkClick(itemId);
      //console.log(itemId);
    };
  
  return (
    <div className="icon">
      <i
        className={`fa-solid fa-bookmark fa-shake fa-xl ${isBookmarked ? 'bookmarked' : ''}`}
        onClick={handleClick}
        style={{ color: isBookmarked ? '#fad000' : '#f3f3f7' }}
      ></i>
    </div>
  );
}

export default Bookmark