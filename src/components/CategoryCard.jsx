import { useState } from "react";
import { toPublicPath } from "../routes.js";

export function CategoryCard({ category, count, onNavigate }) {
  const [transform, setTransform] = useState("");

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const angleX = (y - rect.height / 2) / 20;
    const angleY = (rect.width / 2 - x) / 20;
    setTransform(
      `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`
    );
  };

  return (
    <a
      href={toPublicPath(`/categories/${category.id}/`)}
      className={`category-card block w-full rounded-xl overflow-hidden group text-left ${
        category.featured ? "featured-category" : ""
      }`}
      style={{ transform }}
      onClick={(event) => {
        if (!onNavigate) return;
        event.preventDefault();
        onNavigate(`/categories/${category.id}/`);
      }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform("translateY(-5px)")}
    >
      {category.featured ? (
        <FeaturedCategory category={category} count={count} />
      ) : (
        <GradientCategory category={category} count={count} />
      )}
    </a>
  );
}

function FeaturedCategory({ category, count }) {
  return (
    <div className="relative h-48 md:h-64 overflow-hidden">
      <img
        src={category.image}
        alt={category.title}
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="w-16 h-16 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 mx-auto group-hover:bg-white/30 transition-colors duration-300">
          <i className={`fas ${category.icon} text-white text-2xl category-icon`} />
        </div>
        <h3 className="text-2xl font-bold text-white text-center mb-2">{category.title}</h3>
        <p className="text-white/90 text-center">{count} articles</p>
      </div>
    </div>
  );
}

function GradientCategory({ category, count }) {
  return (
    <div className={`relative h-48 overflow-hidden ${category.gradientClass}`}>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors duration-300">
          <i className={`fas ${category.icon} text-white text-xl category-icon`} />
        </div>
        <h3 className="text-xl font-bold text-white text-center mb-2">{category.title}</h3>
        <p className="text-white/90 text-center">{count} articles</p>
      </div>
    </div>
  );
}
