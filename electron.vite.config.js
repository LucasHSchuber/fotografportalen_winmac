// import { resolve } from 'path';
// import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
// import react from '@vitejs/plugin-react';

// // Function to get the platform
// const getPlatform = () => {
//   let platform = process.platform;
//   console.log(platform);
//   return platform;
// };

// const platform = getPlatform();


// const commonConfig = {
//   main: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   preload: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   renderer: {
//     resolve: {
//       alias: {
//         '@renderer': resolve('src/renderer/src'),
//         '@fortawesome/react-fontawesome': '@fortawesome/react-fontawesome'
//       }
//     },
//     publicDir: 'src/assets',
//     plugins: [react()]
//   }
// };

// let platformSpecificConfig = {};

// if (platform === 'darwin') {
//   platformSpecificConfig = {
//     server: {
//       proxy: {
//         '/index.php': {
//           target: 'https://backend.expressbild.org',
//           changeOrigin: true,
//           secure: false,
//           rewrite: (path) => path.replace(/^\/index.php/, '/index.php')
//         }
//       }
//     }
//   };
// }

// export default defineConfig({
//   ...commonConfig,
//   renderer: {
//     ...commonConfig.renderer,
//     ...platformSpecificConfig
//   }
// });



import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@fortawesome/react-fontawesome': '@fortawesome/react-fontawesome'
      }
    },
    publicDir: 'src/assets',
    plugins: [react()],
    server: {
      proxy: {
        '/index.php': {
          target: 'https://backend.expressbild.org',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/index.php/, '/index.php')
        }
      }
    }
  }
})

// import { resolve } from 'path'
// import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   main: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   preload: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   renderer: {
//     resolve: {
//       alias: {
//         '@renderer': resolve('src/renderer/src'),
//         '@fortawesome/react-fontawesome': '@fortawesome/react-fontawesome'

//       }
//     },
//     publicDir: 'src/assets',
//     plugins: [react()]
//   },
  