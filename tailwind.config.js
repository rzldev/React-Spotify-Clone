module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.675rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
      height: {
        'screen-88': '88vh',
        '120': '30rem',
        '160': '40rem',
        '200': '50rem',
      },
      width: {
        '120': '30rem',
        '160': '40rem',
        '200': '50rem',
        '240': '60rem',
      },
      maxWidth: {
        '32': '8rem',
        '40': '10rem',
        '120': '30rem',
        '160': '40rem',
        '200': '50rem',
        '240': '60rem',
      },
      minHeight: {
        '32': '8rem',
        '40': '10rem',
      },
      maxHeight: {
        '32': '8rem',
        '40': '10rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
      },
      colors: {
        'spotify': '#1ed760',
        '#26856A': '#26856A',
        '#1E3164': '#1E3164',
        '#8D67AC': '#8D67AC',
        '#E8115B': '#E8115B',
        '#D7F27D': '#D7F27D',
        '#A56752': '#A56752',
        '#138A09': '#138A09',
        '#F59B23': '#F59B23',
        '#477E95': '#477E95',
        '#8C1932': '#8C1932',
        'lightGray': '#7A7A7A',
        'grayBody': 'linear-gradient(180deg, rgba(18, 18, 18, 0.9) 0%, rgba(18, 18, 18, 1) 100%)',
        '292929': '#292929',
        '181818': '#181818',
      },
      rotate: {
        '15': '15deg',
        '20': '20deg',
        '25': '25deg',
      },
      inset: {
        30: '30px',
      },
      bottom: {
        30: '30px',
      },
      spacing: {
        30: '30px',
      },
      scale: {
        25: '.25',
        175: '1.75',
        200: '2',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        '4xl': '0 45px 70px -20px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
