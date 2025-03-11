import React, { Suspense, lazy } from 'react';
import Loader from '../Loader/Loader'; // Assuming you have a Loader component for fallback
import WhatsAppFloatButton from '../WhatsAppFloatButton/WhatsAppFloatButton';

// Lazy load child components
const HeroSlider = lazy(() => import('../HeroSlider/HeroSlider'));
const CategoriesPage = lazy(() => import('../CategoriesPage/CategoriesPage'));
const PopularProducts = lazy(() => import('../PopularProducts/PopularProducts'));
const VideoBanner = lazy(() => import('../VideoBanner/VideoBanner'));

const Home = () => {
  return (
    <Suspense fallback={<Loader />}>
      <HeroSlider />
      <WhatsAppFloatButton/>
      <CategoriesPage />
      <PopularProducts />
      <VideoBanner />
    </Suspense>
  );
};

export default Home;
