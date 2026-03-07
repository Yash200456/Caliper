import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white/30 backdrop-blur-md rounded-xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition"
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-5xl mb-4 text-purple-600">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-700 text-sm">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
