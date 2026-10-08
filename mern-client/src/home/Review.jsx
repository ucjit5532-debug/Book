import { FaStar } from 'react-icons/fa6'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

const reviews = [
  {
    name: 'Sample Customer',
    quote:
      'A great place to discover books. The selection made it easy to find my next read.',
    rating: 5,
  },
  {
    name: 'Sample Customer',
    quote:
      'The browsing experience is simple, and I found several interesting titles.',
    rating: 4,
  },
  {
    name: 'Sample Customer',
    quote:
      'An enjoyable way to explore books and discover something new to read.',
    rating: 5,
  },
]

function Review() {
  return (
    <section className="my-12 px-4 lg:px-24" aria-labelledby="customer-reviews">
      <h2
        id="customer-reviews"
        className="mb-10 text-center text-4xl font-bold leading-snug md:text-5xl"
      >
        Our Customers
      </h2>

      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        pagination={{ clickable: true }}
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 32 },
        }}
        modules={[Pagination]}
        className="!pb-12"
      >
        {reviews.map(({ name, quote, rating }, index) => (
          <SwiperSlide key={`${name}-${index}`} className="h-auto">
            <figure className="flex h-full flex-col gap-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div
                className="flex gap-1 text-amber-500"
                role="img"
                aria-label={`${rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    aria-hidden="true"
                    className={starIndex < rating ? '' : 'text-gray-300'}
                  />
                ))}
              </div>

              <blockquote className="flex-1 text-gray-700">
                “{quote}”
              </blockquote>

              <figcaption className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-semibold text-blue-700"
                >
                  {name.charAt(0)}
                </div>
                <span className="font-semibold text-gray-900">{name}</span>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Review
