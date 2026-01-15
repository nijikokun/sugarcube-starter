import postcssPresetEnv from 'postcss-preset-env';
import csso from 'postcss-csso';

export default {
  plugins: [
    postcssPresetEnv({
      browsers: 'last 2 versions',
    }),
    // Only minify in production
    ...(process.env.NODE_ENV === 'production'
      ? [csso({ restructure: false })]
      : []),
  ],
};
