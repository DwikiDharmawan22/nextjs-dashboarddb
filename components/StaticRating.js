const StaticRating = ({ rating = 0, maxStars = 5 }) => {
  const fullStars = Math.floor(rating); // Bintang penuh (contoh: 4 dari 4.5)
  const hasHalfStar = rating % 1 >= 0.5; // Apakah ada setengah bintang?
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); // Bintang kosong

  return (
    <div className="flex gap-2 md:gap-4 items-center px-4 md:px-8 lg:px-16">
      {/* Bintang penuh */}
      {[...Array(fullStars)].map((_, index) => (
        <span key={`full-${index}`} className=" text-[#E92020]">★</span>
      ))}

      {/* Setengah bintang (jika ada) */}
      {hasHalfStar && (
        <span className=" text-[#E92020] relative">
          ★
          <span 
            className="absolute inset-0 text-white" 
            style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}
          >
            ★
          </span>
        </span>
      )}

      {/* Bintang kosong */}
      {[...Array(emptyStars)].map((_, index) => (
        <span key={`empty-${index}`} className=" text-white">☆</span>
      ))}

      {/* Nilai numerik (opsional) */}
      <span className="ml-2  text-white">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StaticRating;