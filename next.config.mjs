// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// // const path = require('path')
 
// // module.exports = {
// //   sassOptions: {
// //     includePaths: [path.join(__dirname, 'styles')],
// //   },
// // }

// Импортируем path для использования в sassOptions
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')],
  },
};

export default nextConfig;

