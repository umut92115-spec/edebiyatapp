import React, { lazy } from 'react';
import literatureData from './data/literatureData.json';
import App from './App';

// Lazy loaded components
const HomeScreen = lazy(() => import('./components/HomeScreen'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const QuizScreen = lazy(() => import('./components/QuizScreen'));
const PeriodsView = lazy(() => import('./components/PeriodsView'));
const AuthorsView = lazy(() => import('./components/AuthorsView'));

// Static pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

const allCategories = literatureData.categories;

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeScreen categories={allCategories} /> },
      { path: 'quiz', element: <QuizScreen categories={allCategories} /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'hakkimizda', element: <AboutPage /> },
      { path: 'iletisim', element: <ContactPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:postId', element: <BlogPostPage /> },
      { path: ':categorySlug', element: <PeriodsView categories={allCategories} /> },
      { path: ':categorySlug/:periodSlug', element: <AuthorsView categories={allCategories} /> },
      { path: ':categorySlug/:periodSlug/:authorSlug', element: <AuthorsView categories={allCategories} /> },
    ]
  }
];
