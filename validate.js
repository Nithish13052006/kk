const fs = require('fs');
const html = fs.readFileSync('c:/Users/nithi/kkbiriyani/index.html', 'utf8');
const checks = [
  'id="home"',
  'id="menu"',
  'id="about"',
  'id="contact"',
  'id="bucket"',
  'floating-wa',
  'nav-header',
  'hero-cta',
  'hero-price',
  'wa.me/917449212192',
  '₹89',
  'Cormorant+Garamond',
];
checks.forEach(s => console.log(s + ':', html.includes(s) ? 'OK' : 'MISSING'));
console.log('\nWhatsApp links:', (html.match(/wa\.me\/917449212192/g) || []).length);

