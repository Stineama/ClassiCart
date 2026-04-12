# ClassiCart

ClassiCart is a simple e-commerce website built using HTML, Tailwind CSS, and vanilla JavaScript. The project was created to simulate a basic online shopping experience with a clean and responsive interface.

This version of the project is structured as a multi-page website. It includes a homepage, about page, products page, contact page, login page, and register page. The design style remains consistent across all pages so the site still feels like one complete store.

Products displayed on the site are not hardcoded. The project integrates the DummyJSON API to fetch product data dynamically. The homepage shows the first 20 products, while the products page gives access to a larger product listing of about 40 to 50 items.

Users can add products to cart from both the homepage and the products page. The cart system is handled on the frontend using localStorage, which means added items remain available even after refreshing the page or moving between pages.

The login and register pages include basic validation requirements such as required fields, valid email format, minimum password length, and password confirmation matching.

The layout was built with a mobile-first approach, ensuring that the navigation, hero section, product grid, forms, and spacing adapt properly across different screen sizes while maintaining the same design direction.
