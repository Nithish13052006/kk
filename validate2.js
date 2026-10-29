const fs = require('fs');
const html = fs.readFileSync('c:/Users/nithi/kkbiriyani/index.html', 'utf8');
const js   = fs.readFileSync('c:/Users/nithi/kkbiriyani/script.js',  'utf8');
const css  = fs.readFileSync('c:/Users/nithi/kkbiriyani/style.css',  'utf8');

const htmlChecks = [
  'catering-section', 'catering-track', 'catering-prev', 'catering-next',
  'catering-dots', 'catering-progress-bar', 'slide-video', 'slide-event-tag',
  'Birthday Parties', 'Weddings', 'Corporate Events', 'Any Occasion',
  'id="catering"', 'href="#catering"'
];
htmlChecks.forEach(s => console.log('HTML | ' + s + ': ' + (html.includes(s) ? 'OK' : 'MISSING')));

const jsChecks  = ['catering-track', 'goTo', 'startAuto', 'touchstart', 'ArrowRight'];
jsChecks.forEach(s  => console.log('JS  | ' + s + ': ' + (js.includes(s) ? 'OK' : 'MISSING')));

const cssChecks = ['.catering-slide', '.slide-video', '.catering-dot', '.catering-arrow', '.catering-progress'];
cssChecks.forEach(s => console.log('CSS | ' + s + ': ' + (css.includes(s) ? 'OK' : 'MISSING')));

