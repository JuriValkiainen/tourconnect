import React from 'react';
import { useTranslation } from 'react-i18next';

const BlogPage = () => {
  const { t } = useTranslation();
  
  // Articles data
  const blogPosts = [
    {
      id: 1,
      title: "10 Must-Visit Places in Our Region",
      date: "April 10, 2023",
      excerpt: "Discover the most picturesque corners of our area that will leave unforgettable impressions...",
      image: "https://th.bing.com/th/id/OIP.UASXDuDICk-JFHPP94h6DwAAAA?w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2",
      category: "Travel Tips"
    },
    {
      id: 2,
      title: "Как подготовиться к горному походу",
      date: "28 марта 2023",
      excerpt: "Полное руководство по подготовке к вашему первому горному походу: от снаряжения до физической подготовки...",
      image: "https://images.pexels.com/photos/20249126/pexels-photo-20249126/free-photo-of-carpathians.jpeg?auto=compress&cs=tinysrgb&w=1600",
      category: "Активный отдых"
    },
    {
      id: 3,
      title: "Parhaat matkailukaudet",
      date: "15. helmikuuta 2023",
      excerpt: "Opi, milloin on parasta vierailla eri alueilla saadaksesi maksimaalisen mielihyvän matkastasi...",
      image: "https://th.bing.com/th/id/OIP.YAQu_elwumh6pdl7FP1rLQHaFj?w=288&h=216&c=8&rs=1&qlt=90&o=6&dpr=3.5&pid=3.1&rm=2",
      category: "Matkavinkit"
    }
  ];
  
  return (
    <div className="w3-container w3-padding-32">
      <h1 className="w3-center w3-text-red">{t('blog_tourists_blog_title')}</h1>
      
      <div className="w3-row-padding w3-margin-top">
        {blogPosts.map(post => (
          <div key={post.id} className="w3-col m4 w3-margin-bottom">
            <div className="w3-card w3-white">
              <img 
                src={post.image} 
                alt={post.title} 
                style={{ width: "100%" }}
                className="w3-hover-opacity"
              />
              <div className="w3-container w3-padding">
                <span className="w3-tag w3-red w3-small">{post.category}</span>
                <h3>{post.title}</h3>
                <p className="w3-opacity">{post.date}</p>
                <p>{post.excerpt}</p>
                <button className="w3-button w3-light-grey w3-block">
                  {t('blog_btn_read_more')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="w3-center w3-margin-top">
        <div className="w3-bar">
          <button className="w3-button w3-red">1</button>
          <button className="w3-button w3-hover-red">2</button>
          <button className="w3-button w3-hover-red">3</button>
          <button className="w3-button w3-hover-red">»</button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;