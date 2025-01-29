import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from '../components/ProductItem';

const BestSellers = () => {
  const { listProduct } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    // Check if listProduct is not null or undefined
    if (listProduct && Array.isArray(listProduct)) {
      console.log('listProduct:', listProduct); // Debugging line to check the data
      const bestProduct = listProduct.filter((products) => products.bestSeller);
      setBestSeller(bestProduct.slice(0, 5));
    }
  }, [listProduct]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Our best-selling products that our customers can not get enough of.
          Shop the most popular items from our store.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.length > 0 ? (
          bestSeller.map((product, idx) => (
            <ProductItem
              key={idx}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No best sellers available.</p>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
