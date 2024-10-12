
# LogMyJobs Full-Stack App
## Overview
LogMyJobs is a full-stack web application designed to help you effortlessly track and manage your job applications. From creating detailed job entries to securely updating and deleting records, this app is your go-to tool for mastering your job search and career management.

This is my first full-stack project, leveraging modern web development technologies to deliver an intuitive and seamless user experience.

## Features
* Create Job Entry: Quickly add job opportunities with key details, ensuring you keep track of all your potential career moves.
* Update Job Credentials: Easily edit and update job records, helping you stay up to date with your application progress.
* Log In Securely: Securely log in with a JWT-protected authentication system.
* Delete Job Entries: Effortlessly delete any outdated or irrelevant job entries, keeping your dashboard neat and focused.

## Tech Stack
* Frontend: Built using React.js and deployed on Netlify.
* Backend: Powered by Node.js/Express.js and tested with Postman, the backend is deployed on Render.
* Database: Managed with MongoDB, ensuring reliable storage and retrieval of job data.
* Authentication: JSON Web Token (JWT) for secure user authentication and authorization.

## API Overview
The backend API was tested using `Postman`. You can interact with the API endpoints to manage job entries.
Example:

* `GET Request: {backend-url}/api/v1/jobs`
* `GET Request: {backend-url}/api/v1/jobs/:id`
* `POST Request: {backend-url}/api/v1/jobs`
* `PATCH Request: {backend-url}/api/v1/jobs/:id`
* `DELETE Request: {backend-url}/api/v1/jobs/:id`

Explore the app and take charge of your job search!
